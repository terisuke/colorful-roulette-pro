
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RouletteItem } from '../types';
import { audioService } from '../utils/audio';

interface RouletteWheelProps {
  items: RouletteItem[];
  isSpinning: boolean;
  onSpinEnd: (item: RouletteItem) => void;
  targetRotation?: number;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ items, isSpinning, onSpinEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTickAngleRef = useRef(0);
  const requestRef = useRef<number>();

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    ctx.clearRect(0, 0, size, size);

    if (items.length === 0) {
      // Draw empty placeholder
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 5;
      ctx.stroke();
      return;
    }

    const sliceAngle = (Math.PI * 2) / items.length;

    items.forEach((item, i) => {
      const startAngle = i * sliceAngle + rotationRef.current;
      const endAngle = startAngle + sliceAngle;

      // Draw Slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Noto Sans JP';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(item.text, radius - 20, 10);
      ctx.restore();
    });

    // Draw center pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [items]);

  const animate = useCallback(() => {
    if (velocityRef.current > 0.001) {
      rotationRef.current += velocityRef.current;
      velocityRef.current *= 0.985; // Friction

      // Audio tick calculation
      const sliceAngle = (Math.PI * 2) / items.length;
      const currentAnglePos = rotationRef.current % (Math.PI * 2);
      const normalizedPrev = lastTickAngleRef.current % sliceAngle;
      const normalizedCurr = rotationRef.current % sliceAngle;
      
      if (normalizedCurr < normalizedPrev) {
        audioService.playTick();
      }
      lastTickAngleRef.current = rotationRef.current;

      drawWheel();
      requestRef.current = requestAnimationFrame(animate);
    } else if (isSpinning) {
      // Finished spinning
      const finalAngle = (rotationRef.current % (Math.PI * 2));
      // Calculate which item is at the TOP (1.5 * PI)
      // The needle is at 1.5 * PI (top)
      // Item angle is (i * slice + rotation)
      // We want to find i such that (i * slice + rotation) covers the 1.5 * PI point
      const sliceAngle = (Math.PI * 2) / items.length;
      
      // Target is top center: 270 degrees = 1.5 * Math.PI
      // In the canvas coord system, 0 is right.
      // We want to find which segment covers the angle 1.5 * PI
      // Segment i starts at rotation + i * sliceAngle
      let winningIndex = -1;
      const normalizedRotation = rotationRef.current % (Math.PI * 2);
      
      for(let i=0; i<items.length; i++) {
        let start = (normalizedRotation + i * sliceAngle) % (Math.PI * 2);
        let end = (start + sliceAngle) % (Math.PI * 2);
        
        const needle = Math.PI * 1.5;
        
        if (start < end) {
          if (needle >= start && needle <= end) winningIndex = i;
        } else {
          // Crosses zero
          if (needle >= start || needle <= end) winningIndex = i;
        }
      }

      if (winningIndex !== -1) {
        onSpinEnd(items[winningIndex]);
      }
    }
  }, [items, isSpinning, onSpinEnd, drawWheel]);

  useEffect(() => {
    if (isSpinning && velocityRef.current <= 0.001) {
      velocityRef.current = Math.random() * 0.4 + 0.3; // Random initial speed
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isSpinning, animate]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Top Indicator */}
      <div className="absolute -top-4 z-10 text-yellow-400 drop-shadow-lg">
        <i className="fa-solid fa-caret-down text-5xl"></i>
      </div>
      
      <div className="canvas-container bg-slate-800 rounded-full p-2 border-8 border-slate-700 shadow-2xl overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="max-w-full h-auto rounded-full"
        />
      </div>
    </div>
  );
};

export default RouletteWheel;

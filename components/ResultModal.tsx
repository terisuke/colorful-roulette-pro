
import React from 'react';
import { RouletteItem } from '../types';

interface ResultModalProps {
  item: RouletteItem | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-slate-900 border border-white/20 p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-bounce-in text-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: item.color }} />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: item.color }} />

        <div className="relative z-10">
          <div className="mb-4 text-yellow-400 text-5xl">
            <i className="fa-solid fa-crown animate-bounce"></i>
          </div>
          
          <h3 className="text-xl text-slate-400 mb-2 uppercase tracking-widest font-bold">当選結果</h3>
          
          <div 
            className="text-4xl font-black mb-8 px-4 py-6 rounded-2xl shadow-inner border border-white/5"
            style={{ color: item.color, backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            {item.text}
          </div>

          <button
            onClick={onClose}
            className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors shadow-lg"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;

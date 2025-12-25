
import React, { useState, useCallback } from 'react';
import { RouletteItem } from './types';
import RouletteWheel from './components/RouletteWheel';
import ItemList from './components/ItemList';
import ResultModal from './components/ResultModal';
import { audioService } from './utils/audio';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', 
  '#d946ef', '#f43f5e'
];

const App: React.FC = () => {
  const [items, setItems] = useState<RouletteItem[]>([
    { id: '1', text: '焼肉', color: PRESET_COLORS[0] },
    { id: '2', text: '寿司', color: PRESET_COLORS[1] },
    { id: '3', text: 'ラーメン', color: PRESET_COLORS[2] },
    { id: '4', text: 'ピザ', color: PRESET_COLORS[3] },
    { id: '5', text: 'うどん', color: PRESET_COLORS[4] },
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<RouletteItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCallback((text: string) => {
    const newItem: RouletteItem = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      color: PRESET_COLORS[items.length % PRESET_COLORS.length]
    };
    setItems(prev => [...prev, newItem]);
    setError(null);
  }, [items]);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleStartSpin = () => {
    if (items.length < 2) {
      setError('2つ以上の項目を入力してください！');
      return;
    }
    setWinner(null);
    setIsSpinning(true);
    setError(null);
  };

  const handleSpinEnd = useCallback((winningItem: RouletteItem) => {
    setIsSpinning(false);
    setWinner(winningItem);
    audioService.playFanfare();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-4 flex items-center justify-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          <i className="fa-solid fa-dharmachakra animate-spin-slow"></i>
          Colorful Roulette
        </h1>
        <p className="text-slate-400 font-medium">何にしようか迷ったら、運に任せてみよう！</p>
      </header>

      {/* Error Toast */}
      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-3 rounded-xl flex items-center gap-3 animate-bounce">
          <i className="fa-solid fa-triangle-exclamation"></i>
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left Side: The Wheel */}
        <section className="flex-1 flex flex-col items-center gap-8">
          <RouletteWheel 
            items={items} 
            isSpinning={isSpinning} 
            onSpinEnd={handleSpinEnd} 
          />
          
          <button
            onClick={handleStartSpin}
            disabled={isSpinning || items.length === 0}
            className={`
              relative group
              px-12 py-5 rounded-full text-2xl font-black transition-all transform
              ${isSpinning ? 'bg-slate-700 cursor-not-allowed scale-95' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-110 active:scale-90 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]'}
            `}
          >
            <span className="relative z-10 flex items-center gap-3">
              <i className={`fa-solid ${isSpinning ? 'fa-spinner fa-spin' : 'fa-play'}`}></i>
              {isSpinning ? '回転中...' : 'スタート！'}
            </span>
            {!isSpinning && (
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </section>

        {/* Right Side: Control Panel */}
        <section className="w-full lg:w-auto">
          <ItemList 
            items={items} 
            onAdd={addItem} 
            onRemove={removeItem} 
            disabled={isSpinning} 
          />
        </section>
      </main>

      {/* Result Presentation */}
      <ResultModal 
        item={winner} 
        onClose={() => setWinner(null)} 
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}} />
    </div>
  );
};

export default App;

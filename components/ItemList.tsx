
import React, { useState } from 'react';
import { RouletteItem } from '../types';

interface ItemListProps {
  items: RouletteItem[];
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
  disabled: boolean;
}

const ItemList: React.FC<ItemListProps> = ({ items, onAdd, onRemove, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col h-[400px]">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <i className="fa-solid fa-list-check text-blue-400"></i>
        項目リスト ({items.length})
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="新しい項目を追加..."
          disabled={disabled}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
        />
        <button
          type="submit"
          disabled={disabled || !inputValue.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          追加
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 item-list-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
            <i className="fa-solid fa-box-open text-4xl"></i>
            <p>項目がありません</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li 
                key={item.id}
                className="flex items-center justify-between bg-slate-800/80 p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.text}</span>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  disabled={disabled}
                  className="text-slate-500 hover:text-red-400 p-2 rounded-full hover:bg-red-400/10 transition-all disabled:opacity-0"
                  title="削除"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ItemList;

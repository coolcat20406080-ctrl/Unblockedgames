import React from 'react';
import { Shield, Plus, Eye, Shuffle } from 'lucide-react';

export const Header = ({
  onOpenCloakModal,
  onOpenAddModal,
  onTriggerDecoy,
  onRandomGame,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onSelectCategory('All')}
          className="text-lg font-bold tracking-tight text-slate-100 hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          Apex Games
        </button>

        {/* Zone 2: 4-5 concise single-line nav links with hover underlines */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => onSelectCategory('All')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:underline ${
              selectedCategory === 'All' ? 'text-indigo-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => onSelectCategory('Arcade')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:underline ${
              selectedCategory === 'Arcade' ? 'text-indigo-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Arcade
          </button>
          <button
            onClick={() => onSelectCategory('Puzzle')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:underline ${
              selectedCategory === 'Puzzle' ? 'text-indigo-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Puzzle
          </button>
          <button
            onClick={() => onSelectCategory('Action')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:underline ${
              selectedCategory === 'Action' ? 'text-indigo-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Action
          </button>
          <button
            onClick={() => onSelectCategory('Favorites')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:underline ${
              selectedCategory === 'Favorites' ? 'text-indigo-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Favorites
          </button>
        </nav>

        {/* Zone 3: Primary Action & Stealth Utilities */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onRandomGame}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            title="Play a random game"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Random
          </button>

          <button
            onClick={onOpenCloakModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            title="Disguise tab name & icon"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Cloak</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            title="Add custom game or import JSON"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Add Game</span>
          </button>

          <button
            onClick={onTriggerDecoy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-200 bg-rose-950/40 border border-rose-800/60 rounded-lg hover:bg-rose-900/50 hover:border-rose-700 transition-colors whitespace-nowrap shrink-0"
            title="Panic key: instantly open decoy coursework"
          >
            <Eye className="w-3.5 h-3.5 text-rose-400" />
            Panic (Esc)
          </button>
        </div>
      </div>
    </header>
  );
};

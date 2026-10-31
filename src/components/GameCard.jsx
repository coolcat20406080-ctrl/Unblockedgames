import React from 'react';
import { Star, Play, Gamepad2 } from 'lucide-react';

export const GameCard = ({
  game,
  onSelect,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div
      onClick={() => onSelect(game)}
      className="group relative bg-slate-900 border border-slate-800/90 rounded-xl overflow-hidden hover:border-slate-700 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Banner / Graphic representation */}
      <div className="relative aspect-16/10 bg-slate-950 flex items-center justify-center border-b border-slate-800/80 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #64748b 1px, transparent 0)`,
            backgroundSize: '16px 16px'
          }}
        />

        {/* Center Game Icon / Visual Indicator */}
        <div className="relative z-1 flex flex-col items-center gap-2 group-hover:scale-105 transition-transform duration-200">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500/50 group-hover:text-indigo-300 transition-colors shadow-inner">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
            {game.category}
          </span>
        </div>

        {/* Favorite Quick Button */}
        <button
          onClick={(e) => onToggleFavorite(game.id, e)}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg border backdrop-blur-xs transition-colors z-2 ${
            isFavorite
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-amber-400 hover:border-slate-700'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Play Overlay on Hover */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-1">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-lg">
            <Play className="w-3.5 h-3.5 fill-white" />
            Launch Game
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
            {game.title}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Unboxed Metadata with · separator */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>{game.category}</span>
            <span aria-hidden="true">·</span>
            <span>{game.plays.toLocaleString()} plays</span>
          </div>
          <span className="text-amber-400/90 font-medium">★ {game.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

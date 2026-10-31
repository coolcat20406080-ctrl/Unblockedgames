import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Maximize2,
  RotateCcw,
  ExternalLink,
  Star,
  Info,
  Layers,
  Share2
} from 'lucide-react';
import { openAboutBlankGame } from '../utils/cloak.js';

export const GamePlayer = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
  allGames
}) => {
  const [isTheater, setIsTheater] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  const handleReload = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '?game=' + game.id);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const relatedGames = allGames
    .filter(g => g.id !== game.id && (g.category === game.category || g.featured))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top action row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(game.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isFavorite
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copiedLink ? 'Link Copied!' : 'Share'}
          </button>

          <button
            onClick={() => openAboutBlankGame(game.iframeUrl, game.title)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Open in stealth about:blank window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">About:Blank Popout</span>
          </button>
        </div>
      </div>

      {/* Iframe Viewport Container */}
      <div
        ref={containerRef}
        className={`bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all relative ${
          isTheater ? 'w-full' : 'max-w-5xl mx-auto'
        }`}
      >
        {/* Iframe Frame Toolbar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="text-xs font-semibold text-slate-200 truncate">{game.title}</span>
            <span className="text-xs text-slate-500 hidden sm:inline">· {game.category}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReload}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
              title="Reload Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsTheater(!isTheater)}
              className={`p-1.5 rounded transition-colors ${
                isTheater ? 'text-indigo-400 bg-slate-800' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
              title="Toggle Theater Mode"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={handleFullscreen}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Iframe Itself */}
        <div className="relative w-full aspect-4/3 sm:aspect-16/10 md:aspect-16/9 bg-slate-950 flex items-center justify-center min-h-[460px]">
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={game.iframeUrl}
            title={game.title}
            className="w-full h-full border-0"
            allow="fullscreen; autoplay; gamepad"
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
            loading="eager"
          />
        </div>
      </div>

      {/* Game Details & Controls Bar */}
      <div className={`space-y-4 ${isTheater ? 'w-full' : 'max-w-5xl mx-auto'}`}>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">{game.title}</h1>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                <span>{game.category}</span>
                <span aria-hidden="true">·</span>
                <span>{game.plays.toLocaleString()} plays</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400">★ {game.rating.toFixed(1)}</span>
                {game.author && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>By {game.author}</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowControls(!showControls)}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium self-start sm:self-auto"
            >
              <Info className="w-4 h-4" />
              {showControls ? 'Hide Controls' : 'Show Controls'}
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-4 leading-relaxed max-w-3xl">
            {game.description}
          </p>

          {showControls && game.controls && (
            <div className="mt-4 p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Controls & Keybindings
              </div>
              <div className="text-xs font-mono text-emerald-400">
                {game.controls}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
            {game.tags.map(tag => (
              <span key={tag} className="text-slate-400">#{tag}</span>
            ))}
          </div>
        </div>

        {/* More Games Strip */}
        {relatedGames.length > 0 && (
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">You Might Also Like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedGames.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onSelectGame(rel)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-slate-700 hover:bg-slate-800/80 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-slate-100 truncate">{rel.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{rel.description}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{rel.category}</span>
                    <span className="text-amber-400">★ {rel.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

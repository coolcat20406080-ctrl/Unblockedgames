/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import initialGamesData from './data/games.json';
import { Header } from './components/Header.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { CloakModal } from './components/CloakModal.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { DecoyScreen } from './components/DecoyScreen.jsx';
import { applyCloakProfile } from './utils/cloak.js';
import { Search, Sparkles, Filter, X, Play } from 'lucide-react';

export default function App() {
  const [games, setGames] = useState(initialGamesData);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState([]);
  const [recentPlays, setRecentPlays] = useState([]);

  // Modals & Decoy
  const [isCloakOpen, setIsCloakOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDecoyActive, setIsDecoyActive] = useState(false);
  const [cloakProfile, setCloakProfile] = useState('default');
  const [panicKey, setPanicKey] = useState('Escape');

  // Load custom data & settings from localStorage
  useEffect(() => {
    // 1. Cloak profile
    const savedCloak = localStorage.getItem('apex_cloak_profile');
    if (savedCloak) {
      setCloakProfile(savedCloak);
      applyCloakProfile(savedCloak);
    }

    // 2. Panic Key
    const savedPanic = localStorage.getItem('apex_panic_key');
    if (savedPanic) setPanicKey(savedPanic);

    // 3. Favorites
    const savedFavs = localStorage.getItem('apex_favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {}
    }

    // 4. Recent Plays
    const savedRecents = localStorage.getItem('apex_recents');
    if (savedRecents) {
      try {
        setRecentPlays(JSON.parse(savedRecents));
      } catch (e) {}
    }

    // 5. Custom Games
    const savedCustom = localStorage.getItem('apex_custom_games');
    if (savedCustom) {
      try {
        const customItems = JSON.parse(savedCustom);
        setGames(prev => {
          const ids = new Set(prev.map(g => g.id));
          const uniqueCustom = customItems.filter(g => !ids.has(g.id));
          return [...prev, ...uniqueCustom];
        });
      } catch (e) {}
    }

    // 6. Check URL query for direct game link
    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get('game');
    if (gameParam) {
      const found = initialGamesData.find(g => g.id === gameParam);
      if (found) setSelectedGame(found);
    }
  }, []);

  // Panic Key Global Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === panicKey) {
        e.preventDefault();
        setIsDecoyActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicKey]);

  // Handle Game Selection & History
  const handleSelectGame = (game) => {
    setSelectedGame(game);
    // Update recent plays
    const updated = [game.id, ...recentPlays.filter(id => id !== game.id)].slice(0, 20);
    setRecentPlays(updated);
    localStorage.setItem('apex_recents', JSON.stringify(updated));

    // Update play count in state
    setGames(prev => prev.map(g => g.id === game.id ? { ...g, plays: g.plays + 1 } : g));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Favorite
  const handleToggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('apex_favorites', JSON.stringify(updated));
  };

  // Add Custom Game
  const handleAddGame = (newGame) => {
    const updated = [newGame, ...games];
    setGames(updated);
    // Save to custom storage
    const customOnly = updated.filter(g => g.isCustom);
    localStorage.setItem('apex_custom_games', JSON.stringify(customOnly));
    handleSelectGame(newGame);
  };

  // Import Full Games List
  const handleImportGames = (imported) => {
    const idMap = new Map();
    games.forEach(g => idMap.set(g.id, g));
    imported.forEach(g => idMap.set(g.id, g));
    const merged = Array.from(idMap.values());
    setGames(merged);
    const customOnly = merged.filter(g => g.isCustom);
    localStorage.setItem('apex_custom_games', JSON.stringify(customOnly));
  };

  // Random Game
  const handleRandomGame = () => {
    if (games.length === 0) return;
    const rand = games[Math.floor(Math.random() * games.length)];
    handleSelectGame(rand);
  };

  // Filtered & Sorted Games List
  const filteredGames = useMemo(() => {
    return games
      .filter(game => {
        // Category filter
        if (selectedCategory === 'Favorites') {
          if (!favorites.includes(game.id)) return false;
        } else if (selectedCategory === 'Custom') {
          if (!game.isCustom) return false;
        } else if (selectedCategory !== 'All') {
          if (game.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchDesc = game.description.toLowerCase().includes(q);
          const matchAuthor = game.author?.toLowerCase().includes(q);
          const matchTag = game.tags.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchAuthor && !matchTag) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.plays - a.plays;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
        if (sortBy === 'recent') {
          const idxA = recentPlays.indexOf(a.id);
          const idxB = recentPlays.indexOf(b.id);
          if (idxA === -1 && idxB === -1) return 0;
          if (idxA === -1) return 1;
          if (idxB === -1) return -1;
          return idxA - idxB;
        }
        return 0;
      });
  }, [games, selectedCategory, searchQuery, sortBy, favorites, recentPlays]);

  // Featured game for Hero spotlight
  const heroGame = useMemo(() => {
    return games.find(g => g.id === 'snake-classic') || games[0];
  }, [games]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Decoy Screen for Panic Mode */}
      {isDecoyActive && (
        <DecoyScreen onExit={() => setIsDecoyActive(false)} />
      )}

      {/* Top Bar Header */}
      <Header
        onOpenCloakModal={() => setIsCloakOpen(true)}
        onOpenAddModal={() => setIsAddOpen(true)}
        onTriggerDecoy={() => setIsDecoyActive(true)}
        onRandomGame={handleRandomGame}
        selectedCategory={selectedCategory}
        onSelectCategory={cat => {
          setSelectedCategory(cat);
          if (selectedGame) setSelectedGame(null);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedGame ? (
          <GamePlayer
            game={selectedGame}
            onBack={() => {
              setSelectedGame(null);
              // Clean URL query
              window.history.pushState({}, '', window.location.pathname);
            }}
            isFavorite={favorites.includes(selectedGame.id)}
            onToggleFavorite={handleToggleFavorite}
            onSelectGame={handleSelectGame}
            allGames={games}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-xl">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, #818cf8 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }}
              />

              <div className="relative z-1 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Instant Browser Playback · 100% Ad-Free</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100" style={{ textWrap: 'balance' }}>
                    Zero Restrictions. Lightweight Iframes. Always Unblocked.
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Play classic arcade and puzzle games directly inside sandboxed iframes. Disguise your browser tab with one click, or import custom iframe games using JSON.
                  </p>
                </div>

                {heroGame && (
                  <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-5 shrink-0 w-full lg:w-80 flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                        Spotlight Title
                      </div>
                      <h3 className="text-base font-bold text-slate-100 mt-1">{heroGame.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{heroGame.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{heroGame.plays.toLocaleString()} plays</span>
                      <button
                        onClick={() => handleSelectGame(heroGame)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors whitespace-nowrap"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Play Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Filter, Search & Segmented Category Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search games, tags, or categories..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-hidden focus:border-slate-700"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="alphabetical">Title (A-Z)</option>
                    <option value="recent">Recently Played</option>
                  </select>
                </div>
              </div>

              {/* Functional Segmented Category Controls */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800/80 rounded-xl overflow-x-auto no-scrollbar">
                {['All', 'Arcade', 'Puzzle', 'Action', 'Strategy', 'Sports', 'Favorites', 'Custom'].map(cat => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      {cat} {cat === 'Favorites' && favorites.length > 0 && `(${favorites.length})`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Games Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold text-slate-400">
                  Showing {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
                  {selectedCategory !== 'All' && <span> in {selectedCategory}</span>}
                  {searchQuery && <span> matching "{searchQuery}"</span>}
                </div>
              </div>

              {filteredGames.length === 0 ? (
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Filter className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">No games found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try clearing your search query or switching category filters. You can also add your own custom game with an iframe!
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {filteredGames.map(game => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onSelect={handleSelectGame}
                      isFavorite={favorites.includes(game.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 mt-16 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">Apex Games</span>
            <span aria-hidden="true">·</span>
            <span>{games.length} Games stored via Iframe JSON</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Panic key: <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono">{panicKey}</kbd></span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsAddOpen(true)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Export JSON
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsCloakOpen(true)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Tab Cloaker
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsDecoyActive(true)}
              className="text-slate-400 hover:text-rose-400 transition-colors"
            >
              Decoy Screen
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CloakModal
        isOpen={isCloakOpen}
        onClose={() => setIsCloakOpen(false)}
        currentProfile={cloakProfile}
        onSelectProfile={id => setCloakProfile(id)}
        panicKey={panicKey}
        onSetPanicKey={key => {
          setPanicKey(key);
          localStorage.setItem('apex_panic_key', key);
        }}
        onTriggerDecoy={() => setIsDecoyActive(true)}
      />

      <AddGameModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddGame={handleAddGame}
        allGames={games}
        onImportGames={handleImportGames}
      />
    </div>
  );
}

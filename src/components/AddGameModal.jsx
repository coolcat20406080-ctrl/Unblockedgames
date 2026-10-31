import React, { useState } from 'react';
import { X, Plus, Code, Download, Upload, Check } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
  allGames,
  onImportGames
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [embedInput, setEmbedInput] = useState('');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [author, setAuthor] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [jsonText, setJsonText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !embedInput.trim()) return;

    let iframeUrl = embedInput.trim();
    let iframeCode = embedInput.trim();

    // Check if input is full iframe HTML tag
    const srcMatch = embedInput.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      iframeUrl = srcMatch[1];
    } else {
      // It's a raw URL, construct iframe code
      iframeCode = `<iframe src="${iframeUrl}" title="${title.trim()}" allow="fullscreen; autoplay" sandbox="allow-scripts allow-same-origin allow-forms" class="w-full h-full border-0" loading="lazy"></iframe>`;
    }

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim() || 'Custom imported web game loaded via iframe.',
      iframeUrl,
      iframeCode,
      author: author.trim() || 'Custom Added',
      tags: ['Custom', category],
      rating: 5.0,
      plays: 1,
      controls: controls.trim() || 'Standard keyboard and mouse controls.',
      featured: false,
      isCustom: true
    };

    onAddGame(newGame);
    onClose();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allGames, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'games.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(allGames, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onImportGames(parsed);
        onClose();
      } else {
        alert('JSON must be an array of game objects containing iframeUrl or iframeCode.');
      }
    } catch (err) {
      alert('Invalid JSON formatting: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Add Game via Iframe</h2>
            <p className="text-xs text-slate-400">Embed any web game or import/export games.json</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 mb-5">
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-2.5 text-xs font-semibold border-b-2 px-3 transition-colors ${
              activeTab === 'create'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Add Single Game
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`pb-2.5 text-xs font-semibold border-b-2 px-3 transition-colors ${
              activeTab === 'json'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            JSON Import / Export
          </button>
        </div>

        {activeTab === 'create' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Game Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Retro Space Blaster"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden"
                >
                  <option value="Arcade">Arcade</option>
                  <option value="Puzzle">Puzzle</option>
                  <option value="Action">Action</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Sports">Sports</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Creator / Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  placeholder="Optional creator name"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Iframe Code or URL *
              </label>
              <textarea
                required
                rows={3}
                value={embedInput}
                onChange={e => setEmbedInput(e.target.value)}
                placeholder={'<iframe src="https://..." width="100%" height="100%"></iframe>\nor direct game URL: https://...'}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-hidden focus:border-indigo-500 resize-none"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Accepts full &lt;iframe&gt; embed code or direct secure URL.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief summary of gameplay..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Controls Guide</label>
              <input
                type="text"
                value={controls}
                onChange={e => setControls(e.target.value)}
                placeholder="e.g. Arrow keys to steer, Space to shoot"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-xs font-medium text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 text-xs font-semibold text-white rounded-lg hover:bg-emerald-500 transition-colors"
              >
                Add Game to Library
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg">
              <h3 className="text-xs font-semibold text-slate-200 mb-1">Export Library</h3>
              <p className="text-[11px] text-slate-400 mb-3">
                Download your entire library of {allGames.length} games formatted as an iframe JSON file.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download games.json
                </button>
                <button
                  onClick={handleCopyJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
                  {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Import games.json</label>
              <textarea
                rows={6}
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                placeholder="Paste array of JSON game objects here..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-hidden focus:border-indigo-500 resize-none"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleImportJSON}
                  disabled={!jsonText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-semibold text-white rounded-lg transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Import JSON Library
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

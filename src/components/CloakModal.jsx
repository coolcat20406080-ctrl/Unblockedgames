import React, { useState } from 'react';
import { X, Shield, Check, Eye } from 'lucide-react';
import { CLOAK_PROFILES, applyCloakProfile } from '../utils/cloak.js';

export const CloakModal = ({
  isOpen,
  onClose,
  currentProfile,
  onSelectProfile,
  panicKey,
  onSetPanicKey,
  onTriggerDecoy
}) => {
  const [customTitle, setCustomTitle] = useState('');

  if (!isOpen) return null;

  const handleCustomApply = (e) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    document.title = customTitle.trim();
    localStorage.setItem('apex_custom_cloak_title', customTitle.trim());
    onSelectProfile('custom');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Tab Cloak & Stealth Settings</h2>
            <p className="text-xs text-slate-400">Disguise browser tab title and favicon to look like school/work tools</p>
          </div>
        </div>

        {/* Cloak Presets */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-semibold text-slate-300">Preset Disguises</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CLOAK_PROFILES.map(profile => {
              const isSelected = currentProfile === profile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => {
                    applyCloakProfile(profile.id);
                    onSelectProfile(profile.id);
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 text-indigo-200'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img src={profile.faviconSvg} alt="" className="w-4 h-4 shrink-0 rounded-xs" />
                    <span className="text-xs font-medium truncate">{profile.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Cloak Form */}
        <form onSubmit={handleCustomApply} className="mb-6">
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Custom Tab Title</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              placeholder="e.g. Science Chapter 4 Notes"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 rounded-lg hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
              Apply Title
            </button>
          </div>
        </form>

        {/* Panic Key & Quick Trigger */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200">Panic Screen Hotkey</div>
              <div className="text-[11px] text-slate-400">Instantly switch to decoy coursework view</div>
            </div>
            <select
              value={panicKey}
              onChange={e => onSetPanicKey(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1 focus:outline-hidden"
            >
              <option value="Escape">Esc</option>
              <option value="]">]</option>
              <option value="\">\</option>
              <option value="`">` (Backtick)</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Test decoy screen right now:</span>
            <button
              onClick={() => {
                onClose();
                onTriggerDecoy();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-medium hover:bg-rose-600/30 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Test Panic Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

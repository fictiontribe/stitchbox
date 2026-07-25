'use client';

import React from 'react';
import { compileStitchPrompt } from '../data/seedData';

export default function DetailModal({
  selectedItem,
  setSelectedItem,
  customSubject,
  setCustomSubject,
  handleCopyPrompt,
  copiedType,
  setActiveSubTag
}) {
  if (!selectedItem) return null;

  const ds = selectedItem.recipe?.designSystem || {};
  const colors = ds.color || {};
  const typography = ds.typography || {};
  const fx = selectedItem.recipe?.visualEffects || {};

  const currentStitchPrompt = compileStitchPrompt(selectedItem, customSubject);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto relative flex flex-col md:flex-row shadow-2xl">
        
        <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition z-10 font-mono text-sm">✕</button>

        {/* Left Column: Screenshot & Color Swatches */}
        <div className="w-full md:w-5/12 p-6 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
          <div>
            <img src={selectedItem.imageUrl} alt={selectedItem.creativeName} className="w-full h-auto max-h-[55vh] object-contain rounded-xl border border-slate-800 bg-slate-950 shadow-lg" />
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedItem.baseTags.map(t => (
                <span key={t} className="text-xs bg-indigo-950/80 border border-indigo-800/50 text-indigo-300 px-2.5 py-0.5 rounded-md font-mono">{t}</span>
              ))}
            </div>

            {/* Color Swatches */}
            {colors.primary && (
              <div className="mt-6 p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-2">Design System Palette Swatches</span>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-full h-8 rounded-md border border-slate-800 shadow-inner" style={{ backgroundColor: colors.surface || '#0f172a' }}></div>
                    <span className="text-[9px] text-slate-400 font-mono mt-1">Surface</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-8 rounded-md border border-slate-800 shadow-inner" style={{ backgroundColor: colors.card || '#1e293b' }}></div>
                    <span className="text-[9px] text-slate-400 font-mono mt-1">Card</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-8 rounded-md border border-slate-800 shadow-inner" style={{ backgroundColor: colors.primary || '#ffffff' }}></div>
                    <span className="text-[9px] text-slate-400 font-mono mt-1">Primary</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-8 rounded-md border border-slate-800 shadow-inner" style={{ backgroundColor: colors.accent || '#6366f1' }}></div>
                    <span className="text-[9px] text-slate-400 font-mono mt-1">Accent</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Creative Identity, Customizer, and Live Stitch Prompt Box */}
        <div className="w-full md:w-7/12 p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">Creative Identity</span>
            <h2 className="text-xl font-bold text-white mt-1 font-display">{selectedItem.creativeName}</h2>
            <p className="text-xs text-slate-300 mt-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">{selectedItem.summary}</p>

            {/* Measurable Specs */}
            {typography.headingFont && (
              <div className="mt-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs font-mono space-y-1 text-slate-300">
                <div><span className="text-indigo-400">Heading Font:</span> {typography.headingFont}</div>
                <div><span className="text-indigo-400">Body Font:</span> {typography.bodyFont}</div>
                <div><span className="text-indigo-400">Effects & Texture:</span> {fx.textureField?.type || 'Standard'} {fx.glassmorphism?.enabled ? '(Glassmorphic)' : ''}</div>
              </div>
            )}

            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mt-4">Aesthetic DNA Tokens</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedItem.tokens.map(token => (
                <button 
                  key={token} 
                  onClick={() => { setActiveSubTag(token); setSelectedItem(null); }} 
                  className="text-[11px] bg-slate-800 text-slate-300 hover:text-indigo-300 hover:bg-slate-700 px-2.5 py-0.5 rounded-lg font-mono transition"
                >
                  #{token}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mt-4 mb-2">Subject Customizer</p>
            <input 
              type="text" 
              value={customSubject} 
              onChange={(e) => setCustomSubject(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:border-indigo-500 outline-none" 
            />

            {/* LIVE STITCH PROMPT DISPLAY BOX */}
            <div className="mt-5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">Compiled Stitch Prompt</span>
                <span className="text-[10px] font-mono text-slate-500">Live DESIGN.md format</span>
              </div>
              <textarea
                readOnly
                rows={9}
                value={currentStitchPrompt}
                className="w-full bg-slate-950 border-2 border-indigo-500/80 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none resize-none shadow-inner select-all"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-end">
            <button 
              onClick={() => handleCopyPrompt(selectedItem)} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2"
            >
              <span>{copiedType === 'prompt' ? '✓ Stitch Prompt Copied to Clipboard!' : 'Copy Stitch Prompt'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto relative flex flex-col md:flex-row shadow-2xl">
        
        <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition z-10 font-mono text-sm font-bold border border-slate-300">✕</button>

        {/* Left Column: Screenshot & Color Swatches */}
        <div className="w-full md:w-5/12 p-6 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between bg-slate-50/50">
          <div>
            <img src={selectedItem.imageUrl} alt={selectedItem.creativeName} className="w-full h-auto max-h-[55vh] object-contain rounded-xl border border-slate-200 bg-white shadow-md" />
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedItem.baseTags.map(t => (
                <span key={t} className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-800 px-2.5 py-0.5 rounded-md font-mono font-semibold">{t}</span>
              ))}
            </div>

            {/* Color Swatches */}
            {colors.lightBase ? (
              <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider block mb-2 font-bold">6-Color Synthesized Palette</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-full h-7 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.lightBase }}></div>
                    <span className="text-[8px] text-slate-600 font-mono mt-1 font-semibold">Light</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-7 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.darkBase }}></div>
                    <span className="text-[8px] text-slate-600 font-mono mt-1 font-semibold">Dark</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-7 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.accentA }}></div>
                    <span className="text-[8px] text-slate-600 font-mono mt-1 font-semibold">Card A</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-7 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.accentB }}></div>
                    <span className="text-[8px] text-slate-600 font-mono mt-1 font-semibold">Card B</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-7 rounded-md border border-slate-300 shadow-sm ring-2 ring-indigo-400" style={{ backgroundColor: colors.synthesizedAccent }}></div>
                    <span className="text-[8px] text-indigo-700 font-mono mt-1 font-bold">Harmonic</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-7 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.neutralText }}></div>
                    <span className="text-[8px] text-slate-600 font-mono mt-1 font-semibold">Text</span>
                  </div>
                </div>
              </div>
            ) : colors.primary ? (
              <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider block mb-2 font-bold">Palette Swatches</span>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-full h-7 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.surface || '#f8fafc' }}></div>
                    <span className="text-[8px] text-slate-600 font-mono mt-1 font-semibold">Surface</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-7 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.card || '#0f172a' }}></div>
                    <span className="text-[8px] text-slate-600 font-mono mt-1 font-semibold">Card</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-7 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.primary || '#ffffff' }}></div>
                    <span className="text-[8px] text-slate-600 font-mono mt-1 font-semibold">Primary</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-7 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.accent || '#6366f1' }}></div>
                    <span className="text-[8px] text-slate-600 font-mono mt-1 font-semibold">Accent</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Creative Identity, Customizer, and Live Stitch Prompt Box */}
        <div className="w-full md:w-7/12 p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-mono tracking-widest uppercase font-semibold">Creative Identity</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1 font-display">{selectedItem.creativeName}</h2>
            <p className="text-xs text-slate-700 mt-3 bg-slate-100 p-3.5 rounded-xl border border-slate-200 leading-relaxed font-medium">{selectedItem.summary}</p>

            {/* Measurable Specs */}
            {typography.headingFont && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1 text-slate-700">
                <div><span className="text-indigo-700 font-bold">Heading Font:</span> {typography.headingFont}</div>
                <div><span className="text-indigo-700 font-bold">Body Font:</span> {typography.bodyFont}</div>
                <div><span className="text-indigo-700 font-bold">Effects & Texture:</span> {fx.textureField?.type || 'Standard'} {fx.glassmorphism?.enabled ? '(Glassmorphic)' : ''}</div>
              </div>
            )}

            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mt-4 font-semibold">Aesthetic DNA Tokens</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedItem.tokens.map(token => (
                <button 
                  key={token} 
                  onClick={() => { setActiveSubTag(token); setSelectedItem(null); }} 
                  className="text-[11px] bg-slate-100 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 border border-slate-200 px-2.5 py-0.5 rounded-lg font-mono transition font-medium"
                >
                  #{token}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mt-4 mb-2 font-semibold">Subject Customizer</p>
            <input 
              type="text" 
              value={customSubject} 
              onChange={(e) => setCustomSubject(e.target.value)} 
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 outline-none shadow-sm" 
            />

            {/* LIVE STITCH PROMPT DISPLAY BOX */}
            <div className="mt-5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider">Compiled Stitch Prompt</span>
                <span className="text-[10px] font-mono text-slate-500 font-semibold">Live DESIGN.md format</span>
              </div>
              <textarea
                readOnly
                rows={9}
                value={currentStitchPrompt}
                className="w-full bg-slate-50 border-2 border-indigo-600/80 rounded-xl p-4 text-xs font-mono text-slate-900 leading-relaxed focus:outline-none resize-none shadow-inner select-all"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
            <button 
              onClick={() => handleCopyPrompt(selectedItem)} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              <span>{copiedType === 'prompt' ? '✓ Stitch Prompt Copied to Clipboard!' : 'Copy Stitch Prompt'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

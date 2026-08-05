'use client';

import React, { useState } from 'react';
import { compileStitchPrompt, getDnaSourceUrl } from '../data/seedData';
import { compileCreativeOverdrivePrompt, compileNanoBananaImagePrompt } from '../lib/artDirectionOverdrive';

export default function DetailModal({
  selectedItem,
  setSelectedItem,
  customSubject,
  setCustomSubject,
  handleCopyPrompt,
  copiedType,
  setActiveSubTag,
  initialPromptMode = 'standard'
}) {
  const [promptMode, setPromptMode] = useState(initialPromptMode); // 'standard' | 'overdrive' | 'image'

  if (!selectedItem) return null;

  const ds = selectedItem.recipe?.designSystem || {};
  const colors = ds.color || {};
  const typography = ds.typography || {};
  const fx = selectedItem.recipe?.visualEffects || {};
  const category = selectedItem.category || 'Website';
  const sourceUrl = getDnaSourceUrl(selectedItem);

  const currentStitchPrompt = compileStitchPrompt(selectedItem, customSubject);
  const overdrivePrompt = compileCreativeOverdrivePrompt(selectedItem, customSubject);
  const nanoBananaPrompt = compileNanoBananaImagePrompt(selectedItem, customSubject);

  let activePromptText = currentStitchPrompt;
  if (promptMode === 'overdrive') activePromptText = overdrivePrompt;
  if (promptMode === 'image') activePromptText = nanoBananaPrompt;

  // Extract up to 6 swatches
  const getItemSwatches = () => {
    if (Array.isArray(colors.swatches) && colors.swatches.length >= 6) {
      return colors.swatches.slice(0, 6);
    }
    return [
      colors.lightBase || colors.surface || '#f8fafc',
      colors.darkBase || colors.card || '#0f172a',
      colors.primary || colors.accentA || '#4f46e5',
      colors.secondary || colors.accentB || '#64748b',
      colors.accent || colors.synthesizedAccent || '#10b981',
      colors.neutralText || '#1e293b'
    ];
  };

  const swatches = getItemSwatches();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto relative flex flex-col md:flex-row shadow-2xl">
        
        <button 
          onClick={() => setSelectedItem(null)} 
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition z-20 font-mono text-sm font-bold border border-slate-300 shadow-md"
          title="Close modal"
        >
          ✕
        </button>

        {/* Left Column: Screenshot, Category & 6 Color Swatches */}
        <div className="w-full md:w-5/12 p-6 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between bg-slate-50/50">
          <div>
            <div className="relative">
              <span className="absolute top-2.5 left-2.5 bg-slate-900/85 text-white font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-md tracking-wider backdrop-blur-sm border border-white/20 shadow-sm z-10">
                {category}
              </span>
              <img src={selectedItem.imageUrl} alt={selectedItem.creativeName} className="w-full h-auto max-h-[52vh] object-contain rounded-xl border border-slate-200 bg-white shadow-md" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedItem.baseTags.map(t => (
                <span key={t} className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-800 px-2.5 py-0.5 rounded-md font-mono font-semibold">{t}</span>
              ))}
            </div>

            {/* 6 Color Swatches */}
            <div className="mt-5 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider block mb-2.5 font-bold">Analyzed 6-Color Swatches</span>
              <div className="grid grid-cols-6 gap-2">
                {swatches.map((hex, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-full h-8 rounded-lg border border-slate-300 shadow-xs" style={{ backgroundColor: hex }}></div>
                    <span className="text-[8px] text-slate-500 font-mono mt-1 font-semibold truncate w-full text-center">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Source URL link (if website reference) */}
            {sourceUrl && (
              <div className="mt-4">
                <a 
                  href={sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-mono font-semibold transition hover:underline truncate max-w-full"
                >
                  <span className="truncate">Source: {sourceUrl}</span>
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Creative Identity, Customizer, and Live Stitch Prompt Box */}
        <div className="w-full md:w-7/12 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 pr-10">
              <span className="text-xs text-slate-500 font-mono tracking-widest uppercase font-semibold">Creative Identity</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5 font-display">{selectedItem.creativeName}</h2>

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
              placeholder="e.g. Modern AI Application, Luxury Perfume Bottle, Electric Hypercar..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 outline-none shadow-sm" 
            />

            {/* PROMPT MODE TOGGLE / TABS */}
            <div className="mt-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
                  <button 
                    onClick={() => setPromptMode('standard')} 
                    className={`text-[11px] font-mono font-bold px-2.5 py-1.5 rounded-lg transition ${
                      promptMode === 'standard' 
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Stitch Web Prompt
                  </button>
                  <button 
                    onClick={() => setPromptMode('overdrive')} 
                    className={`text-[11px] font-mono font-bold px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 ${
                      promptMode === 'overdrive' 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-indigo-700 hover:bg-indigo-50'
                    }`}
                  >
                    <span>⚡ Creative Overdrive</span>
                  </button>
                  <button 
                    onClick={() => setPromptMode('image')} 
                    className={`text-[11px] font-mono font-bold px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 ${
                      promptMode === 'image' 
                        ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold' 
                        : 'text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    <span>🍌 Image Prompt</span>
                  </button>
                </div>

                <span className="text-[10px] font-mono text-slate-500 font-semibold">
                  {promptMode === 'standard' && 'Stitch DESIGN.md Code'}
                  {promptMode === 'overdrive' && 'UX/UI Art Direction'}
                  {promptMode === 'image' && 'Nano Banana Image Gen'}
                </span>
              </div>

              <textarea
                readOnly
                rows={9}
                value={activePromptText}
                className={`w-full border-2 rounded-xl p-4 text-xs font-mono leading-relaxed focus:outline-none resize-none shadow-inner select-all transition ${
                  promptMode === 'overdrive' 
                    ? 'bg-slate-900 text-indigo-300 border-indigo-600' 
                    : promptMode === 'image'
                    ? 'bg-slate-950 text-amber-300 border-amber-500'
                    : 'bg-slate-50 text-slate-900 border-indigo-600/80'
                }`}
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2 justify-end">
            <button 
              onClick={() => handleCopyPrompt(selectedItem, activePromptText)} 
              className={`w-full py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs font-mono font-bold ${
                promptMode === 'overdrive' 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                  : promptMode === 'image'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold border border-amber-600'
                  : 'bg-slate-900 hover:bg-black text-white'
              }`}
            >
              <span>
                {copiedType === 'prompt' 
                  ? '✓ Prompt Copied to Clipboard!' 
                  : `Copy ${
                      promptMode === 'overdrive' 
                        ? 'Creative Overdrive' 
                        : promptMode === 'image' 
                        ? 'Nano Banana Image' 
                        : 'Stitch'
                    } Prompt`}
              </span>
            </button>
          </div>
        </div>

        </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { compileStitchPrompt } from '../data/seedData';

export default function BlenderConsole({
  blendSlotA,
  blendSlotB,
  blendedResult,
  library,
  executeBlend,
  clearBlend,
  customSubject,
  setCustomSubject
}) {
  const [copied, setCopied] = useState(false);

  const itemA = library.find(i => i.id === blendSlotA);
  const itemB = library.find(i => i.id === blendSlotB);

  const colors = blendedResult?.recipe?.designSystem?.color || {};
  const typography = blendedResult?.recipe?.designSystem?.typography || {};

  const blendedPromptText = blendedResult ? compileStitchPrompt(blendedResult, customSubject) : '';

  const handleCopyBlendedPrompt = () => {
    if (!blendedResult) return;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(blendedPromptText);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer className="bg-white/95 border-t border-slate-200 p-6 glass-panel sticky bottom-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">The Prompt Blender</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 border border-slate-300 px-3 py-2 rounded-lg flex items-center gap-2 min-w-36 shadow-inner">
              <span className="text-xs text-indigo-700 font-mono font-bold">A:</span>
              <span className="text-xs font-bold text-slate-900">{itemA ? itemA.creativeName : '[Empty]'}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono font-bold">+</span>
            <div className="bg-slate-100 border border-slate-300 px-3 py-2 rounded-lg flex items-center gap-2 min-w-36 shadow-inner">
              <span className="text-xs text-indigo-700 font-mono font-bold">B:</span>
              <span className="text-xs font-bold text-slate-900">{itemB ? itemB.creativeName : '[Empty]'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={executeBlend} 
            disabled={!blendSlotA || !blendSlotB} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-xs font-mono font-bold rounded-lg transition disabled:opacity-40 shadow-md"
          >
            Generate Blend
          </button>

          {blendedResult && (
            <button 
              onClick={handleCopyBlendedPrompt}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-mono font-bold rounded-lg transition shadow-md flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? 'Copied Stitch Prompt!' : 'Copy Stitch Prompt'}
            </button>
          )}

          {(blendSlotA || blendSlotB || blendedResult) && (
            <button onClick={clearBlend} className="text-xs text-slate-500 hover:text-slate-900 font-mono px-2 py-1 font-semibold">Clear</button>
          )}
        </div>
      </div>

      {blendedResult && (
        <div className="max-w-7xl mx-auto mt-6 p-6 bg-slate-50 border border-slate-200 rounded-xl shadow-lg flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 gap-3">
            <h4 className="text-xs font-mono uppercase text-indigo-900 font-bold tracking-wide">Blended Hybrid DNA: {blendedResult.creativeName}</h4>
            
            {/* 6-Color Synthesized Palette Display */}
            {colors.lightBase && (
              <div className="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider">6-Color Synthesized Palette:</span>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.lightBase }} title={`Light Base: ${colors.lightBase}`}></div>
                    <span className="text-[8px] font-mono text-slate-500 mt-0.5">Light</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.darkBase }} title={`Dark Base: ${colors.darkBase}`}></div>
                    <span className="text-[8px] font-mono text-slate-500 mt-0.5">Dark</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.accentA }} title={`Accent A: ${colors.accentA}`}></div>
                    <span className="text-[8px] font-mono text-slate-500 mt-0.5">Card A</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.accentB }} title={`Accent B: ${colors.accentB}`}></div>
                    <span className="text-[8px] font-mono text-slate-500 mt-0.5">Card B</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-md border border-slate-300 shadow-sm ring-2 ring-indigo-400" style={{ backgroundColor: colors.synthesizedAccent }} title={`Synthesized Harmonious Accent: ${colors.synthesizedAccent}`}></div>
                    <span className="text-[8px] font-mono text-indigo-700 font-bold mt-0.5">Harmonic</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: colors.neutralText }} title={`Neutral Text: ${colors.neutralText}`}></div>
                    <span className="text-[8px] font-mono text-slate-500 mt-0.5">Text</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-xs text-slate-600 font-mono font-bold uppercase tracking-wider">Blended Rules</p>
              <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-800 font-medium">{blendedResult.recipe.alwaysRules.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
            <div>
              <p className="text-xs text-slate-600 font-mono font-bold uppercase tracking-wider">Blended Bans & System Specs</p>
              <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-800 font-medium">
                {blendedResult.recipe.neverRules.map((r, i) => <li key={i}>{r}</li>)}
                {typography.headingFont && <li className="text-indigo-800 font-mono font-bold mt-2">Hybrid Fonts: {typography.headingFont} + {typography.bodyFont}</li>}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[11px] font-mono uppercase text-slate-600 font-bold mb-1">Target Application Subject</label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="e.g. an AI analytics platform for small startups"
                  className="w-full bg-white border border-slate-300 text-xs text-slate-900 font-mono px-3.5 py-2 rounded-lg focus:border-indigo-600 outline-none shadow-sm"
                />
              </div>
              <button
                onClick={handleCopyBlendedPrompt}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold px-4 py-2 rounded-lg transition shadow-sm flex items-center gap-2 self-end"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? 'Copied Stitch Prompt!' : 'Copy Stitch Prompt'}
              </button>
            </div>

            <div className="relative">
              <textarea
                readOnly
                value={blendedPromptText}
                className="w-full h-40 bg-white text-slate-900 font-mono text-[11px] p-4 rounded-xl border border-slate-300 focus:outline-none resize-none leading-relaxed shadow-inner"
              />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

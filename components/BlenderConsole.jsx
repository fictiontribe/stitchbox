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
    <footer className="bg-slate-950/95 border-t border-slate-800/80 p-6 glass-panel sticky bottom-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">The Prompt Blender</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg flex items-center gap-2 min-w-36 shadow-inner">
              <span className="text-xs text-indigo-400 font-mono">A:</span>
              <span className="text-xs font-semibold text-slate-200">{itemA ? itemA.creativeName : '[Empty]'}</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">+</span>
            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg flex items-center gap-2 min-w-36 shadow-inner">
              <span className="text-xs text-indigo-400 font-mono">B:</span>
              <span className="text-xs font-semibold text-slate-200">{itemB ? itemB.creativeName : '[Empty]'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={executeBlend} 
            disabled={!blendSlotA || !blendSlotB} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 text-xs font-mono font-semibold rounded-lg transition disabled:opacity-40 shadow-lg shadow-indigo-950"
          >
            Generate Blend
          </button>

          {blendedResult && (
            <button 
              onClick={handleCopyBlendedPrompt}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 text-xs font-mono font-semibold rounded-lg transition shadow-lg shadow-emerald-950 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? 'Copied Stitch Prompt!' : 'Copy Stitch Prompt'}
            </button>
          )}

          {(blendSlotA || blendSlotB || blendedResult) && (
            <button onClick={clearBlend} className="text-xs text-slate-400 hover:text-slate-200 font-mono px-2 py-1">Clear</button>
          )}
        </div>
      </div>

      {blendedResult && (
        <div className="max-w-7xl mx-auto mt-6 p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
            <h4 className="text-xs font-mono uppercase text-indigo-300 font-semibold tracking-wide">Blended Hybrid DNA: {blendedResult.creativeName}</h4>
            {colors.primary && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">Synthesized Palette:</span>
                <div className="w-5 h-5 rounded-md border border-slate-700 shadow" style={{ backgroundColor: colors.surface }} title={`Surface: ${colors.surface}`}></div>
                <div className="w-5 h-5 rounded-md border border-slate-700 shadow" style={{ backgroundColor: colors.card }} title={`Card: ${colors.card}`}></div>
                <div className="w-5 h-5 rounded-md border border-slate-700 shadow" style={{ backgroundColor: colors.primary }} title={`Primary: ${colors.primary}`}></div>
                <div className="w-5 h-5 rounded-md border border-slate-700 shadow" style={{ backgroundColor: colors.accent }} title={`Accent: ${colors.accent}`}></div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-xs text-slate-400 font-mono font-semibold">Blended Rules</p>
              <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-300">{blendedResult.recipe.alwaysRules.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-mono font-semibold">Blended Bans & System Specs</p>
              <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-300">
                {blendedResult.recipe.neverRules.map((r, i) => <li key={i}>{r}</li>)}
                {typography.headingFont && <li className="text-indigo-300 font-mono mt-2">Hybrid Fonts: {typography.headingFont} + {typography.bodyFont}</li>}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Target Application Subject</label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="e.g. an AI analytics platform for small startups"
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono px-3.5 py-2 rounded-lg focus:border-indigo-500 outline-none"
                />
              </div>
              <button
                onClick={handleCopyBlendedPrompt}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold px-4 py-2 rounded-lg transition shadow-md flex items-center gap-2 self-end"
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
                className="w-full h-40 bg-slate-950 text-indigo-200 font-mono text-[11px] p-4 rounded-xl border border-slate-800 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

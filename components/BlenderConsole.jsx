'use client';

import React from 'react';

export default function BlenderConsole({
  blendSlotA,
  blendSlotB,
  blendedResult,
  library,
  executeBlend,
  clearBlend
}) {
  const itemA = library.find(i => i.id === blendSlotA);
  const itemB = library.find(i => i.id === blendSlotB);

  return (
    <footer className="bg-slate-950/90 border-t border-slate-800/80 p-6 glass-panel sticky bottom-0 z-30">
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
          <button onClick={executeBlend} disabled={!blendSlotA || !blendSlotB} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 text-xs font-mono font-semibold rounded-lg transition disabled:opacity-40 shadow-lg shadow-indigo-950">Generate Blend</button>
          {(blendSlotA || blendSlotB || blendedResult) && (
            <button onClick={clearBlend} className="text-xs text-slate-400 hover:text-slate-200 font-mono">Clear</button>
          )}
        </div>
      </div>

      {blendedResult && (
        <div className="max-w-7xl mx-auto mt-6 p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
          <h4 className="text-xs font-mono uppercase text-indigo-300">Blended Result: {blendedResult.creativeName}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
            <div>
              <p className="text-xs text-slate-400 font-mono">Blended Rules</p>
              <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-300">{blendedResult.recipe.alwaysRules.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-mono">Blended Bans</p>
              <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-300">{blendedResult.recipe.neverRules.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

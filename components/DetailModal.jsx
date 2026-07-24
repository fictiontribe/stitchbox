'use client';

import React from 'react';

export default function DetailModal({
  selectedItem,
  setSelectedItem,
  customSubject,
  setCustomSubject,
  handleCopyBrief,
  handleCopyPrompt,
  copiedType,
  setActiveSubTag
}) {
  if (!selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row shadow-2xl">
        
        <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition z-10 font-mono text-sm">✕</button>

        <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-slate-800">
          <img src={selectedItem.imageUrl} alt={selectedItem.creativeName} className="w-full h-auto rounded-xl border border-slate-800 bg-slate-950 object-cover shadow-lg" />
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedItem.baseTags.map(t => (
              <span key={t} className="text-xs bg-indigo-950/80 border border-indigo-800/50 text-indigo-300 px-2.5 py-0.5 rounded-md font-mono">{t}</span>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">Creative Identity</span>
            <h2 className="text-xl font-bold text-white mt-1 font-display">{selectedItem.creativeName}</h2>
            <p className="text-xs text-slate-300 mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80 leading-relaxed">{selectedItem.summary}</p>

            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mt-6">Aesthetic DNA Tokens</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedItem.tokens.map(token => (
                <button 
                  key={token} 
                  onClick={() => { setActiveSubTag(token); setSelectedItem(null); }} 
                  className="text-xs bg-slate-800 text-slate-300 hover:text-indigo-300 hover:bg-slate-700 px-2.5 py-1 rounded-lg font-mono transition"
                >
                  #{token}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mt-6 mb-2">Subject Customizer</p>
            <input 
              type="text" 
              value={customSubject} 
              onChange={(e) => setCustomSubject(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-indigo-500 outline-none" 
            />
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 flex gap-3">
            <button onClick={() => handleCopyBrief(selectedItem)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono py-2.5 rounded-xl transition">
              {copiedType === 'brief' ? 'Brief Copied!' : 'Copy Brief'}
            </button>
            <button onClick={() => handleCopyPrompt(selectedItem)} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-semibold py-2.5 rounded-xl transition shadow-lg shadow-indigo-950">
              {copiedType === 'prompt' ? 'Stitch Prompt Copied!' : 'Copy Stitch Prompt'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

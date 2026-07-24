'use client';

import React, { useState } from 'react';

export default function Header({
  apiKey,
  saveApiKey,
  clearApiKey,
  isKeySaved,
  handleFileUpload,
  handleUrlIngest,
  urlInput,
  setUrlInput,
  isProcessing
}) {
  const [inputVal, setInputVal] = useState(apiKey || '');

  const handleKeySubmit = (e) => {
    e.preventDefault();
    saveApiKey(inputVal);
  };

  const handleClear = () => {
    setInputVal('');
    clearApiKey();
  };

  return (
    <header className="border-b border-slate-800/80 px-8 py-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 glass-panel sticky top-0 z-30">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
          STITCHBOX <span className="text-xs bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 px-2 py-0.5 font-mono uppercase tracking-widest rounded-md">Next.js Beta</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Extract, organize, and translate website design DNA for Google Stitch.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
        <form onSubmit={handleKeySubmit} className="flex bg-slate-900 border border-slate-800 rounded-lg focus-within:border-indigo-500 transition overflow-hidden items-center shadow-inner">
          <span className="bg-slate-800/80 text-[10px] text-slate-400 font-mono px-3 py-2.5 flex items-center border-r border-slate-800 uppercase tracking-wider">API KEY</span>
          <input 
            type="password" 
            placeholder="AI Studio / Vertex Key..." 
            value={inputVal} 
            onChange={(e) => setInputVal(e.target.value)} 
            className="bg-transparent text-xs text-slate-100 px-3 py-2 outline-none w-44 placeholder-slate-500 font-mono"
          />
          {inputVal ? (
            <div className="flex items-center">
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-mono font-semibold px-3 py-2 transition border-l border-slate-800"
              >
                {isKeySaved ? 'Saved ✓' : 'Save Key'}
              </button>
              <button 
                type="button" 
                onClick={handleClear} 
                className="bg-slate-800 text-[10px] text-rose-400 font-mono px-2.5 py-2 hover:bg-slate-700 border-l border-slate-800 transition"
              >
                Clear
              </button>
            </div>
          ) : (
            <span className="text-[10px] text-slate-500 font-mono px-3">Cloud Managed</span>
          )}
        </form>

        <div className="relative group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg cursor-pointer transition font-mono text-xs font-semibold shadow-lg shadow-emerald-950/30">
          <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} disabled={isProcessing} />
          <span>Upload Screenshot</span>
        </div>

        <form onSubmit={handleUrlIngest} className="flex bg-slate-900 border border-slate-800 rounded-lg focus-within:border-indigo-500 transition overflow-hidden shadow-inner">
          <input type="url" placeholder="Paste URL..." value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="bg-transparent text-xs text-slate-100 px-3 py-2 outline-none w-36 placeholder-slate-500 font-mono" disabled={isProcessing} />
          <button type="submit" className="bg-slate-800 hover:bg-slate-700 px-3 text-xs font-mono transition border-l border-slate-800 text-slate-300">Analyze</button>
        </form>
      </div>
    </header>
  );
}

'use client';

import React from 'react';

export default function Header({
  handleFileUpload,
  handleUrlIngest,
  urlInput,
  setUrlInput,
  isProcessing
}) {
  return (
    <header className="border-b border-slate-800/80 px-8 py-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 glass-panel sticky top-0 z-30">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
          STITCHBOX <span className="text-xs bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 px-2 py-0.5 font-mono uppercase tracking-widest rounded-md">Design DNA</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Extract, organize, and translate website design DNA for Google Stitch.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
        <div className="relative group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg cursor-pointer transition font-mono text-xs font-semibold shadow-lg shadow-indigo-950/30">
          <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} disabled={isProcessing} />
          <span>Upload Screenshot</span>
        </div>

        <form onSubmit={handleUrlIngest} className="flex bg-slate-900 border border-slate-800 rounded-lg focus-within:border-indigo-500 transition overflow-hidden shadow-inner">
          <input type="url" placeholder="Paste URL to capture..." value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="bg-transparent text-xs text-slate-100 px-3 py-2 outline-none w-44 placeholder-slate-500 font-mono" disabled={isProcessing} />
          <button type="submit" className="bg-slate-800 hover:bg-slate-700 px-3 text-xs font-mono transition border-l border-slate-800 text-slate-300" disabled={isProcessing}>
            {isProcessing ? 'Analyzing...' : 'Analyze URL'}
          </button>
        </form>
      </div>
    </header>
  );
}

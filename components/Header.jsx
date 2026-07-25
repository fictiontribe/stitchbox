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
    <header className="border-b border-slate-200/90 px-4 sm:px-8 py-4 sm:py-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 glass-panel sticky top-0 z-30 shadow-sm bg-white/90">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5 font-display">
          <img src="/stitchbox-logo.png" alt="Stitchbox Logo" className="h-7 w-auto object-contain" />
          <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 font-mono uppercase tracking-widest rounded-md font-semibold">Design DNA</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1 font-medium">Extract, organize, and translate website design DNA for Google Stitch.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="relative group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg cursor-pointer transition font-mono text-xs font-semibold shadow-sm">
          <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} disabled={isProcessing} />
          <span>Upload Screenshot</span>
        </div>

        <form onSubmit={handleUrlIngest} className="flex bg-slate-100 border border-slate-300 rounded-lg focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 transition overflow-hidden shadow-inner">
          <input type="text" placeholder="Paste URL (e.g. gitlab.com)..." value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="bg-transparent text-xs text-slate-900 px-3 py-2 outline-none w-48 placeholder-slate-400 font-mono" disabled={isProcessing} />
          <button type="submit" className="bg-slate-200 hover:bg-slate-300 px-3 text-xs font-mono transition border-l border-slate-300 text-slate-800 font-semibold" disabled={isProcessing}>
            {isProcessing ? 'Analyzing...' : 'Analyze URL'}
          </button>
        </form>
      </div>
    </header>
  );
}

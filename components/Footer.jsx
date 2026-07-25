import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-6 px-6 sm:px-12 mt-16 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono tracking-widest text-slate-400">
        <div className="flex items-center gap-2">
          <span>A PRODUCT OF</span>
          <span className="font-extrabold text-slate-100 text-sm tracking-wider uppercase flex items-center gap-1">
            FICTION<span className="text-indigo-400 font-black">_</span>TRIBE
          </span>
        </div>
        <div className="flex items-center gap-2 text-indigo-300/80">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>RUNNING ON GEMINI 2.5</span>
        </div>
      </div>
    </footer>
  );
}

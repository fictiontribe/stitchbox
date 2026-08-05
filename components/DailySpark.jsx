'use client';

import React from 'react';

export default function DailySpark({ dailySpark, generateNewSpark, isSparkLoading }) {
  if (!dailySpark) return null;

  return (
    <section className="bg-gradient-to-r from-slate-100 via-indigo-50/90 to-slate-100 border-b border-slate-200/90 px-4 sm:px-8 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
      <div>
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-2">
          <span>INSPIRATION CHALLENGE</span>
          {isSparkLoading && <span className="text-[10px] text-indigo-600 animate-pulse font-bold">✨ Generating concept...</span>}
        </h4>
        <p className="text-xs text-slate-800 font-medium mt-0.5">
          Generate <span className="text-indigo-700 font-bold">"{dailySpark.subject}"</span> using <span className="text-indigo-700 font-bold">{dailySpark.style}</span>.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button 
          onClick={generateNewSpark} 
          disabled={isSparkLoading}
          className="text-xs font-mono text-slate-700 hover:text-slate-900 transition border border-slate-300 hover:border-slate-400 px-3 py-1.5 rounded-md bg-white font-semibold shadow-sm disabled:opacity-50 flex items-center gap-1.5"
        >
          {isSparkLoading ? (
            <>
              <div className="w-3 h-3 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
              <span>Rolling...</span>
            </>
          ) : (
            <span>Re-Roll Idea 🎲</span>
          )}
        </button>
      </div>
    </section>
  );
}


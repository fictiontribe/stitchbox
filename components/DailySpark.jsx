'use client';

import React from 'react';

export default function DailySpark({ dailySpark, generateNewSpark }) {
  if (!dailySpark) return null;

  return (
    <section className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800/80 px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-start gap-3">
        <div className="bg-indigo-500 text-white p-1.5 rounded-md text-xs font-bold font-mono mt-0.5 shadow-md shadow-indigo-950">SPARK</div>
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Proactive Inspiration Challenge</h4>
          <p className="text-xs text-slate-200 mt-0.5">
            Generate <span className="text-indigo-300 font-semibold">"{dailySpark.subject}"</span> using <span className="text-indigo-300 font-semibold">{dailySpark.style}</span>.
          </p>
        </div>
      </div>
      <button onClick={generateNewSpark} className="text-xs font-mono text-slate-400 hover:text-slate-100 transition border border-slate-800 hover:border-slate-600 px-3 py-1.5 rounded-md bg-slate-900/60">Re-Roll Idea</button>
    </section>
  );
}

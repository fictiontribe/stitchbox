'use client';

import React from 'react';

export default function DailySpark({ dailySpark, generateNewSpark, onApplySpark }) {
  if (!dailySpark) return null;

  return (
    <section className="bg-gradient-to-r from-slate-100 via-indigo-50/80 to-slate-100 border-b border-slate-200/90 px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="bg-indigo-600 text-white p-1.5 rounded-md text-xs font-bold font-mono mt-0.5 shadow-sm">SPARK</div>
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">INSPIRATION CHALLENGE</h4>
          <p className="text-xs text-slate-800 font-medium mt-0.5">
            Generate <button onClick={onApplySpark} title="Click to apply subject and style to prompt generator" className="text-indigo-700 font-bold underline decoration-indigo-400 hover:text-indigo-900 transition">"{dailySpark.subject}"</button> using <span className="text-indigo-700 font-bold">{dailySpark.style}</span>.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onApplySpark} className="text-xs font-mono text-indigo-700 hover:text-white transition border border-indigo-200 hover:border-indigo-600 hover:bg-indigo-600 px-3 py-1.5 rounded-md bg-white font-semibold shadow-sm">Use as Subject</button>
        <button onClick={generateNewSpark} className="text-xs font-mono text-slate-700 hover:text-slate-900 transition border border-slate-300 hover:border-slate-400 px-3 py-1.5 rounded-md bg-white font-semibold shadow-sm">Re-Roll Idea 🎲</button>
      </div>
    </section>
  );
}

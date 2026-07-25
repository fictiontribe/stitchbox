'use client';

import React, { useState } from 'react';
import { VOCAB_DICTIONARY } from '../data/seedData';

export default function TagFilterBar({
  allBaseTags,
  activeBaseTag,
  activeSubTag,
  currentSubTags = [],
  handleBaseTagClick,
  setActiveSubTag,
  clearFilters
}) {
  return (
    <section className="border-b border-slate-200/90 px-8 py-5 glass-panel bg-white/80">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider mr-2 font-semibold">Filter Base Tags:</span>
        {allBaseTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleBaseTagClick(tag)}
            className={`text-xs px-3.5 py-1.5 font-mono border transition rounded-full ${
              activeBaseTag === tag 
                ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-sm' 
                : 'bg-white border-slate-200 hover:border-slate-400 text-slate-700 font-medium'
            }`}
          >
            {tag}
          </button>
        ))}

        {(activeBaseTag || activeSubTag) && (
          <button onClick={clearFilters} className="text-xs text-rose-600 hover:underline ml-4 font-mono font-bold">Clear Filter</button>
        )}
      </div>

      {activeBaseTag && currentSubTags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider mr-2 font-semibold">Dynamic Asset Vocabulary:</span>
          {currentSubTags.map((subTag) => (
            <div key={subTag} className="group relative cursor-pointer" onClick={() => setActiveSubTag(activeSubTag === subTag ? null : subTag)}>
              <span className={`text-xs px-3 py-1 font-mono rounded-md border block transition ${
                activeSubTag === subTag ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}>
                {subTag}
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 hidden group-hover:block bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-2xl z-20 text-xs text-white">
                <p className="font-semibold text-indigo-300 mb-1 font-mono">{subTag}</p>
                <p className="text-slate-200 font-sans leading-relaxed">{VOCAB_DICTIONARY[subTag] || 'Extracted design keyword'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

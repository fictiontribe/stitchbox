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
  clearFilters,
  onAddCustomTag
}) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const handleSubmitNewTag = (e) => {
    e.preventDefault();
    if (newTagName.trim()) {
      onAddCustomTag(newTagName.trim());
      setNewTagName('');
      setIsAddingTag(false);
    }
  };

  return (
    <section className="border-b border-slate-800/80 px-8 py-5 glass-panel">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mr-2">Filter Base Tags:</span>
        {allBaseTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleBaseTagClick(tag)}
            className={`text-xs px-3.5 py-1.5 font-mono border transition rounded-full ${
              activeBaseTag === tag 
                ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-md shadow-indigo-950/50' 
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-600 text-slate-300'
            }`}
          >
            {tag}
          </button>
        ))}

        {isAddingTag ? (
          <form onSubmit={handleSubmitNewTag} className="inline-flex items-center gap-1">
            <input
              type="text"
              placeholder="Tag name..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="bg-slate-900 border border-indigo-500 text-xs text-white font-mono px-3 py-1 rounded-full outline-none w-28"
              autoFocus
            />
            <button type="submit" className="text-xs bg-indigo-600 text-white font-mono font-semibold px-2.5 py-1 rounded-full">Add</button>
            <button type="button" onClick={() => setIsAddingTag(false)} className="text-xs text-slate-400 font-mono px-1.5 hover:text-white">✕</button>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingTag(true)}
            className="text-xs px-3 py-1.5 font-mono border border-dashed border-slate-700 text-slate-400 hover:text-indigo-300 hover:border-indigo-400 transition rounded-full"
          >
            + Custom Tag
          </button>
        )}

        {(activeBaseTag || activeSubTag) && (
          <button onClick={clearFilters} className="text-xs text-rose-400 hover:underline ml-4 font-mono">Clear Filter</button>
        )}
      </div>

      {activeBaseTag && currentSubTags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mr-2">Dynamic Asset Vocabulary:</span>
          {currentSubTags.map((subTag) => (
            <div key={subTag} className="group relative cursor-pointer" onClick={() => setActiveSubTag(activeSubTag === subTag ? null : subTag)}>
              <span className={`text-xs px-3 py-1 font-mono rounded-md border block transition ${
                activeSubTag === subTag ? 'bg-indigo-500/30 text-indigo-200 border-indigo-500' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}>
                {subTag}
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 hidden group-hover:block bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-2xl z-20 text-xs text-slate-200">
                <p className="font-semibold text-indigo-300 mb-1 font-mono">{subTag}</p>
                <p className="text-slate-300 font-sans leading-relaxed">{VOCAB_DICTIONARY[subTag] || 'Extracted design keyword'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

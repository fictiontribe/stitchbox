import React, { useState } from 'react';
import { TAG_RELATIONS, VOCAB_DICTIONARY } from '../data/seedData';

export default function TagFilterBar({
  allBaseTags,
  activeBaseTag,
  activeSubTag,
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

  const currentSubTags = TAG_RELATIONS[activeBaseTag] || [];

  return (
    <section className="border-b border-[#25282B] px-8 py-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-[#607D8B] uppercase tracking-wider mr-2">Filter Base Tags:</span>
        {allBaseTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleBaseTagClick(tag)}
            className={`text-xs px-3.5 py-1.5 font-mono border transition rounded-full ${
              activeBaseTag === tag ? 'bg-[#D1DCD2] text-[#111315] border-[#D1DCD2] font-semibold' : 'bg-transparent border-[#25282B] hover:border-[#90A4AE] text-[#ECEFF1]'
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
              className="bg-[#1A1D20] border border-[#90A4AE] text-xs text-[#ECEFF1] font-mono px-3 py-1 rounded-full outline-none w-28"
              autoFocus
            />
            <button type="submit" className="text-xs bg-[#D1DCD2] text-[#111315] font-mono font-semibold px-2.5 py-1 rounded-full">Add</button>
            <button type="button" onClick={() => setIsAddingTag(false)} className="text-xs text-[#90A4AE] font-mono px-1.5 hover:text-[#ECEFF1]">✕</button>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingTag(true)}
            className="text-xs px-3 py-1.5 font-mono border border-dashed border-[#607D8B] text-[#90A4AE] hover:text-[#D1DCD2] hover:border-[#D1DCD2] transition rounded-full"
          >
            + Custom Tag
          </button>
        )}

        {(activeBaseTag || activeSubTag) && (
          <button onClick={clearFilters} className="text-xs text-[#E53935] hover:underline ml-4 font-mono">Clear Filter</button>
        )}
      </div>

      {activeBaseTag && currentSubTags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#1D2022] flex flex-wrap items-center gap-2 animate-fadeIn">
          <span className="text-xs font-mono text-[#607D8B] uppercase tracking-wider mr-2">Dynamic Vocabulary Map:</span>
          {currentSubTags.map((subTag) => (
            <div key={subTag} className="group relative cursor-pointer" onClick={() => setActiveSubTag(activeSubTag === subTag ? null : subTag)}>
              <span className={`text-xs px-3 py-1 font-mono rounded border block transition ${
                activeSubTag === subTag ? 'bg-[#90A4AE] text-[#111315] border-[#90A4AE]' : 'bg-[#1A1D20] text-[#90A4AE] border-[#25282B] hover:text-[#ECEFF1]'
              }`}>
                {subTag}
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 hidden group-hover:block bg-[#1A1D20] border border-[#25282B] p-3 rounded shadow-xl z-20 text-xs text-[#ECEFF1]">
                <p className="font-semibold text-[#D1DCD2] mb-1 font-mono">{subTag}</p>
                <p className="text-[#90A4AE] font-sans leading-relaxed">{VOCAB_DICTIONARY[subTag] || 'Specific design keyword'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

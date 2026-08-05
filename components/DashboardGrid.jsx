'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getDnaSourceUrl } from '../data/seedData';

export default function DashboardGrid({
  filteredLibrary,
  isProcessing,
  setSelectedItem,
  setBlendSlotA,
  setBlendSlotB,
  setOpenOverdrive,
  setOpenImagePrompt
}) {
  const [visibleCount, setVisibleCount] = useState(20);
  const loaderRef = useRef(null);

  // Reset visible cards count to 20 whenever active filters or library items change
  useEffect(() => {
    setVisibleCount(20);
  }, [filteredLibrary]);

  const hasMore = visibleCount < filteredLibrary.length;
  const visibleItems = filteredLibrary.slice(0, visibleCount);

  // IntersectionObserver to auto-load 20 more cards on scroll
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 20, filteredLibrary.length));
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const el = loaderRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, filteredLibrary.length]);

  const getItemSwatches = (item) => {
    const dsColor = item.recipe?.designSystem?.color || {};
    if (Array.isArray(dsColor.swatches) && dsColor.swatches.length >= 6) {
      return dsColor.swatches.slice(0, 6);
    }
    return [
      dsColor.lightBase || dsColor.surface || '#f8fafc',
      dsColor.darkBase || dsColor.card || '#0f172a',
      dsColor.primary || dsColor.accentA || '#4f46e5',
      dsColor.secondary || dsColor.accentB || '#64748b',
      dsColor.accent || dsColor.synthesizedAccent || '#10b981',
      dsColor.neutralText || '#1e293b'
    ];
  };

  return (
    <main className="px-4 sm:px-8 py-6 sm:py-8">
      {isProcessing && (
        <div className="mb-8 p-4 sm:p-6 bg-white border border-indigo-200 rounded-xl flex items-center justify-between animate-pulse glass-panel shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 rounded-lg border border-indigo-200"></div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-indigo-900">Analyzing Visual Assets with Gemini Flash...</p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Extracting graphic art direction, 6-color swatches, and design system rulesets</p>
            </div>
          </div>
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}

      {visibleItems.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col bg-white p-3.5 rounded-2xl border border-slate-200 animate-pulse shadow-xs">
              <div className="aspect-[4/3] bg-slate-200/80 rounded-xl mb-3"></div>
              <div className="h-4 bg-slate-200/80 rounded-md w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-100/90 rounded-md w-1/2 mb-4"></div>
              <div className="grid grid-cols-6 gap-1.5 pt-2.5 border-t border-slate-100">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="h-4 bg-slate-200/70 rounded-md"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {visibleItems.map((item) => {
          const swatches = getItemSwatches(item);
          const category = item.category || 'Website';
          const sourceUrl = getDnaSourceUrl(item);

          return (
            <article key={item.id} className="flex flex-col group cursor-pointer relative bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all duration-300" onClick={() => setSelectedItem(item)}>
              <div className="relative aspect-[4/3] bg-slate-100 rounded-xl border border-slate-200/90 overflow-hidden group-hover:border-indigo-500 transition duration-300 shadow-inner">
                {/* Category Badge */}
                <div className="absolute top-2.5 left-2.5 z-10 bg-slate-900/85 text-white font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-md tracking-wider backdrop-blur-sm border border-white/20 shadow-sm">
                  {category}
                </div>

                {/* Full color by default, grayscale on hover */}
                <img 
                  src={item.imageUrl} 
                  alt={item.creativeName} 
                  className="w-full h-full object-cover grayscale-0 opacity-100 group-hover:grayscale group-hover:opacity-90 transition duration-300" 
                />
                
                {/* Hover overlay controls */}
                <div className="absolute inset-0 bg-slate-900/75 opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col items-center justify-center gap-2 p-3 backdrop-blur-[2px]">
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setBlendSlotA(item.id); }} className="bg-white text-[10px] text-slate-900 font-mono font-bold px-2.5 py-1 rounded-lg hover:bg-indigo-600 hover:text-white transition shadow-md">+ Slot A</button>
                    <button onClick={(e) => { e.stopPropagation(); setBlendSlotB(item.id); }} className="bg-white text-[10px] text-slate-900 font-mono font-bold px-2.5 py-1 rounded-lg hover:bg-indigo-600 hover:text-white transition shadow-md">+ Slot B</button>
                  </div>
                  <div className="flex items-center gap-1.5 w-full mt-1">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (setOpenOverdrive) setOpenOverdrive(item);
                        else setSelectedItem(item);
                      }} 
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-mono font-bold py-1.5 px-2 rounded-lg transition shadow-md flex items-center justify-center gap-1 border border-indigo-400/50 truncate"
                    >
                      <span>⚡ Overdrive</span>
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (setOpenImagePrompt) setOpenImagePrompt(item);
                        else setSelectedItem(item);
                      }} 
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-mono font-extrabold py-1.5 px-2 rounded-lg transition shadow-md flex items-center justify-center gap-1 border border-amber-600 truncate"
                    >
                      <span>🍌 Image</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Meta & 6-Color Swatches */}
              <div className="mt-3 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition truncate font-display">{item.creativeName}</h3>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5 font-medium">Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}</p>
                  {sourceUrl && (
                    <div className="mt-1">
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-mono font-semibold transition hover:underline max-w-full truncate"
                        title={`Open ${sourceUrl} in new window`}
                      >
                        <span className="truncate">Source: {sourceUrl}</span>
                        <svg className="w-2.5 h-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>

                {/* 6 Color Swatches */}
                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold">6 Colors</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {swatches.map((hex, idx) => (
                      <div 
                        key={idx} 
                        className="h-4 rounded-md border border-slate-200/90 shadow-2xs hover:scale-105 transition-transform" 
                        style={{ backgroundColor: hex }}
                        title={`Color ${idx + 1}: ${hex}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lazy Loader Scroll Sentinel & Indicator */}
      {hasMore && (
        <div ref={loaderRef} className="mt-10 py-6 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2.5 text-indigo-700 bg-indigo-50/90 border border-indigo-200/80 px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-xs backdrop-blur-xs">
            <div className="w-4 h-4 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin flex-shrink-0"></div>
            <span>Loading 20 more cards... ({visibleItems.length} of {filteredLibrary.length} shown)</span>
          </div>
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 20, filteredLibrary.length))}
            className="text-[11px] font-mono font-medium text-slate-500 hover:text-indigo-600 underline transition"
          >
            Click to load +20 manually
          </button>
        </div>
      )}

      {!hasMore && filteredLibrary.length > 20 && (
        <div className="mt-10 py-4 text-center">
          <p className="text-xs font-mono font-semibold text-slate-400">
            ✓ All {filteredLibrary.length} visual blueprints loaded
          </p>
        </div>
      )}
    </main>
  );
}


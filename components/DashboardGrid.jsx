'use client';

import React from 'react';

export default function DashboardGrid({
  filteredLibrary,
  isProcessing,
  setSelectedItem,
  setBlendSlotA,
  setBlendSlotB
}) {
  return (
    <main className="px-4 sm:px-8 py-6 sm:py-8">
      {isProcessing && (
        <div className="mb-8 p-4 sm:p-6 bg-white border border-indigo-200 rounded-xl flex items-center justify-between animate-pulse glass-panel shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 rounded-lg border border-indigo-200"></div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-indigo-900">Analyzing Visual Assets with Gemini Flash...</p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Extracting structural properties, generating layout guidelines and rulesets</p>
            </div>
          </div>
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {filteredLibrary.map((item) => (
          <article key={item.id} className="flex flex-col group cursor-pointer relative" onClick={() => setSelectedItem(item)}>
            <div className="relative aspect-[4/3] bg-slate-100 rounded-xl border border-slate-200/90 overflow-hidden group-hover:border-indigo-500 transition duration-300 shadow-sm group-hover:shadow-md">
              {/* Full color by default, grayscale on hover */}
              <img 
                src={item.imageUrl} 
                alt={item.creativeName} 
                className="w-full h-full object-cover grayscale-0 opacity-100 group-hover:grayscale group-hover:opacity-90 transition duration-300" 
              />
              
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center gap-2 p-2">
                <button onClick={(e) => { e.stopPropagation(); setBlendSlotA(item.id); }} className="bg-white text-xs text-slate-900 font-mono font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition shadow-md">+ Slot A</button>
                <button onClick={(e) => { e.stopPropagation(); setBlendSlotB(item.id); }} className="bg-white text-xs text-slate-900 font-mono font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition shadow-md">+ Slot B</button>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">{item.creativeName}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5 font-medium">Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

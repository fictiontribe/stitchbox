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
    <main className="px-8 py-8">
      {isProcessing && (
        <div className="mb-8 p-6 bg-slate-900/90 border border-indigo-500/50 rounded-xl flex items-center justify-between animate-pulse glass-panel shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-950/80 rounded-lg border border-indigo-800/50"></div>
            <div>
              <p className="text-sm font-semibold text-indigo-200">Analyzing Visual Assets with Gemini 2.0 Flash...</p>
              <p className="text-xs text-slate-400">Extracting structural properties, generating layout guidelines and rulesets</p>
            </div>
          </div>
          <div className="w-6 h-6 border-2 border-t-transparent border-indigo-400 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredLibrary.map((item) => (
          <article key={item.id} className="flex flex-col group cursor-pointer" onClick={() => setSelectedItem(item)}>
            <div className="relative aspect-[4/3] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden group-hover:border-indigo-500/80 transition duration-300 shadow-lg">
              <img src={item.imageUrl} alt={item.creativeName} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition duration-300" />
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center gap-2 p-2">
                <button onClick={(e) => { e.stopPropagation(); setBlendSlotA(item.id); }} className="bg-slate-800 text-xs text-slate-200 font-mono px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition shadow-md">+ Slot A</button>
                <button onClick={(e) => { e.stopPropagation(); setBlendSlotB(item.id); }} className="bg-slate-800 text-xs text-slate-200 font-mono px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition shadow-md">+ Slot B</button>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition">{item.creativeName}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

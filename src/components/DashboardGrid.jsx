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
        <div className="mb-8 p-6 bg-[#1A1D20] border border-[#25282B] rounded-md flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#25282B] rounded"></div>
            <div>
              <p className="text-sm font-semibold text-[#D1DCD2]">Analyzing Visual Assets with Gemini Flash...</p>
              <p className="text-xs text-[#607D8B]">Extracting structural properties, generating layout guidelines and rulesets</p>
            </div>
          </div>
          <div className="w-6 h-6 border-2 border-t-transparent border-[#D1DCD2] rounded-full animate-spin"></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredLibrary.map((item) => (
          <article key={item.id} className="flex flex-col group cursor-pointer" onClick={() => setSelectedItem(item)}>
            <div className="relative aspect-[4/3] bg-[#1A1D20] rounded border border-[#25282B] overflow-hidden group-hover:border-[#90A4AE] transition">
              <img src={item.imageUrl} alt={item.creativeName} className="w-full h-full object-cover grayscale opacity-85 group-hover:grayscale-0 group-hover:opacity-100 transition duration-300" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); setBlendSlotA(item.id); }} className="bg-[#25282B] text-xs font-mono px-2.5 py-1.5 rounded hover:bg-[#D1DCD2] hover:text-[#111315] transition">+ Blend Slot A</button>
                <button onClick={(e) => { e.stopPropagation(); setBlendSlotB(item.id); }} className="bg-[#25282B] text-xs font-mono px-2.5 py-1.5 rounded hover:bg-[#D1DCD2] hover:text-[#111315] transition">+ Blend Slot B</button>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-semibold text-[#ECEFF1] group-hover:text-[#D1DCD2] transition">{item.creativeName}</h3>
              <p className="text-xs text-[#607D8B] font-mono mt-0.5">Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

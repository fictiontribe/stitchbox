import React from 'react';

export default function BlenderConsole({
  blendSlotA,
  blendSlotB,
  blendedResult,
  library,
  executeBlend,
  clearBlend
}) {
  const itemA = library.find(i => i.id === blendSlotA);
  const itemB = library.find(i => i.id === blendSlotB);

  return (
    <footer className="bg-[#141618] border-t border-[#25282B] p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#90A4AE]">The Prompt Blender</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#1A1D20] border border-[#25282B] px-3 py-2 rounded flex items-center gap-2 min-w-36">
              <span className="text-xs text-[#607D8B] font-mono">A:</span>
              <span className="text-xs font-semibold text-[#ECEFF1]">{itemA ? itemA.creativeName : '[Empty]'}</span>
            </div>
            <span className="text-xs text-[#607D8B] font-mono">+</span>
            <div className="bg-[#1A1D20] border border-[#25282B] px-3 py-2 rounded flex items-center gap-2 min-w-36">
              <span className="text-xs text-[#607D8B] font-mono">B:</span>
              <span className="text-xs font-semibold text-[#ECEFF1]">{itemB ? itemB.creativeName : '[Empty]'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={executeBlend} disabled={!blendSlotA || !blendSlotB} className="bg-[#D1DCD2] hover:bg-[#B9C6B9] text-[#111315] px-4 py-2 text-xs font-mono font-semibold rounded transition disabled:opacity-40">Generate Blend</button>
          {(blendSlotA || blendSlotB || blendedResult) && (
            <button onClick={clearBlend} className="text-xs text-[#90A4AE] hover:text-[#ECEFF1] font-mono">Clear</button>
          )}
        </div>
      </div>

      {blendedResult && (
        <div className="max-w-7xl mx-auto mt-6 p-6 bg-[#1A1D20] border border-[#25282B] rounded-md animate-fadeIn">
          <h4 className="text-xs font-mono uppercase text-[#D1DCD2]">Blended Result: {blendedResult.creativeName}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
            <div>
              <p className="text-xs text-[#90A4AE] font-mono">Blended Rules</p>
              <ul className="list-disc pl-4 mt-2 space-y-1">{blendedResult.recipe.alwaysRules.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
            <div>
              <p className="text-xs text-[#90A4AE] font-mono">Blended Bans</p>
              <ul className="list-disc pl-4 mt-2 space-y-1">{blendedResult.recipe.neverRules.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

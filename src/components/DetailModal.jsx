import React from 'react';

export default function DetailModal({
  selectedItem,
  setSelectedItem,
  customSubject,
  setCustomSubject,
  handleCopyBrief,
  handleCopyPrompt,
  copiedType,
  setActiveSubTag
}) {
  if (!selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1A1D20] border border-[#25282B] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row">
        
        <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-[#25282B] hover:bg-[#ECEFF1] hover:text-[#111315] text-[#ECEFF1] w-8 h-8 rounded-full flex items-center justify-center transition z-10 font-mono text-sm">✕</button>

        <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-[#25282B]">
          <img src={selectedItem.imageUrl} alt={selectedItem.creativeName} className="w-full h-auto rounded border border-[#25282B] bg-[#111315]" />
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedItem.baseTags.map(t => (
              <span key={t} className="text-xs bg-[#25282B] text-[#90A4AE] px-2.5 py-0.5 rounded font-mono">{t}</span>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs text-[#90A4AE] font-mono tracking-widest uppercase">Creative Identity</span>
            <h2 className="text-xl font-bold text-[#ECEFF1] mt-1">{selectedItem.creativeName}</h2>
            <p className="text-xs text-[#ECEFF1] mt-4 bg-[#111315] p-3 rounded border border-[#25282B]">{selectedItem.summary}</p>

            <p className="text-xs text-[#90A4AE] font-mono uppercase tracking-wider mt-6">Aesthetic DNA Tokens</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedItem.tokens.map(token => (
                <button 
                  key={token} 
                  onClick={() => { setActiveSubTag(token); setSelectedItem(null); }} 
                  className="text-xs bg-[#25282B] text-[#90A4AE] hover:text-[#D1DCD2] hover:bg-[#34393E] px-2 py-1 rounded font-mono transition"
                >
                  #{token}
                </button>
              ))}
            </div>

            <p className="text-xs text-[#90A4AE] font-mono uppercase tracking-wider mt-6 mb-2">Subject Customizer</p>
            <input 
              type="text" 
              value={customSubject} 
              onChange={(e) => setCustomSubject(e.target.value)} 
              className="w-full bg-[#111315] border border-[#25282B] rounded px-3 py-2 text-xs text-[#ECEFF1] font-mono focus:border-[#D1DCD2] outline-none" 
            />
          </div>

          <div className="mt-8 pt-4 border-t border-[#25282B] flex gap-3">
            <button onClick={() => handleCopyBrief(selectedItem)} className="flex-1 bg-[#25282B] hover:bg-[#34393E] text-[#ECEFF1] text-xs font-mono py-2.5 rounded transition">
              {copiedType === 'brief' ? 'Brief Copied!' : 'Copy Brief'}
            </button>
            <button onClick={() => handleCopyPrompt(selectedItem)} className="flex-1 bg-[#D1DCD2] hover:bg-[#B9C6B9] text-[#111315] text-xs font-mono font-semibold py-2.5 rounded transition">
              {copiedType === 'prompt' ? 'Stitch Prompt Copied!' : 'Copy Stitch Prompt'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

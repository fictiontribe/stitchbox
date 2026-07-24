import React, { useState } from 'react';

export default function Header({
  apiKey,
  setApiKey,
  saveApiKey,
  clearApiKey,
  isKeySaved,
  keyStatusMessage,
  handleFileUpload,
  handleUrlIngest,
  urlInput,
  setUrlInput,
  isProcessing
}) {
  const [inputVal, setInputVal] = useState(apiKey || '');

  const handleKeySubmit = (e) => {
    e.preventDefault();
    saveApiKey(inputVal);
  };

  const handleClear = () => {
    setInputVal('');
    clearApiKey();
  };

  return (
    <header className="border-b border-[#25282B] px-8 py-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#ECEFF1] flex items-center gap-2">
          STITCHBOX <span className="text-xs bg-[#25282B] text-[#90A4AE] px-2 py-0.5 font-mono uppercase tracking-widest rounded">Beta</span>
        </h1>
        <p className="text-xs text-[#90A4AE] mt-1">Extract, organize, and translate website design DNA for Google Stitch.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
        <form onSubmit={handleKeySubmit} className="flex bg-[#1A1D20] border border-[#25282B] rounded-md focus-within:border-[#90A4AE] transition overflow-hidden items-center">
          <span className="bg-[#25282B] text-[10px] text-[#90A4AE] font-mono px-3 py-3 flex items-center border-r border-[#25282B]">API KEY</span>
          <input 
            type="password" 
            placeholder="AI Studio / Vertex Key..." 
            value={inputVal} 
            onChange={(e) => setInputVal(e.target.value)} 
            className="bg-transparent text-xs text-[#ECEFF1] px-3 py-2.5 outline-none w-44 placeholder-[#607D8B]"
          />
          {inputVal ? (
            <div className="flex items-center">
              <button 
                type="submit" 
                className="bg-[#D1DCD2] hover:bg-[#B9C6B9] text-[#111315] text-[11px] font-mono font-semibold px-3 py-2.5 border-l border-[#25282B] transition"
              >
                {isKeySaved ? 'Saved ✓' : 'Save Key'}
              </button>
              <button 
                type="button" 
                onClick={handleClear} 
                className="bg-[#25282B] text-[10px] text-[#E53935] font-mono px-2 py-2.5 hover:underline border-l border-[#1A1D20]"
              >
                Clear
              </button>
            </div>
          ) : (
            <span className="text-[10px] text-[#607D8B] font-mono px-2">Optional</span>
          )}
        </form>

        <div className="relative group flex items-center gap-2 bg-[#D1DCD2] hover:bg-[#B9C6B9] border border-[#D1DCD2] px-4 py-2.5 rounded-md cursor-pointer transition">
          <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} disabled={isProcessing} />
          <span className="text-xs text-[#111315] font-mono font-semibold">Upload Screenshot</span>
        </div>

        <form onSubmit={handleUrlIngest} className="flex bg-[#1A1D20] border border-[#25282B] rounded-md focus-within:border-[#90A4AE] transition overflow-hidden">
          <input type="url" placeholder="Paste URL..." value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="bg-transparent text-xs text-[#ECEFF1] px-4 py-2.5 outline-none w-32 placeholder-[#607D8B]" disabled={isProcessing} />
          <button type="submit" className="bg-[#25282B] px-3 text-xs font-mono transition border-l border-[#25282B] text-[#90A4AE]">Analyze</button>
        </form>
      </div>
    </header>
  );
}

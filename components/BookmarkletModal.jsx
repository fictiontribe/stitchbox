'use client';

import React, { useState } from 'react';

export default function BookmarkletModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const bookmarkletCode = `javascript:(function(){if(window.__stitchbox_running)return;window.__stitchbox_running=true;var toast=document.createElement('div');toast.innerHTML='⚡ Capturing page for StitchBox...';toast.style.cssText='position:fixed;top:20px;right:20px;z-index:2147483647;background:#0f172a;color:#fbbf24;padding:12px 20px;font-family:sans-serif;font-size:13px;font-weight:700;border-radius:12px;box-shadow:0 20px 30px rgba(0,0,0,0.5);border:1px solid #fbbf24;';document.body.appendChild(toast);function fallback(){if(toast)toast.remove();window.__stitchbox_running=false;window.open('https://stitchbox.fictiontribe.com/?addUrl='+encodeURIComponent(window.location.href),'_blank');}var script=document.createElement('script');script.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';script.onload=function(){if(typeof html2canvas==='undefined'){fallback();return;}html2canvas(document.body,{useCORS:true,allowTaint:true,scale:0.8,logging:false}).then(function(canvas){try{var imgData=canvas.toDataURL('image/jpeg',0.85);if(!imgData||imgData.length<1000){fallback();return;}toast.innerHTML='✨ Analyzing design DNA...';fetch('https://stitchbox.fictiontribe.com/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imageBase64:imgData.split(',')[1],mimeType:'image/jpeg'})}).then(function(r){return r.json();}).then(function(res){if(res&&res.success&&res.dna){var newItem={id:String(Date.now()),creativeName:res.dna.creativeName||document.title||'Captured Page',uploadedAt:new Date(),imageUrl:imgData,sourceUrl:window.location.href,summary:res.dna.summary,tokens:res.dna.tokens||[],baseTags:res.dna.baseTags||['Website'],recipe:res.dna.recipe,category:res.dna.category||'Website'};fetch('https://stitchbox.fictiontribe.com/api/library',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newItem)}).then(function(){toast.innerHTML='✓ Added to StitchBox!';toast.style.background='#059669';toast.style.color='#ffffff';toast.style.borderColor='#10b981';setTimeout(function(){toast.remove();window.__stitchbox_running=false;},2000);window.open('https://stitchbox.fictiontribe.com','_blank');}).catch(fallback);}else{fallback();}}).catch(fallback);}catch(e){fallback();}}).catch(fallback);};script.onerror=fallback;document.body.appendChild(script);})();`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(bookmarkletCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border border-slate-300"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 text-xl font-bold">
            🔖
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-slate-900">StitchBox 1-Click Bookmarklet</h2>
            <p className="text-xs text-slate-500 font-mono">Capture any website instantly into StitchBox</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 mb-6 space-y-2">
          <p className="font-semibold text-amber-950">How to install in 2 seconds:</p>
          <ol className="list-decimal list-inside space-y-1 text-amber-800 font-medium">
            <li>Make sure your browser's Bookmarks Bar is visible (<code className="bg-amber-100 px-1 py-0.5 rounded text-[10px]">Cmd+Shift+B</code> or <code className="bg-amber-100 px-1 py-0.5 rounded text-[10px]">Ctrl+Shift+B</code>).</li>
            <li>Drag the button below directly onto your Bookmarks Bar!</li>
            <li>When browsing any website, click the bookmark to instantly send it to StitchBox.</li>
          </ol>
        </div>

        {/* Draggable Bookmarklet Button */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center mb-6">
          <p className="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider font-semibold">Drag this button to your Bookmarks Bar:</p>
          <a
            href={bookmarkletCode}
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-amber-400 font-mono text-xs font-bold px-5 py-3 rounded-xl shadow-lg border border-amber-500/50 cursor-grab active:cursor-grabbing transition transform hover:scale-105"
            title="Drag me to your Bookmarks Bar!"
          >
            <span>🔖 Add to StitchBox</span>
          </a>
        </div>

        {/* Copy JS Code Option */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <input
            type="text"
            readOnly
            value={bookmarkletCode}
            className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-[10px] font-mono text-slate-600 truncate focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold px-4 py-2 rounded-lg transition whitespace-nowrap"
          >
            {copied ? '✓ Copied JS!' : 'Copy Code'}
          </button>
        </div>
      </div>
    </div>
  );
}

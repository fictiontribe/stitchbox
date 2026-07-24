'use client';

import React from 'react';

export default function NoticeBanners({ apiError, setApiError, apiKey, isCloudManaged }) {
  return (
    <>
      {apiError && (
        <div className="bg-rose-950/80 border-b border-rose-800 px-8 py-3 flex justify-between items-start text-xs text-rose-100 font-mono leading-relaxed backdrop-blur-md">
          <div className="flex items-start gap-2">
            <span className="text-rose-400 font-bold">⚠ API ERROR:</span>
            <div>
              <p className="text-rose-200 font-semibold">{apiError.title || 'Gemini API Error'}</p>
              <p className="text-slate-300 mt-0.5">{apiError.message || String(apiError)}</p>
              {apiError.suggestion && (
                <p className="text-emerald-300 mt-1 text-[11px]">💡 Solution: {apiError.suggestion}</p>
              )}
            </div>
          </div>
          <button onClick={() => setApiError(null)} className="text-rose-300 font-bold hover:text-white ml-4">✕</button>
        </div>
      )}

      {isCloudManaged && !apiKey && (
        <div className="bg-indigo-950/60 border-b border-indigo-800/40 px-8 py-2.5 flex justify-between items-center text-xs text-indigo-200 font-mono backdrop-blur-md">
          <span>✨ Cloud Managed Gemini 2.0 Flash API Active. Powered by Next.js Serverless Route Gateway.</span>
          <span className="text-[10px] bg-indigo-900/80 border border-indigo-700/50 text-indigo-300 px-2 py-0.5 rounded uppercase">Gemini 2.0 Flash</span>
        </div>
      )}

      {!apiKey && !isCloudManaged && (
        <div className="bg-amber-950/60 border-b border-amber-800/40 px-8 py-2.5 flex justify-between items-center text-xs text-amber-200 font-mono backdrop-blur-md">
          <span>Simulation Mode: Active. Enter your Google AI Studio key above or deploy with GEMINI_API_KEY environment variable.</span>
          <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-amber-100">Get Free Key</a>
        </div>
      )}
    </>
  );
}

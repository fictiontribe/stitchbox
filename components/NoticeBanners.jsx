'use client';

import React from 'react';

export default function NoticeBanners({ apiError, setApiError }) {
  return (
    <>
      {apiError && (
        <div className="bg-rose-50 border-b border-rose-200 px-8 py-3.5 flex justify-between items-start text-xs text-rose-950 font-mono leading-relaxed backdrop-blur-md sticky top-[73px] z-20 shadow-md">
          <div className="flex items-start gap-3">
            <span className="text-rose-600 font-bold text-sm">⚠</span>
            <div>
              <p className="text-rose-900 font-bold tracking-wide">{apiError.title || 'Gemini API Error'}</p>
              <p className="text-slate-800 mt-0.5">{apiError.message || String(apiError)}</p>
              {apiError.suggestion && (
                <p className="text-emerald-700 mt-1 text-[11px] font-semibold">💡 Solution: {apiError.suggestion}</p>
              )}
            </div>
          </div>
          <button onClick={() => setApiError(null)} className="text-rose-600 font-bold hover:text-rose-950 ml-4 text-sm">✕</button>
        </div>
      )}
    </>
  );
}

'use client';

import React from 'react';

export default function NoticeBanners({ apiError, setApiError }) {
  if (!apiError) return null;

  const getErrorMessage = (err) => {
    if (!err) return 'An unexpected error occurred.';
    if (typeof err === 'string') return err;
    if (err.message && typeof err.message === 'string') return err.message;
    if (err.type === 'error' || err.constructor?.name === 'ProgressEvent' || String(err).includes('ProgressEvent')) {
      return 'Network request or file reading was interrupted. Please check network connection or try uploading the image directly.';
    }
    try {
      const str = String(err);
      if (str.includes('[object')) return 'An unexpected error occurred during processing.';
      return str;
    } catch (e) {
      return 'An unexpected error occurred during processing.';
    }
  };

  return (
    <div className="bg-rose-50 border-b border-rose-200 px-8 py-3.5 flex justify-between items-start text-xs text-rose-950 font-mono leading-relaxed backdrop-blur-md sticky top-[73px] z-20 shadow-md">
      <div className="flex items-start gap-3">
        <span className="text-rose-600 font-bold text-sm">⚠</span>
        <div>
          <p className="text-rose-900 font-bold tracking-wide">{apiError.title || 'Gemini API Error'}</p>
          <p className="text-slate-800 mt-0.5">{getErrorMessage(apiError)}</p>
          {apiError.suggestion && (
            <p className="text-emerald-700 mt-1 text-[11px] font-semibold">💡 Solution: {apiError.suggestion}</p>
          )}
        </div>
      </div>
      <button onClick={() => setApiError(null)} className="text-rose-600 font-bold hover:text-rose-950 ml-4 text-sm">✕</button>
    </div>
  );
}

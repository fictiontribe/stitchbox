import React from 'react';

export default function NoticeBanners({ apiError, setApiError, apiKey, isCloudManaged }) {
  return (
    <>
      {apiError && (
        <div className="bg-[#E53935]/15 border-b border-[#E53935] px-8 py-3 flex justify-between items-start text-xs text-[#ECEFF1] font-mono leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="text-[#E53935] font-bold">⚠ API ERROR:</span>
            <div>
              <p className="text-[#ECEFF1] font-semibold">{apiError.title || 'Gemini API Error'}</p>
              <p className="text-[#90A4AE] mt-0.5">{apiError.message || String(apiError)}</p>
              {apiError.suggestion && (
                <p className="text-[#D1DCD2] mt-1 text-[11px]">💡 Solution: {apiError.suggestion}</p>
              )}
            </div>
          </div>
          <button onClick={() => setApiError(null)} className="text-[#ECEFF1] font-bold hover:text-[#E53935] ml-4">✕</button>
        </div>
      )}

      {isCloudManaged && !apiKey && (
        <div className="bg-[#D1DCD2]/15 border-b border-[#D1DCD2]/40 px-8 py-2.5 flex justify-between items-center text-xs text-[#D1DCD2] font-mono">
          <span>✨ Vertex Cloud Managed API: Active. Visual analysis is powered by the serverless Cloudflare Function gateway.</span>
          <span className="text-[10px] bg-[#25282B] text-[#90A4AE] px-2 py-0.5 rounded uppercase">Vertex AI / Gemini 1.5</span>
        </div>
      )}

      {!apiKey && !isCloudManaged && (
        <div className="bg-[#FFB380]/15 border-b border-[#FFB380]/40 px-8 py-2.5 flex justify-between items-center text-xs text-[#FFB380] font-mono">
          <span>Simulation Mode: Active. Enter your Google AI Studio or Vertex AI key in the header to run live visual analysis.</span>
          <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-[#ECEFF1]">Get Free Key</a>
        </div>
      )}
    </>
  );
}

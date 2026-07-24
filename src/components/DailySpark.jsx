import React from 'react';

export default function DailySpark({ dailySpark, generateNewSpark }) {
  if (!dailySpark) return null;

  return (
    <section className="bg-gradient-to-r from-[#1A1D20] to-[#121417] border-b border-[#25282B] px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-start gap-3">
        <div className="bg-[#D1DCD2] text-[#111315] p-1.5 rounded text-xs font-bold font-mono mt-0.5">SPARK</div>
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#90A4AE]">Proactive Inspiration Challenge</h4>
          <p className="text-xs text-[#ECEFF1] mt-0.5">
            Generate <span className="text-[#D1DCD2] font-semibold">"{dailySpark.subject}"</span> using <span className="text-[#D1DCD2] font-semibold">{dailySpark.style}</span>.
          </p>
        </div>
      </div>
      <button onClick={generateNewSpark} className="text-xs font-mono text-[#90A4AE] hover:text-[#ECEFF1] transition border border-[#25282B] hover:border-[#90A4AE] px-3 py-1.5 rounded">Re-Roll Idea</button>
    </section>
  );
}

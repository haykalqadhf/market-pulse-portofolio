import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Info, X } from 'lucide-react';
import { useFearAndGreed } from '../hooks/useFearAndGreed';

export const FearAndGreedWidget = () => {
  const { data, isLoading } = useFearAndGreed();
  const [showInfo, setShowInfo] = useState(false); // State untuk tooltip

  if (isLoading || !data) return ( /* Skeleton loader sama seperti sebelumnya */
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col justify-center items-center animate-pulse"><div className="w-32 h-16 bg-slate-200 rounded-t-full mb-4"></div><div className="h-4 bg-slate-200 rounded w-20"></div></div>
  );

  const getSentimentDetails = (value) => {
    if (value <= 25) return { color: '#ef4444', text: 'text-red-600' };
    if (value <= 45) return { color: '#fb923c', text: 'text-orange-500' };
    if (value <= 55) return { color: '#facc15', text: 'text-yellow-500' };
    if (value <= 75) return { color: '#4ade80', text: 'text-green-500' };
    return { color: '#10b981', text: 'text-emerald-600' };
  };

  const sentiment = getSentimentDetails(data.value);
  const gaugeData = [{ value: data.value, fill: sentiment.color }, { value: 100 - data.value, fill: '#f1f5f9' }];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full min-h-[220px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 cursor-default relative">
      
      {/* Header dengan Tombol Info */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            Macro Sentiment
            <button onClick={() => setShowInfo(!showInfo)} className="text-slate-400 hover:text-blue-600 transition-colors bg-slate-100 rounded-full p-0.5">
              <Info size={14} />
            </button>
          </div>
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Fear & Greed Index</div>
        </div>
      </div>

      {/* Tooltip Penjelasan Modal Kecil */}
      {showInfo && (
        <div className="absolute top-12 left-4 right-4 bg-slate-800 text-white p-3 rounded-lg text-xs shadow-xl z-10 border border-slate-700">
          <div className="flex justify-between items-start mb-1">
            <strong className="text-blue-400">What is this?</strong>
            <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-white"><X size={12} /></button>
          </div>
          <p className="leading-relaxed">A score of 0-45 indicates "Fear" (potential buying opportunity). A score of 55-100 indicates "Greed" (market is due for a correction).</p>
        </div>
      )}
      
      {/* Area Visual Spidometer */}
      <div className="relative flex flex-col items-center mt-2">
        <ResponsiveContainer width="100%" height={90}>
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie data={gaugeData} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={55} outerRadius={72} dataKey="value" stroke="none">
              {gaugeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute bottom-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-extrabold ${sentiment.text} leading-none`}>{data.value}</span>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-1">{data.classification}</span>
        </div>
      </div>
      <div className="w-full flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-2 border-t border-slate-50 pt-2">
        <span>Extreme Fear</span><span>Extreme Greed</span>
      </div>
    </div>
  );
};
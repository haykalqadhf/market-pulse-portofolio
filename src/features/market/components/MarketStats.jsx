import React, { useMemo } from 'react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export const MarketStats = ({ coins }) => {
  const stats = useMemo(() => {
    if (!coins || coins.length === 0) return null;

    const topGainer = coins.reduce((prev, current) => 
      (prev.price_change_percentage_24h > current.price_change_percentage_24h) ? prev : current
    );

    const totalTrend = coins.reduce((sum, coin) => sum + coin.price_change_percentage_24h, 0);
    const avgTrend = totalTrend / coins.length;

    const topCoin = coins[0];

    return { topGainer, avgTrend, topCoin };
  }, [coins]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Market Trend */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 cursor-default">
        <div className="text-sm font-medium text-slate-500 mb-1">Average Market Trend (24h)</div>
        <div className={`text-2xl font-bold ${stats.avgTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatPercentage(stats.avgTrend)}
        </div>
        <div className="text-xs text-slate-400 mt-2">Based on top {coins.length} assets</div>
      </div>

      {/* Card 2: Top Gainer */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-blue-100 hover:border-blue-200 cursor-default">
        <div>
          <div className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
            Top Gainer 
            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full tracking-wide">
              TOP 50
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.topGainer.name}</div>
          <div className="text-sm text-green-600 font-medium mt-1">
            {formatPercentage(stats.topGainer.price_change_percentage_24h)}
          </div>
        </div>
        <img src={stats.topGainer.image} alt="Top Gainer" className="w-12 h-12 opacity-80 transition-transform duration-500 hover:scale-110 hover:opacity-100" />
      </div>

      {/* Card 3: Top Asset Status */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-amber-100 hover:border-amber-200 cursor-default">
        <div>
          <div className="text-sm font-medium text-slate-500 mb-1">Top Asset Price</div>
          <div className="text-2xl font-bold text-slate-900">{stats.topCoin.symbol.toUpperCase()}</div>
          <div className="text-sm text-slate-600 font-medium mt-1">
            {formatCurrency(stats.topCoin.current_price)}
          </div>
        </div>
        <img src={stats.topCoin.image} alt="Top Asset" className="w-12 h-12 opacity-80 transition-transform duration-500 hover:scale-110 hover:opacity-100" />
      </div>
    </div>
  );
};
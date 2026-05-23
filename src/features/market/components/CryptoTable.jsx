import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { SparklineChart } from './SparklineChart';
import { AssetModal } from './AssetModal';

export const CryptoTable = ({ coins, watchlist, toggleWatchlist }) => {
  const [selectedCoin, setSelectedCoin] = useState(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
              <th className="p-4 w-10"></th> {/* Kolom untuk Bintang */}
              <th className="p-4 font-semibold">Asset</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">24h Change</th>
              <th className="p-4 font-semibold hidden md:table-cell">7 Days Trend</th>
              <th className="p-4 font-semibold hidden lg:table-cell">Market Cap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coins.map((coin) => (
              <tr key={coin.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => setSelectedCoin(coin)}>
                <td className="p-4 text-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Mencegah modal terbuka saat mengklik bintang
                      toggleWatchlist(coin.id);
                    }}
                    className={`transition-colors hover:scale-110 ${watchlist.includes(coin.id) ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`}
                  >
                    <Star size={18} fill={watchlist.includes(coin.id) ? 'currentColor' : 'none'} strokeWidth={2} />
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{coin.name}</div>
                      <div className="text-xs text-slate-500 uppercase">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-medium text-slate-900">{formatCurrency(coin.current_price)}</td>
                <td className="p-4">
                  <div className={`font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell w-48">
                  <div className="h-12 w-32">
                    <SparklineChart data={coin.sparkline_in_7d.price} isPositive={coin.price_change_percentage_24h >= 0} />
                  </div>
                </td>
                <td className="p-4 hidden lg:table-cell text-slate-600 font-medium">{formatCurrency(coin.market_cap)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedCoin && <AssetModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />}
    </>
  );
};
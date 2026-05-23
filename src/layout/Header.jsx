import React from 'react';
import { Menu, Github, Moon, Sun } from 'lucide-react';
import { useGlobalData } from '../features/market/hooks/useGlobalData.js';

export const Header = ({ isDarkMode, setIsDarkMode }) => {
  const globalData = useGlobalData();

  const formatCompact = (num) => {
    if (!num) return '$0';
    if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
    return '$' + num.toLocaleString();
  };

  return (
    <header className="w-full bg-white dark:bg-slate-900 flex flex-col border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 font-sans transition-colors duration-300">
      
      {/* Top Global Stats Bar (Real-Time & Dark Mode Ready) */}
      <div className="hidden md:flex items-center justify-between px-4 py-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500 dark:text-slate-400 font-medium overflow-x-auto transition-colors duration-300">
        <div className="flex items-center gap-4 whitespace-nowrap">
          <span>Coins: <span className="text-blue-600 dark:text-blue-400 font-bold">{globalData?.active_cryptocurrencies?.toLocaleString() || '...'}</span></span>
          <span>Exchanges: <span className="text-blue-600 dark:text-blue-400 font-bold">{globalData?.markets?.toLocaleString() || '...'}</span></span>
          <span>Market Cap: <span className="text-blue-600 dark:text-blue-400 font-bold">{formatCompact(globalData?.total_market_cap?.usd)}</span></span>
          <span>24h Vol: <span className="text-blue-600 dark:text-blue-400 font-bold">{formatCompact(globalData?.total_volume?.usd)}</span></span>
          <span>Dominance: <span className="text-slate-700 dark:text-slate-300">
            BTC {globalData?.market_cap_percentage?.btc?.toFixed(1)}% ETH {globalData?.market_cap_percentage?.eth?.toFixed(1)}%
          </span></span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-md">M</div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">Market<span className="text-blue-600 dark:text-blue-400">Pulse</span></span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700 dark:text-slate-300">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cryptocurrencies</a>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {/* TOMBOL TOGGLE DARK MODE (KODE YANG DIPERBAIKI) */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {/* Logika ditukar agar ikon mewakili mode saat ini */}
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <a href="#" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
            <Github size={16} /> <span className="hidden lg:inline">Source Code</span>
          </a>
          
          <button className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
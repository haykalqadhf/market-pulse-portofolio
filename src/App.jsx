import React, { useState, useMemo, useEffect } from 'react';
import { useMarketData } from './features/market/hooks/useMarketData';
import { useWatchlist } from './features/market/hooks/useWatchlist';
import { CryptoTable } from './features/market/components/CryptoTable';
import { MarketStats } from './features/market/components/MarketStats';
import { MarketControls } from './features/market/components/MarketControls';
import { TableSkeleton } from './features/market/components/TableSkeleton';
import { FearAndGreedWidget } from './features/market/components/FearAndGreedWidget';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';

function App() {
  // State untuk Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  // Efek untuk mengaktifkan class 'dark' di HTML root
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const { data: coins, isLoading, error } = useMarketData('usd', 50);
  const { watchlist, toggleWatchlist } = useWatchlist();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredCoins = useMemo(() => {
    if (!coins) return [];
    
    let result = coins;
    if (activeTab === 'watchlist') {
      result = result.filter(coin => watchlist.includes(coin.id));
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter((coin) => 
        coin.name.toLowerCase().includes(lowerCaseQuery) || 
        coin.symbol.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    return result;
  }, [coins, searchQuery, activeTab, watchlist]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="flex-grow p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          
          {error && (
            <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Offline Mode</h3>
                <p className="text-sm">{error}</p>
              </div>
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-100 text-xs font-bold rounded-full">
                MOCK DATA
              </span>
            </div>
          )}

          {isLoading && !coins.length ? (
            <>
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl mb-8 animate-pulse"></div>
              <TableSkeleton />
            </>
          ) : (
            <>
              {coins.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                  <div className="lg:col-span-3">
                    <MarketStats coins={coins} /> 
                  </div>
                  <div className="lg:col-span-1">
                    <FearAndGreedWidget />
                  </div>
                </div>
              )}
              
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 pt-4 flex gap-6">
                  <button 
                    onClick={() => setActiveTab('all')}
                    className={`pb-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'all' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    All Assets
                  </button>
                  <button 
                    onClick={() => setActiveTab('watchlist')}
                    className={`pb-3 font-bold text-sm transition-colors border-b-2 flex items-center gap-1.5 ${activeTab === 'watchlist' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    Watchlist <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded text-[10px]">{watchlist.length}</span>
                  </button>
                </div>

                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                  <MarketControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>

                {filteredCoins.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center">
                    <div className="text-4xl mb-4">{activeTab === 'watchlist' && !searchQuery ? '⭐' : '🔍'}</div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                      {activeTab === 'watchlist' && !searchQuery ? 'Your Watchlist is Empty' : 'No assets found'}
                    </h3>
                    <p className="mt-1">
                      {activeTab === 'watchlist' && !searchQuery 
                        ? 'Click the star icon on any asset to add it to your watchlist.' 
                        : `We couldn't find anything matching "${searchQuery}"`}
                    </p>
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:underline">Clear search</button>
                    )}
                  </div>
                ) : (
                  <CryptoTable coins={filteredCoins} watchlist={watchlist} toggleWatchlist={toggleWatchlist} />
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
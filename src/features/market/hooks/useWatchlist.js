import { useState, useEffect } from 'react';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('marketPulseWatchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('marketPulseWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (coinId) => {
    setWatchlist((prev) => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId) // Hapus jika sudah ada
        : [...prev, coinId] // Tambah jika belum ada
    );
  };

  return { watchlist, toggleWatchlist };
};
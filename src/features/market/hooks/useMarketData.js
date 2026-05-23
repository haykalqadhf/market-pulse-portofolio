import { useState, useEffect } from 'react';
import { coinGeckoClient } from '../../../api/axiosClient';
import { fallbackCoins } from '../data/mockData'; // Import data cadangan

export const useMarketData = (currency = 'usd', limit = 50) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true);
      try {
        const response = await coinGeckoClient.get('/coins/markets', {
          params: {
            vs_currency: currency,
            order: 'market_cap_desc',
            per_page: limit,
            page: 1,
            sparkline: true,
            price_change_percentage: '24h',
          },
        });
        setData(response.data);
        setError(null); // Bersihkan error jika berhasil
      } catch (err) {
        console.warn("CoinGecko API Error. Menggunakan Fallback Data.", err);
        
        // JIKA GAGAL: Masukkan data cadangan agar UI tetap menyala
        setData(fallbackCoins);
        
        // Berikan pesan peringatan ringan, bukan error mematikan
        setError('Live server sedang sibuk. Menampilkan data offline cadangan.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
    
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, [currency, limit]);

  return { data, isLoading, error };
};
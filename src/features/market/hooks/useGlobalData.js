import { useState, useEffect } from 'react';
import { coinGeckoClient } from '../../../api/axiosClient';

export const useGlobalData = () => {
  const [globalData, setGlobalData] = useState(null);

  useEffect(() => {
    const fetchGlobal = async () => {
      try {
        const response = await coinGeckoClient.get('/global');
        setGlobalData(response.data.data);
      } catch (err) {
        console.warn("Global API Rate Limit. Menggunakan Mock Data.");
        // Fallback data statis jika server sibuk
        setGlobalData({
          active_cryptocurrencies: 14204,
          markets: 1024,
          total_market_cap: { usd: 2540000000000 },
          total_volume: { usd: 78200000000 },
          market_cap_percentage: { btc: 54.2, eth: 16.5 }
        });
      }
    };
    fetchGlobal();
  }, []);

  return globalData;
};
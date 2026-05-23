import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFearAndGreed = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFnG = async () => {
      try {
        // Limit 1 karena kita hanya butuh skor hari ini
        const response = await axios.get('https://api.alternative.me/fng/?limit=1');
        const result = response.data.data[0];
        
        setData({
          value: parseInt(result.value, 10),
          classification: result.value_classification
        });
      } catch (error) {
        console.error("Gagal mengambil Fear & Greed Index", error);
        // Fallback data jika API gagal agar UI tetap aman
        setData({ value: 50, classification: "Neutral" }); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchFnG();
  }, []);

  return { data, isLoading };
};
import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, XAxis } from 'recharts';
import { X, TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle, Globe, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { coinGeckoClient } from '../../../api/axiosClient';

const CURRENCY_OPTIONS = [
  { code: 'usd', name: 'USD ($) - United States', rate: 1 },
  { code: 'idr', name: 'IDR (Rp) - Indonesia', rate: 16200 },
  { code: 'eur', name: 'EUR (€) - European Union', rate: 0.92 },
  { code: 'jpy', name: 'JPY (¥) - Japan', rate: 156 },
  { code: 'gbp', name: 'GBP (£) - United Kingdom', rate: 0.79 },
  { code: 'sgd', name: 'SGD (S$) - Singapore', rate: 1.35 },
];

export const AssetModal = ({ coin, onClose }) => {
  const [investment, setInvestment] = useState(1000);
  const [timeframe, setTimeframe] = useState(7); 
  const [currency, setCurrency] = useState('usd');
  const [historicalPrices, setHistoricalPrices] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);
  
  // State ML
  const [forecastData, setForecastData] = useState([]);
  const [predictionDays, setPredictionDays] = useState(7);
  const [isPredicting, setIsPredicting] = useState(false);
  const [mlError, setMlError] = useState(null);
  const [isMlSimulated, setIsMlSimulated] = useState(false); // <- State baru untuk notifikasi ML

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoadingHistory(true);
      setIsSimulated(false);
      setForecastData([]); 
      setIsMlSimulated(false);
      try {
        const response = await coinGeckoClient.get(`/coins/${coin.id}/market_chart`, {
          params: { vs_currency: currency, days: 365, interval: 'daily' }
        });
        
        const formattedData = response.data.prices.map(item => ({
          date: new Date(item[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: item[1]
        }));
        setHistoricalPrices(formattedData);
      } catch (err) {
        console.warn("API Rate Limit. Activating Simulation Mode.");
        const currentCurrencyObj = CURRENCY_OPTIONS.find(c => c.code === currency);
        const exchangeRate = currentCurrencyObj ? currentCurrencyObj.rate : 1;
        const basePrice = coin.current_price * exchangeRate;
        const volatility = (Math.abs(coin.price_change_percentage_24h) / 100) || 0.05;
        
        let mockPrices = [];
        let currentMockPrice = basePrice;
        
        for (let i = 0; i <= 365; i++) {
          let d = new Date();
          d.setDate(d.getDate() - i);
          mockPrices.unshift({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: currentMockPrice
          });
          const randomMove = 1 + (Math.random() * volatility * 2 - volatility);
          currentMockPrice = currentMockPrice / randomMove;
        }
        setHistoricalPrices(mockPrices);
        setIsSimulated(true);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistoricalData();
  }, [coin.id, currency, coin.current_price, coin.price_change_percentage_24h]);

  const handlePredict = async () => {
    setIsPredicting(true);
    setMlError(null);
    setIsMlSimulated(false);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/predict/${coin.id}?days=${predictionDays}`);
      if (!res.ok) throw new Error('Failed to connect to ML Backend');
      const data = await res.json();
      
      if (data.status === 'success') {
        // Tangkap sinyal simulasi dari Python
        setIsMlSimulated(data.is_simulated || false);

        const currentCurrencyObj = CURRENCY_OPTIONS.find(c => c.code === currency);
        const exchangeRate = currentCurrencyObj ? currentCurrencyObj.rate : 1;
        
        const adjustedForecast = data.forecast.map(item => ({
          date: item.date,
          predicted_price: item.predicted_price * exchangeRate
        }));
        setForecastData(adjustedForecast);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setMlError("ML Server Offline. Please start the Python backend.");
      console.error(err);
    } finally {
      setIsPredicting(false);
    }
  };

  const chartData = useMemo(() => {
    if (historicalPrices.length === 0) return [];
    return historicalPrices.slice(-timeframe - 1);
  }, [historicalPrices, timeframe]);

  const combinedChartData = useMemo(() => {
    const hist = chartData.map(d => ({ ...d, predicted_price: null }));
    const pred = forecastData.map(d => ({ date: d.date, price: null, predicted_price: d.predicted_price }));
    
    if (hist.length > 0 && pred.length > 0) {
      pred.unshift({
        date: hist[hist.length - 1].date,
        price: null,
        predicted_price: hist[hist.length - 1].price
      });
    }
    return [...hist, ...pred];
  }, [chartData, forecastData]);

  const roiStats = useMemo(() => {
    if (historicalPrices.length === 0) return { currentValue: 0, profitLoss: 0, isProfit: true, pastPrice: 0 };
    const targetIndex = Math.max(0, historicalPrices.length - timeframe - 1);
    const pastPrice = historicalPrices[targetIndex].price;
    const currentPrice = historicalPrices[historicalPrices.length - 1]?.price || coin.current_price;
    const coinsBought = investment / pastPrice;
    const currentValue = coinsBought * currentPrice;
    const profitLoss = currentValue - investment;
    const isProfit = profitLoss >= 0;
    return { currentValue, profitLoss, isProfit, pastPrice };
  }, [historicalPrices, timeframe, investment, coin.current_price]);

  const isChartPositive = useMemo(() => {
    if (chartData.length < 2) return true;
    return chartData[chartData.length - 1].price >= chartData[0].price;
  }, [chartData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-700">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white">
          <div className="flex items-center gap-4">
            <img src={coin.image} alt={coin.name} className="w-10 h-10" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{coin.name}</h2>
              <span className="text-sm font-medium text-slate-500 uppercase">{coin.symbol}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div>
              <div className="text-sm text-slate-500 mb-1">Current Price ({currency.toUpperCase()})</div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-slate-900">
                  {formatCurrency(historicalPrices[historicalPrices.length - 1]?.price || coin.current_price, currency)}
                </span>
                <span className={`text-sm font-medium flex items-center mb-1 ${isChartPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isChartPositive ? <TrendingUp size={16} className="mr-1"/> : <TrendingDown size={16} className="mr-1"/>}
                  Selected Timeframe
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 self-end">
              <select 
                value={predictionDays} 
                onChange={(e) => { setPredictionDays(Number(e.target.value)); setForecastData([]); setIsMlSimulated(false); }}
                disabled={isPredicting}
                className="bg-slate-100 border border-slate-300 rounded-lg px-2 py-2 text-xs font-bold outline-none text-slate-700 cursor-pointer"
              >
                <option value={7}>7 Days Target</option>
                <option value={30}>1 Month Target</option>
                <option value={365}>1 Year Target</option>
              </select>

              <button 
                onClick={handlePredict}
                disabled={isPredicting || forecastData.length > 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
                  forecastData.length > 0 
                    ? 'bg-purple-100 text-purple-700 border border-purple-200 cursor-default' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {isPredicting ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Analysing...</>
                ) : forecastData.length > 0 ? (
                  <><Sparkles size={16} /> Forecast Loaded</>
                ) : (
                  <><Sparkles size={16} /> Run AI</>
                )}
              </button>
            </div>
          </div>

          {mlError && (
            <div className="mb-4 text-xs font-medium text-red-600 bg-red-50 p-2 rounded border border-red-100">
              {mlError}
            </div>
          )}

          {/* Notifikasi MOCK DATA khusus untuk Machine Learning */}
          {isMlSimulated && forecastData.length > 0 && (
            <div className="mb-4 text-xs font-medium text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-center justify-between shadow-sm">
              <span className="flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-600" /> 
                API Rate Limit Hit. AI trained on simulated historical data.
              </span>
              <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded font-bold uppercase text-[10px] tracking-wider">
                Mock Data
              </span>
            </div>
          )}

          {/* Dynamic Chart */}
          <div className="h-56 w-full mb-6 bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-center">
            {isLoadingHistory ? (
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedChartData}>
                  <XAxis dataKey="date" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value, currency), "Price"]}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="price" stroke={isChartPositive ? "#16a34a" : "#dc2626"} strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="predicted_price" stroke="#8b5cf6" strokeDasharray="5 5" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ROI Calculator */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-blue-600" />
                <h3 className="text-lg font-bold text-slate-800">Historical ROI Calculator</h3>
              </div>
              {isSimulated && (
                <div className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold uppercase tracking-wide">
                  <AlertCircle size={12} /> Simulation Mode
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">1. Select Currency</label>
                  <div className="relative">
                    <Globe size={16} className="absolute inset-y-0 left-3 my-auto text-slate-400" />
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium outline-none">
                      {CURRENCY_OPTIONS.map((opt) => <option key={opt.code} value={opt.code}>{opt.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">2. Initial Investment</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 font-bold text-sm uppercase">{currency}</span>
                    <input type="number" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="w-full pl-12 pr-4 py-2 bg-white border border-slate-300 rounded-lg font-medium text-sm outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">3. Timeframe</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute inset-y-0 left-3 my-auto text-slate-400" />
                    <select value={timeframe} onChange={(e) => {setTimeframe(Number(e.target.value)); setForecastData([]); setIsMlSimulated(false);}} className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium outline-none cursor-pointer">
                      <option value={7}>7 Days Ago</option>
                      <option value={30}>1 Month Ago</option>
                      <option value={180}>6 Months Ago</option>
                      <option value={365}>1 Year Ago</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                {isLoadingHistory ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-xs">Converting...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-xs font-medium text-slate-500 mb-1">Estimated Current Value</div>
                    <div className="text-2xl font-extrabold text-slate-900 mb-1">{formatCurrency(roiStats.currentValue, currency)}</div>
                    <div className={`text-xs font-bold mt-1 ${roiStats.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                      {roiStats.isProfit ? 'Profit' : 'Loss'}: {formatCurrency(Math.abs(roiStats.profitLoss), currency)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2 border-t border-slate-100 pt-2 font-medium">
                      Past purchase price:<br/>
                      <span className="text-slate-600 font-semibold">{formatCurrency(roiStats.pastPrice, currency)}</span>
                    </div>
                    <div className={`absolute top-0 right-0 w-1.5 h-full ${roiStats.isProfit ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export const SparklineChart = ({ data, isPositive }) => {
  // Transformasi array angka menjadi array of objects untuk Recharts
  const chartData = data.map((price) => ({ price }));
  
  // Tentukan warna garis berdasarkan tren 24 jam terakhir
  const lineColor = isPositive ? '#22c55e' : '#ef4444'; // Tailwind green-500 & red-500

  return (
    <div className="h-12 w-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          {/* Sembunyikan YAxis tetapi atur domain agar grafik tidak terpotong */}
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={lineColor} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false} // Matikan animasi untuk performa di dalam tabel
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
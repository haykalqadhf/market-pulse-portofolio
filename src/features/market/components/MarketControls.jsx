import React from 'react';
import { Search } from 'lucide-react'; // Menggunakan Lucide React dari tech stack-mu

export const MarketControls = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="relative w-full sm:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
          placeholder="Search by asset name or symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="text-sm text-slate-500">
        Live updates every 60s
      </div>
    </div>
  );
};
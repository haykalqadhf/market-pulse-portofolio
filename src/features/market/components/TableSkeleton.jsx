import React from 'react';

export const TableSkeleton = () => {
  // Membuat array 5 item untuk skeleton rows
  const skeletonRows = Array(5).fill(0);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="animate-pulse space-y-4">
        {skeletonRows.map((_, index) => (
          <div key={index} className="flex space-x-4 p-2">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
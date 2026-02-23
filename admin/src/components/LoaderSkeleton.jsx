// src/components/LoaderSkeleton.jsx
import React from "react";

const LoaderSkeleton = ({ darkMode }) => {
  const base = darkMode ? "bg-gray-700" : "bg-gray-200";
  const highlight = darkMode ? "bg-gray-600" : "bg-gray-300";

  return (
    <div className="animate-pulse space-y-6">
      
      {/* ===== Top Stats Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`rounded-xl p-5 shadow-sm ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className={`h-4 w-24 rounded ${base} mb-4`} />
            <div className={`h-8 w-20 rounded ${highlight}`} />
          </div>
        ))}
      </div>

      {/* ===== Chart Section ===== */}
      <div
        className={`rounded-xl p-6 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className={`h-5 w-40 rounded ${base} mb-6`} />

        <div className="flex flex-col lg:flex-row gap-6 items-center">
          
          {/* Pie Chart Skeleton */}
          <div className="w-full lg:w-2/3 flex justify-center">
            <div
              className={`h-60 w-60 rounded-full ${highlight}`}
            />
          </div>

          {/* Legend Skeleton */}
          <div className="w-full lg:w-1/3 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex justify-between items-center p-3 rounded-lg ${base}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${highlight}`} />
                  <div className={`h-4 w-24 rounded ${highlight}`} />
                </div>
                <div className={`h-4 w-10 rounded ${highlight}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Table/List Section ===== */}
      <div
        className={`rounded-xl p-6 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className={`h-5 w-40 rounded ${base} mb-6`} />

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-12 rounded-lg ${base}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoaderSkeleton;
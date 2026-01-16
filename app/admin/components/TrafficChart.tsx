"use client";

import React from "react";

const chartData = [
  { day: "Mon", height: "40%" },
  { day: "Tue", height: "65%" },
  { day: "Wed", height: "50%" },
  { day: "Thu", height: "85%", highlight: true },
  { day: "Fri", height: "60%" },
  { day: "Sat", height: "30%" },
  { day: "Sun", height: "45%" },
];

export default function TrafficChart() {
  return (
    <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-white tracking-tight">
          Traffic Overview
        </h3>
        <select className="bg-slate-900 border border-slate-700 text-sm text-slate-300 rounded-lg focus:ring-1 focus:ring-cyan-500 cursor-pointer outline-none px-3 py-1.5 hover:border-slate-600 transition-colors">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>
      {/* CSS Chart */}
      <div className="h-64 flex items-end justify-between gap-3 px-2 pb-2 border-b border-slate-800/50">
        {chartData.map((bar, index) => (
          <div
            key={index}
            className={`w-full rounded-t-lg transition-all duration-300 relative group cursor-pointer ${
              bar.highlight
                ? "bg-linear-to-t from-blue-600 to-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
            style={{ height: bar.height }}
          >
            <div
              className={`hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-xs px-3 py-1.5 rounded-lg shadow-xl z-10 whitespace-nowrap ${
                bar.highlight ? "text-white font-bold" : "text-slate-300"
              }`}
            >
              {bar.day} • {bar.height}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

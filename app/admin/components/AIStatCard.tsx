"use client";

import React from "react";

interface AIStatCardProps {
  title: string;
  total: number;
  icon: string;
  iconColor: string;
  iconBg: string; // Tailwind class
  breakdown: {
    label: string;
    value: number;
    color: string; // Tailwind text color
    icon?: string;
  }[];
}

export default function AIStatCard({
  title,
  total,
  icon,
  iconColor,
  iconBg,
  breakdown,
}: AIStatCardProps) {
  return (
    <div className="group bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-slate-700 transition-all duration-300 backdrop-blur-sm h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {total.toLocaleString()}
          </h3>
        </div>
        <div
          className={`p-3 rounded-xl ${iconBg} ${iconColor} group-hover:scale-110 transition-transform duration-300`}
        >
          <i className={`ph ph-${icon} text-xl`}></i>
        </div>
      </div>

      <div className="space-y-3">
        {breakdown.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-sm group/item"
          >
            <span className="text-slate-500 group-hover/item:text-slate-400 transition-colors flex items-center gap-2">
              {item.icon && <i className={`ph ph-${item.icon} text-xs`}></i>}
              {item.label}
            </span>
            <span className={`font-semibold ${item.color}`}>
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

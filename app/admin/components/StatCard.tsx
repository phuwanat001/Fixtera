import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  badge?: {
    text: string;
    color: string;
  };
}

export default function StatCard({
  title,
  value,
  icon,
  iconColor,
  iconBg,
  trend,
  badge,
}: StatCardProps) {
  return (
    <div className="group bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-slate-700 transition-all duration-300 backdrop-blur-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div
          className={`p-3 rounded-xl ${iconBg} ${iconColor} group-hover:scale-110 transition-transform duration-300`}
        >
          <i className={`ph ph-${icon} text-xl`}></i>
        </div>
      </div>
      <div className="flex items-center text-xs sm:text-sm font-medium">
        {trend && (
          <>
            <span
              className={`flex items-center gap-1 rounded-md px-2 py-0.5 ${
                trend.isPositive
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-rose-400 bg-rose-500/10"
              }`}
            >
              <i
                className={`ph ph-trend-${trend.isPositive ? "up" : "down"}`}
              ></i>
              {trend.value}
            </span>
            <span className="text-slate-500 ml-2">{trend.label}</span>
          </>
        )}
        {badge && (
          <span className={`px-2 py-0.5 rounded-md ${badge.color}`}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
}

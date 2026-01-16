"use client";

import React from "react";

const activityData = [
  {
    id: 1,
    model: "Gemini 2.0 Flash",
    action: "generated",
    target: "Next.js 15 Deep Dive",
    time: "2 mins ago",
    icon: "lightning",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    id: 2,
    model: "System",
    action: "updated source",
    target: "React Docs v19",
    time: "15 mins ago",
    icon: "arrows-clockwise",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    id: 3,
    model: "Claude 3.5 Sonnet",
    action: "regenerated",
    target: "Async Patterns in JS",
    time: "1 hour ago",
    icon: "robot",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    id: 4,
    model: "User Admin",
    action: "approved",
    target: "Taiwind v4 Guide",
    time: "2 hours ago",
    icon: "check-circle",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    id: 5,
    model: "GPT-4o",
    action: "failed",
    target: "Complex State Logic",
    time: "3 hours ago",
    icon: "warning",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
];

export default function RecentAIActivity() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl shadow-sm backdrop-blur-sm flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/30">
        <h3 className="font-bold text-white tracking-tight">
          Recent AI Activity
        </h3>
        <button className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
          View Log
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {activityData.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 hover:bg-slate-800/40 rounded-xl transition-colors group cursor-pointer"
          >
            <div
              className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 shadow-inner mt-0.5`}
            >
              <i className={`ph ph-${item.icon} text-lg`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300 leading-snug">
                <span className="font-semibold text-white">{item.model}</span>{" "}
                <span className="text-slate-500">{item.action}</span>{" "}
                <span className="text-cyan-400 font-medium group-hover:underline decoration-cyan-500/30 underline-offset-2">
                  {item.target}
                </span>
              </p>
              <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1">
                <i className="ph ph-clock"></i>
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 justify-center">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          System Active • 2 Models Idle
        </div>
      </div>
    </div>
  );
}

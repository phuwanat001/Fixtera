import React from "react";

interface TagCardProps {
  name: string;
  articleCount: number;
  icon: string;
  color: string;
  progress: number;
}

export default function TagCard({
  name,
  articleCount,
  icon,
  color,
  progress,
}: TagCardProps) {
  const colorMap: Record<
    string,
    { bg: string; text: string; border: string; progressBg: string }
  > = {
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "bg-blue-500/5 hover:border-blue-500/30",
      progressBg: "bg-blue-500",
    },
    pink: {
      bg: "bg-pink-500/10",
      text: "text-pink-400",
      border: "bg-pink-500/5 hover:border-pink-500/30",
      progressBg: "bg-pink-500",
    },
    green: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "bg-emerald-500/5 hover:border-emerald-500/30",
      progressBg: "bg-emerald-500",
    },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`group border border-slate-800/50 p-5 rounded-2xl ${colors.border} transition-all duration-300 cursor-pointer relative overflow-hidden hover:shadow-lg`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button className="text-slate-400 hover:text-white bg-slate-900/50 p-1.5 rounded-lg backdrop-blur-sm">
          <i className="ph ph-pencil text-lg"></i>
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center text-2xl shadow-inner`}
        >
          <i className={`ph ph-${icon}`}></i>
        </div>
        <div>
          <h4 className="font-bold text-white text-lg tracking-tight">
            {name}
          </h4>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {articleCount} articles
          </p>
        </div>
      </div>
      <div className="mt-5 w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
        <div
          className={`${colors.progressBg} h-full rounded-full shadow-[0_0_10px_currentColor] opacity-80`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

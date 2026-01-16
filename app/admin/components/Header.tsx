"use client";

import React from "react";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="h-20 flex items-center justify-between px-4 lg:px-8 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <i className="ph ph-list text-2xl"></i>
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900/60 rounded-xl transition-all relative group">
          <i className="ph ph-bell text-xl"></i>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950 group-hover:scale-110 transition-transform"></span>
        </button>
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-blue-500/20 text-sm font-semibold transition-all hover:scale-[1.02]">
          <i className="ph ph-plus text-lg"></i>
          <span>New Post</span>
        </button>
      </div>
    </header>
  );
}

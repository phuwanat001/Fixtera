import React, { useState, useEffect } from "react";
import { ListSkeleton } from "./ListSkeleton";

const recentBlogsData = [
  {
    emoji: "🚀",
    title: "The Future of Web Dev",
    author: "Alex",
    time: "2h ago",
    status: "Pub",
    statusColor: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  {
    emoji: "🎨",
    title: "CSS Grid vs Flexbox",
    author: "Sarah",
    time: "5h ago",
    status: "Draft",
    statusColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  {
    emoji: "⚛️",
    title: "React 19 Features",
    author: "Mike",
    time: "1d ago",
    status: "Pub",
    statusColor: "bg-green-500/10 text-green-400 border-green-500/20",
  },
];

export default function RecentBlogs() {
  const [recentBlogs, setRecentBlogs] = useState<typeof recentBlogsData>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setRecentBlogs(recentBlogsData);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return <ListSkeleton />;
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
      <h3 className="font-bold text-white mb-6 tracking-tight">Recent Blogs</h3>
      <div className="space-y-4">
        {recentBlogs.map((blog, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 ${
              index < recentBlogs.length - 1
                ? "pb-4 border-b border-slate-800/50"
                : ""
            } group cursor-pointer`}
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              {blog.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                {blog.title}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                By <span className="text-slate-400">{blog.author}</span> •{" "}
                {blog.time}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${blog.statusColor}`}
            >
              {blog.status}
            </span>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-2.5 text-sm text-center text-slate-400 hover:text-white border border-dashed border-slate-700 rounded-xl hover:bg-slate-800/50 hover:border-slate-500 transition-all font-medium">
        View All Activity
      </button>
    </div>
  );
}

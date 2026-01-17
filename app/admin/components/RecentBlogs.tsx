"use client";

import React, { useState, useEffect } from "react";
import { ListSkeleton } from "./ListSkeleton";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  status: string;
  coverImage?: string;
  author?: {
    name?: string;
    displayName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  published: "bg-green-500/10 text-green-400 border-green-500/20",
  draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  review: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const statusLabels: Record<string, string> = {
  published: "Pub",
  draft: "Draft",
  review: "Review",
};

export default function RecentBlogs() {
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs?limit=5");
        const data = await response.json();
        if (data.blogs) {
          setRecentBlogs(data.blogs);
        }
      } catch (error) {
        console.error("Error fetching recent blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Get emoji based on title keywords
  const getEmoji = (title: string): string => {
    const lower = title.toLowerCase();
    if (lower.includes("react")) return "⚛️";
    if (lower.includes("next") || lower.includes("nextjs")) return "▲";
    if (lower.includes("css") || lower.includes("tailwind")) return "🎨";
    if (lower.includes("javascript") || lower.includes("js")) return "💛";
    if (lower.includes("typescript") || lower.includes("ts")) return "💙";
    if (
      lower.includes("ai") ||
      lower.includes("gpt") ||
      lower.includes("gemini")
    )
      return "🤖";
    if (lower.includes("web")) return "🌐";
    if (lower.includes("api")) return "🔌";
    if (lower.includes("database") || lower.includes("db")) return "🗄️";
    return "📝";
  };

  // Format time ago
  const getTimeAgo = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (isLoading) {
    return <ListSkeleton />;
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
      <h3 className="font-bold text-white mb-6 tracking-tight">Recent Blogs</h3>

      {recentBlogs.length > 0 ? (
        <div className="space-y-4">
          {recentBlogs.map((blog, index) => (
            <div
              key={blog._id}
              className={`flex items-center gap-4 ${
                index < recentBlogs.length - 1
                  ? "pb-4 border-b border-slate-800/50"
                  : ""
              } group cursor-pointer`}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                {getEmoji(blog.title)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                  {blog.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  By{" "}
                  <span className="text-slate-400">
                    {blog.author?.displayName || blog.author?.name || "Admin"}
                  </span>{" "}
                  • {getTimeAgo(blog.updatedAt || blog.createdAt)}
                </p>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${
                  statusColors[blog.status] || statusColors.draft
                }`}
              >
                {statusLabels[blog.status] || blog.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          <i className="ph ph-article text-3xl mb-2 opacity-50"></i>
          <p className="text-sm">No blogs yet</p>
        </div>
      )}

      <a
        href="/admin?tab=blogs"
        className="block w-full mt-6 py-2.5 text-sm text-center text-slate-400 hover:text-white border border-dashed border-slate-700 rounded-xl hover:bg-slate-800/50 hover:border-slate-500 transition-all font-medium"
      >
        View All Blogs
      </a>
    </div>
  );
}

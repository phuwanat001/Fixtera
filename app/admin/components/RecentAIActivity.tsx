"use client";

import React, { useState, useEffect } from "react";

interface AIJob {
  _id: string;
  blogPost?: string;
  model: string;
  status: string;
  startedAt?: string;
  finishedAt?: string;
  errorMessage?: string;
}

interface Blog {
  _id: string;
  title: string;
}

interface Model {
  _id: string;
  name: string;
  provider: string;
}

const actionStyles: Record<
  string,
  { icon: string; color: string; bg: string; action: string }
> = {
  success: {
    icon: "check-circle",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    action: "generated",
  },
  failed: {
    icon: "warning",
    color: "text-red-400",
    bg: "bg-red-500/10",
    action: "failed",
  },
  pending: {
    icon: "clock",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    action: "queued",
  },
  running: {
    icon: "lightning",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    action: "generating",
  },
};

export default function RecentAIActivity() {
  const [activities, setActivities] = useState<AIJob[]>([]);
  const [blogs, setBlogs] = useState<Map<string, Blog>>(new Map());
  const [models, setModels] = useState<Map<string, Model>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch AI jobs, blogs, and models in parallel
        const [jobsRes, blogsRes, modelsRes] = await Promise.all([
          fetch("/api/ai-jobs?limit=5"),
          fetch("/api/blogs?limit=20"),
          fetch("/api/ai-models"),
        ]);

        const [jobsData, blogsData, modelsData] = await Promise.all([
          jobsRes.json(),
          blogsRes.json(),
          modelsRes.json(),
        ]);

        if (jobsData.jobs) {
          setActivities(jobsData.jobs);
        }

        // Create lookup maps
        if (blogsData.blogs) {
          const blogMap = new Map();
          blogsData.blogs.forEach((blog: Blog) => {
            blogMap.set(blog._id, blog);
          });
          setBlogs(blogMap);
        }

        if (modelsData.models) {
          const modelMap = new Map();
          modelsData.models.forEach((model: Model) => {
            modelMap.set(model._id, model);
          });
          setModels(modelMap);
        }
      } catch (error) {
        console.error("Error fetching AI activity:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Format time ago
  const getTimeAgo = (dateStr?: string): string => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getModelName = (modelId: string): string => {
    const model = models.get(modelId);
    return model?.name || "AI Model";
  };

  const getBlogTitle = (blogId?: string): string => {
    if (!blogId) return "Unknown Blog";
    const blog = blogs.get(blogId);
    return blog?.title || "Blog Post";
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl shadow-sm backdrop-blur-sm flex flex-col h-full overflow-hidden">
        <div className="p-5 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/30">
          <h3 className="font-bold text-white tracking-tight">
            Recent AI Activity
          </h3>
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-start gap-3 p-3">
              <div className="w-9 h-9 rounded-xl bg-slate-700"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl shadow-sm backdrop-blur-sm flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/30">
        <h3 className="font-bold text-white tracking-tight">
          Recent AI Activity
        </h3>
        <a
          href="/admin?tab=aijobs"
          className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View Log
        </a>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {activities.length > 0 ? (
          activities.map((item) => {
            const style = actionStyles[item.status] || actionStyles.pending;
            return (
              <div
                key={item._id}
                className="flex items-start gap-3 p-3 hover:bg-slate-800/40 rounded-xl transition-colors group cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-xl ${style.bg} ${style.color} flex items-center justify-center shrink-0 shadow-inner mt-0.5`}
                >
                  <i className={`ph ph-${style.icon} text-lg`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 leading-snug">
                    <span className="font-semibold text-white">
                      {getModelName(item.model)}
                    </span>{" "}
                    <span className="text-slate-500">{style.action}</span>{" "}
                    <span className="text-cyan-400 font-medium group-hover:underline decoration-cyan-500/30 underline-offset-2">
                      {getBlogTitle(item.blogPost)}
                    </span>
                  </p>
                  <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1">
                    <i className="ph ph-clock"></i>
                    {getTimeAgo(item.finishedAt || item.startedAt)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-slate-500">
            <i className="ph ph-robot text-3xl mb-2 opacity-50"></i>
            <p className="text-sm">No AI activity yet</p>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 justify-center">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          System Active • {models.size} Models Available
        </div>
      </div>
    </div>
  );
}

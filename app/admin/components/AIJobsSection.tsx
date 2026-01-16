"use client";

import React, { useState } from "react";

// Import mock data
import jobsData from "@/mockdata/admin/aiJobs.json";
import modelsData from "@/mockdata/admin/aiModels.json";
import blogPostsData from "@/mockdata/admin/blogPosts.json";

interface AIJob {
  _id: string;
  blogPost: string;
  blogVersion: string | null;
  model: string;
  modelConfig: string;
  status: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  durationMs: number | null;
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
}

const statusStyles: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  failed: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  running: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function AIJobsSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [jobs] = useState<AIJob[]>(jobsData);

  const filteredJobs =
    activeFilter === "all"
      ? jobs
      : jobs.filter((job) => job.status === activeFilter);

  const getModelName = (modelId: string) => {
    const model = modelsData.find((m) => m._id === modelId);
    return model?.displayName || modelId;
  };

  const getBlogTitle = (blogId: string) => {
    const blog = blogPostsData.find((b) => b._id === blogId);
    return blog?.title || blogId;
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return "-";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            AI Jobs Monitor
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track AI generation jobs and their status
          </p>
        </div>
        <div className="relative grid grid-cols-4 gap-1 p-1 bg-slate-900/50 rounded-xl border border-slate-800/50 backdrop-blur-sm isolate w-full sm:w-[400px]">
          {/* Sliding Indicator */}
          <div
            className="absolute top-1 bottom-1 left-1 w-[calc(25%-0.3rem)] bg-slate-800 border border-slate-700 rounded-lg shadow-sm transition-all duration-300 ease-out z-0"
            style={{
              transform: `translateX(${
                ["all", "success", "failed", "pending"].indexOf(activeFilter) *
                100
              }%)`,
              left: `calc(0.25rem + ${
                ["all", "success", "failed", "pending"].indexOf(activeFilter) *
                0.25
              }rem)`, // Adjust for gap
            }}
          ></div>
          {["all", "success", "failed", "pending"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`relative z-10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors duration-200 ${
                activeFilter === filter
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Total Jobs
          </p>
          <p className="text-3xl font-bold text-white tracking-tight">
            {jobs.length}
          </p>
        </div>
        <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Success
          </p>
          <p className="text-3xl font-bold text-emerald-400 tracking-tight">
            {jobs.filter((j) => j.status === "success").length}
          </p>
        </div>
        <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Failed
          </p>
          <p className="text-3xl font-bold text-rose-400 tracking-tight">
            {jobs.filter((j) => j.status === "failed").length}
          </p>
        </div>
        <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Total Tokens
          </p>
          <p className="text-3xl font-bold text-cyan-400 tracking-tight">
            {jobs.reduce((acc, j) => acc + j.totalTokens, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/50 border-b border-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Job ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Blog Post
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tokens
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Started
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr
                    key={job._id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                        {job._id.slice(-6)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-white line-clamp-1 max-w-[200px] group-hover:text-cyan-400 transition-colors">
                        {getBlogTitle(job.blogPost)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300 font-medium bg-slate-800/50 px-2 py-1 rounded">
                        {getModelName(job.model)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="text-white font-medium">
                          {job.totalTokens.toLocaleString()}
                        </span>
                        <span className="text-slate-500 text-xs ml-1 block">
                          I: {job.inputTokens} • O: {job.outputTokens}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                      {formatDuration(job.durationMs)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full border ${
                          statusStyles[job.status] || statusStyles.pending
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {formatDate(job.startedAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                        <i className="ph ph-magnifying-glass text-xl"></i>
                      </div>
                      <p>No {activeFilter} jobs found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

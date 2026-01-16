"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { TableSkeleton } from "./TableSkeleton";

interface BlogPost {
  _id: string;
  title: string;
  status: string;
  source?: string;
  tags: string[];
  viewCount: number;
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
}

interface BlogsTableProps {
  searchQuery?: string;
}

export default function BlogsTable({ searchQuery = "" }: BlogsTableProps) {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      const data = await response.json();
      if (data.blogs) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    const blog = blogs.find((b) => b._id === id);
    try {
      const response = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (data.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        toast.success(`Blog "${blog?.title}" deleted`);
      } else {
        toast.error(data.error || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "draft":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "review":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "pending_review":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-400";
      case "draft":
        return "bg-amber-400";
      case "review":
        return "bg-blue-400";
      case "pending_review":
        return "bg-purple-400";
      default:
        return "bg-slate-400";
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase text-slate-500 tracking-wider font-bold">
              <th className="p-5 font-bold">Article Details</th>
              <th className="p-5 font-bold hidden sm:table-cell">Status</th>
              <th className="p-5 font-bold hidden md:table-cell">Tags</th>
              <th className="p-5 font-bold hidden lg:table-cell">Views</th>
              <th className="p-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-sm">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="group hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl bg-linear-to-tr from-blue-600 to-cyan-500 shrink-0 shadow-lg shadow-blue-500/10`}
                      ></div>
                      <div>
                        <div className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors cursor-pointer line-clamp-1 tracking-tight">
                          {blog.title}
                        </div>
                        <div className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-2">
                          <i className="ph ph-calendar"></i>
                          {formatDate(blog.publishedAt || blog.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 hidden sm:table-cell">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(
                        blog.status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${getStatusDot(
                          blog.status
                        )}`}
                      ></span>
                      <span className="capitalize">{blog.status}</span>
                    </span>
                  </td>
                  <td className="p-5 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {blog.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {tag.replace("tag_", "")}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-5 hidden lg:table-cell text-slate-300 font-medium">
                    {blog.viewCount.toLocaleString()}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          router.push(`/admin/blogs/${blog._id}/edit`)
                        }
                        className="p-2 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg text-slate-400 transition-colors"
                      >
                        <i className="ph ph-pencil-simple text-lg"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="p-2 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg text-slate-400 transition-colors"
                      >
                        <i className="ph ph-trash text-lg"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                      <i className="ph ph-magnifying-glass text-xl"></i>
                    </div>
                    <p>No blogs found matching "{searchQuery}"</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-900/30">
        <span className="text-xs font-medium text-slate-500">
          Showing {filteredBlogs.length} of {blogs.length}
        </span>
        <div className="flex gap-2">
          <button
            disabled
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
          >
            <i className="ph ph-caret-left"></i>
          </button>
          <button
            disabled
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
          >
            <i className="ph ph-caret-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CardListSkeleton } from "./CardListSkeleton";

interface Review {
  _id: string;
  blogVersion: string;
  reviewer: string;
  status: string;
  comment: string | null;
  checklist: {
    technicalAccuracy: boolean | null;
    codeExamples: boolean | null;
    grammarSpelling: boolean | null;
    formatting: boolean | null;
  };
  createdAt: string;
}

const statusStyles: Record<string, { bg: string; icon: string }> = {
  approved: { bg: "bg-green-500/20 text-green-400", icon: "check-circle" },
  revision_requested: {
    bg: "bg-orange-500/20 text-orange-400",
    icon: "warning",
  },
  pending: { bg: "bg-blue-500/20 text-blue-400", icon: "clock" },
  rejected: { bg: "bg-red-500/20 text-red-400", icon: "x-circle" },
};

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Fetch reviews and related data
  const fetchData = async () => {
    try {
      const [reviewsRes, blogsRes, usersRes] = await Promise.all([
        fetch("/api/reviews"),
        fetch("/api/blogs?limit=100"),
        fetch("/api/users"),
      ]);

      const reviewsData = await reviewsRes.json();
      const blogsData = await blogsRes.json();
      const usersData = await usersRes.json();

      if (reviewsData.success) {
        setReviews(reviewsData.reviews);
      }
      if (blogsData.blogs) {
        setBlogs(blogsData.blogs);
      }
      if (usersData.success) {
        setUsers(usersData.users);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getBlogTitle = (versionId: string) => {
    // Try to find by blogVersion or blogPost id
    const blog = blogs.find((b) => b._id === versionId);
    return blog?.title || versionId;
  };

  const getReviewerName = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    return user?.displayName || userId;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const newStatus = action === "approve" ? "approved" : "rejected";

    try {
      const response = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setReviews((prev) =>
          prev.map((review) =>
            review._id === id ? { ...review, status: newStatus } : review
          )
        );
        toast.success(
          `Review ${action === "approve" ? "approved" : "rejected"}!`
        );
      } else {
        toast.error(data.error || "Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Content Reviews</h2>
          <p className="text-sm text-slate-400 mt-1">
            Human-in-the-loop review management
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 text-xs rounded-full bg-blue-500/20 text-blue-400">
            {pendingCount} Pending
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <CardListSkeleton count={3} />
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <i className="ph ph-check-circle text-3xl text-slate-500"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              No Reviews Yet
            </h3>
            <p className="text-sm text-slate-400">
              Reviews will appear here when content is submitted for approval
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wide rounded-full border flex items-center gap-1.5 ${
                        statusStyles[review.status]?.bg ||
                        statusStyles.pending.bg
                      }`}
                    >
                      <i
                        className={`ph ph-${
                          statusStyles[review.status]?.icon ||
                          statusStyles.pending.icon
                        }`}
                      ></i>
                      {review.status.replace("_", " ")}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {review._id.slice(-8)}
                    </span>
                    <span className="text-xs text-slate-500">
                      • {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Review for:{" "}
                      <span className="text-cyan-400">
                        {getBlogTitle(review.blogVersion)}
                      </span>
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Reviewed by{" "}
                      <span className="text-slate-300 font-medium">
                        {getReviewerName(review.reviewer)}
                      </span>
                    </p>
                    {review.comment && (
                      <div className="mt-3 bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
                        <p className="text-sm text-slate-300 italic">
                          "{review.comment}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Checklist Display */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Review Checklist
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(review.checklist || {}).map(
                        ([key, value]) => (
                          <span
                            key={key}
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1.5 ${
                              value === true
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : value === false
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-slate-700/30 text-slate-500 border-slate-700/50"
                            }`}
                          >
                            <i
                              className={`ph ph-${
                                value === true
                                  ? "check"
                                  : value === false
                                  ? "x"
                                  : "minus"
                              }`}
                            ></i>
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {review.status === "pending" && (
                  <div className="flex sm:flex-col gap-2 min-w-[140px]">
                    <button
                      onClick={() => handleAction(review._id, "approve")}
                      className="flex-1 px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/30 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <i className="ph ph-check text-lg"></i>
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(review._id, "reject")}
                      className="flex-1 px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <i className="ph ph-x text-lg"></i>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

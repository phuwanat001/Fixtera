"use client";

import React, { useState, useEffect } from "react";

interface BlogInteractionsProps {
  initialLikes: number;
  initialViews: number;
}

export default function BlogInteractions({
  initialLikes,
  initialViews,
}: BlogInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [views, setViews] = useState(initialViews);

  // Mock view increment on mount
  useEffect(() => {
    // In a real app, this would be an API call
    const timer = setTimeout(() => {
      setViews((prev) => prev + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  return (
    <div className="flex items-center gap-6">
      {/* Views */}
      <div className="flex items-center gap-2 text-slate-400">
        <i className="far fa-eye text-slate-500"></i>
        <span>{views.toLocaleString()} views</span>
      </div>

      {/* Likes */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 transition-all group ${
          isLiked ? "text-pink-500" : "text-slate-400 hover:text-pink-500"
        }`}
      >
        <div
          className={`p-2 rounded-full transition-colors ${
            isLiked
              ? "bg-pink-500/10"
              : "bg-slate-800/50 group-hover:bg-pink-500/10"
          }`}
        >
          <i className={`fas fa-heart ${isLiked ? "animate-pulse" : ""}`} />
        </div>
        <span>{likes.toLocaleString()}</span>
      </button>
    </div>
  );
}

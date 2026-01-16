"use client";

import React, { useState } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [isCopied, setIsCopied] = useState(false);

  // In a real app, you might want to use the full domain from env vars
  // For now, we'll assume we are on the client and can use window.location.origin
  const getUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://fixtera.com/blog/${slug}`;
  };

  const handleShare = (platform: "twitter" | "facebook" | "linkedin") => {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(title);

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleShare("twitter")}
        className="p-3 rounded-full bg-slate-800/50 text-slate-400 hover:text-[#1DA1F2] hover:bg-slate-800 transition-all"
        aria-label="Share on Twitter"
      >
        <i className="fab fa-twitter" />
      </button>
      <button
        onClick={() => handleShare("linkedin")}
        className="p-3 rounded-full bg-slate-800/50 text-slate-400 hover:text-[#0A66C2] hover:bg-slate-800 transition-all"
        aria-label="Share on LinkedIn"
      >
        <i className="fab fa-linkedin" />
      </button>
      <button
        onClick={() => handleShare("facebook")}
        className="p-3 rounded-full bg-slate-800/50 text-slate-400 hover:text-[#1877F2] hover:bg-slate-800 transition-all"
        aria-label="Share on Facebook"
      >
        <i className="fab fa-facebook" />
      </button>
      <button
        onClick={handleCopyLink}
        className="p-3 rounded-full bg-slate-800/50 text-slate-400 hover:text-green-400 hover:bg-slate-800 transition-all relative group"
        aria-label="Copy Link"
      >
        {isCopied ? (
          <i className="fas fa-check" />
        ) : (
          <i className="fas fa-link" />
        )}

        {/* Tooltip */}
        <span
          className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 transition-opacity whitespace-nowrap ${
            isCopied ? "opacity-100" : "group-hover:opacity-100"
          }`}
        >
          {isCopied ? "Copied!" : "Copy Link"}
        </span>
      </button>
    </div>
  );
}

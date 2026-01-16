"use client";

import React from "react";
import Link from "next/link";
import ImageWithFallback from "./ImageWithFallback";

interface BlogCardProps {
  slug: string;
  image: string;
  category: string;
  categoryColor: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
}

export default function BlogCard({
  slug,
  image,
  category,
  categoryColor,
  date,
  readTime,
  title,
  excerpt,
}: BlogCardProps) {
  // Map category to color if not provided properly
  const getCategoryColor = () => {
    if (categoryColor && categoryColor.startsWith("#")) return categoryColor;

    const colors: Record<string, string> = {
      AI: "#06b6d4",
      JavaScript: "#eab308",
      React: "#3b82f6",
      Debug: "#22c55e",
      DevOps: "#a855f7",
      TypeScript: "#3178c6",
    };
    // Try to extract color or use default cyan
    return colors[category] || "#06b6d4";
  };

  const accentColor = getCategoryColor();

  return (
    <Link href={`/blog/${slug}`}>
      <article
        className="group relative glass rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col h-full cursor-pointer"
        style={{
          borderColor: `${accentColor}20`,
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget as HTMLElement;
          target.style.borderColor = `${accentColor}50`;
          target.style.boxShadow = `0 20px 40px ${accentColor}15`;
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget as HTMLElement;
          target.style.borderColor = `${accentColor}20`;
          target.style.boxShadow = "none";
        }}
      >
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>

          {/* Category Badge */}
          <div
            className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5"
            style={{
              background: `${accentColor}20`,
              border: `1px solid ${accentColor}40`,
              color: accentColor,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: accentColor }}
            ></span>
            {category}
          </div>

          {/* Read time badge */}
          <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-black/50 backdrop-blur text-[10px] text-slate-400 font-mono">
            {readTime}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-mono">
            <i className="far fa-calendar text-cyan-500/50"></i>
            <span>{date}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-3 group-hover:text-gradient-bold transition-all leading-snug">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-slate-400 text-sm mb-5 line-clamp-2 flex-1 leading-relaxed">
            {excerpt}
          </p>

          {/* Read Link */}
          <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
            <span className="inline-flex items-center text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
              <code className="text-xs text-slate-500 mr-2">$</code>
              read --more
            </span>
            <i
              className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"
              style={{ color: accentColor }}
            ></i>
          </div>
        </div>

        {/* Corner decoration */}
        <div
          className="absolute bottom-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          style={{
            background: `radial-gradient(circle at bottom right, ${accentColor}10, transparent 70%)`,
          }}
        ></div>
      </article>
    </Link>
  );
}

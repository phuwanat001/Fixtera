"use client";

import React from "react";
import Link from "next/link";
import ImageWithFallback from "./ImageWithFallback";

interface Tag {
  name: string;
  slug: string;
  color?: string;
}

interface BlogCardProps {
  slug: string;
  image: string;
  tags?: Tag[]; // Now accepts array of tags
  category?: string; // Kept for backward compatibility
  categoryColor?: string;
  date: string;
  views?: number; // View count
  readTime?: string; // Kept for backward compatibility
  title: string;
  excerpt: string;
}

export default function BlogCard({
  slug,
  image,
  tags = [],
  category,
  categoryColor,
  date,
  views = 0,
  readTime,
  title,
  excerpt,
}: BlogCardProps) {
  // Use tags array if provided, otherwise fallback to single category
  const displayTags: Tag[] =
    tags.length > 0
      ? tags
      : category
      ? [
          {
            name: category,
            slug: category.toLowerCase(),
            color:
              categoryColor?.replace("text-[", "").replace("]", "") ||
              "#06b6d4",
          },
        ]
      : [];

  // Get accent color from first tag
  const accentColor = displayTags[0]?.color || "#06b6d4";

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

          {/* Tags Badges - Show all tags */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            {displayTags.map((tag, index) => {
              const tagColor = tag.color || "#06b6d4";
              return (
                <div
                  key={tag.slug || index}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5"
                  style={{
                    background: `${tagColor}20`,
                    border: `1px solid ${tagColor}40`,
                    color: tagColor,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: tagColor }}
                  ></span>
                  {tag.name}
                </div>
              );
            })}
          </div>

          {/* Views badge */}
          <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-black/50 backdrop-blur text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <i className="fas fa-eye"></i>
            {views.toLocaleString()} views
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

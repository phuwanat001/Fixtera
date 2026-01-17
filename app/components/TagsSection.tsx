"use client";

import React, { useState, useEffect } from "react";

interface Tag {
  _id: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
  articleCount?: number;
}

// Helper to generate glow color from hex
const getGlowColor = (hex: string): string => {
  // Convert hex to rgba with opacity
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.15)`;
};

// Default color if none set
const DEFAULT_COLOR = "#06b6d4";

export default function TagsSection() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tags from API
        const tagsResponse = await fetch("/api/tags");
        const tagsData = await tagsResponse.json();

        if (tagsData.success && tagsData.tags) {
          setTags(tagsData.tags);

          // Calculate total articles from tags data
          const total = tagsData.tags.reduce(
            (sum: number, tag: Tag) => sum + (tag.articleCount || 0),
            0
          );
          setTotalArticles(total);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section
      id="tags"
      className="py-16 border-y border-slate-800/30 relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] rounded-full -z-10"
        style={{ background: "rgba(6, 182, 212, 0.05)", filter: "blur(100px)" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="inline-flex items-center gap-2 text-sm font-mono text-cyan-400 uppercase tracking-widest">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-400"></span>
            Explore Topics
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-400"></span>
          </p>
        </div>

        {/* Tags Grid */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {isLoading ? (
            // Loading skeleton
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 rounded-xl glass animate-pulse"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-700"></div>
                <div className="w-24 h-4 bg-slate-700 rounded"></div>
              </div>
            ))
          ) : tags.length > 0 ? (
            tags.map((tag) => {
              const color = tag.color || DEFAULT_COLOR;
              const bgGlow = getGlowColor(color);

              return (
                <a
                  key={tag._id}
                  href={`/blog?tag=${tag.slug}`}
                  className="group relative flex items-center gap-3 px-5 py-3 rounded-xl glass transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderColor: `${color}20`,
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLElement;
                    target.style.borderColor = `${color}60`;
                    target.style.boxShadow = `0 0 30px ${bgGlow}`;
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLElement;
                    target.style.borderColor = `${color}20`;
                    target.style.boxShadow = "none";
                  }}
                >
                  {/* Icon - using tag color */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: bgGlow }}
                  >
                    <i
                      className="fas fa-tag text-lg"
                      style={{ color: color }}
                    ></i>
                  </div>

                  {/* Text */}
                  <span className="text-slate-300 group-hover:text-white font-medium transition-colors">
                    {tag.name}
                  </span>

                  {/* Article count badge */}
                  {tag.articleCount !== undefined && tag.articleCount > 0 && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: bgGlow, color: color }}
                    >
                      {tag.articleCount}
                    </span>
                  )}

                  {/* Arrow on hover */}
                  <i
                    className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-70 transition-opacity ml-1"
                    style={{ color: color }}
                  ></i>
                </a>
              );
            })
          ) : (
            // Empty state
            <p className="text-slate-500 text-center py-8">
              No topics available yet
            </p>
          )}
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 flex justify-center gap-8 md:gap-16">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-white">
              {isLoading ? (
                <span className="inline-block w-12 h-8 bg-slate-700 rounded animate-pulse"></span>
              ) : totalArticles > 0 ? (
                `${totalArticles}+`
              ) : (
                "0"
              )}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
              Articles
            </p>
          </div>
          <div className="w-px bg-slate-800"></div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-gradient-bold">
              {isLoading ? (
                <span className="inline-block w-8 h-8 bg-slate-700 rounded animate-pulse"></span>
              ) : (
                tags.length
              )}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
              Categories
            </p>
          </div>
          <div className="w-px bg-slate-800"></div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-white">∞</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
              Knowledge
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

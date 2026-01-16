"use client";

import React from "react";

const tags = [
  {
    name: "Artificial Intelligence",
    icon: "fa-robot",
    color: "#06b6d4",
    bgGlow: "rgba(6, 182, 212, 0.15)",
  },
  {
    name: "JavaScript",
    icon: "fa-js",
    iconType: "fab",
    color: "#eab308",
    bgGlow: "rgba(234, 179, 8, 0.15)",
  },
  {
    name: "React Ecosystem",
    icon: "fa-react",
    iconType: "fab",
    color: "#3b82f6",
    bgGlow: "rgba(59, 130, 246, 0.15)",
  },
  {
    name: "Fix & Debug",
    icon: "fa-bug",
    color: "#22c55e",
    bgGlow: "rgba(34, 197, 94, 0.15)",
  },
  {
    name: "Backend & DevOps",
    icon: "fa-server",
    color: "#a855f7",
    bgGlow: "rgba(168, 85, 247, 0.15)",
  },
  {
    name: "TypeScript",
    icon: "fa-code",
    color: "#3178c6",
    bgGlow: "rgba(49, 120, 198, 0.15)",
  },
];

export default function TagsSection() {
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
          {tags.map((tag) => (
            <a
              key={tag.name}
              href="#"
              className="group relative flex items-center gap-3 px-5 py-3 rounded-xl glass transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: `${tag.color}20`,
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.borderColor = `${tag.color}60`;
                target.style.boxShadow = `0 0 30px ${tag.bgGlow}`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.borderColor = `${tag.color}20`;
                target.style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: tag.bgGlow }}
              >
                <i
                  className={`${tag.iconType || "fas"} ${tag.icon} text-lg`}
                  style={{ color: tag.color }}
                ></i>
              </div>

              {/* Text */}
              <span className="text-slate-300 group-hover:text-white font-medium transition-colors">
                {tag.name}
              </span>

              {/* Arrow on hover */}
              <i
                className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-70 transition-opacity ml-1"
                style={{ color: tag.color }}
              ></i>
            </a>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 flex justify-center gap-8 md:gap-16">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-white">50+</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
              Articles
            </p>
          </div>
          <div className="w-px bg-slate-800"></div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-gradient-bold">
              6
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

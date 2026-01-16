"use client";

import React, { useState, useMemo, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogCard from "../components/BlogCard";

export default function BlogArchivePage() {
  const [allBlogs, setAllBlogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blogs from API
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch("/api/blogs?status=published");
        const data = await response.json();
        if (data.blogs) {
          // Calculate reading time if not present
          const processedBlogs = data.blogs.map((blog: any) => ({
            ...blog,
            readingTime:
              blog.readingTime ||
              Math.ceil((blog.content?.length || 0) / 1000) ||
              5, // Rough estimate
            tags: Array.isArray(blog.tags)
              ? blog.tags.map((t: any) =>
                  typeof t === "string"
                    ? { name: t, slug: t, color: "#4F46E5" }
                    : t
                )
              : [],
          }));
          setAllBlogs(processedBlogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Map();
    allBlogs.forEach((blog) => {
      blog.tags.forEach((tag: any) => {
        if (!tags.has(tag.slug)) {
          tags.set(tag.slug, tag);
        }
      });
    });
    return Array.from(tags.values());
  }, [allBlogs]);

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag
        ? blog.tags.some((tag: any) => tag.slug === selectedTag)
        : true;
      return matchesSearch && matchesTag;
    });
  }, [allBlogs, searchQuery, selectedTag]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 pt-24 pb-20">
        {/* Header Section */}
        <div className="bg-[#020617] py-12 border-b border-slate-800/50 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
              Our <span className="text-brand-blue">Blog</span>
            </h1>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10 text-lg">
              Explore the latest insights, tutorials, and trends in web
              development, AI, and DevOps.
            </p>

            {/* Search & Filter Controls */}
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Search Bar */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-brand-blue to-brand-cyan rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative">
                  <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-full focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all shadow-xl placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Tags Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === null
                      ? "bg-white text-slate-950 shadow-lg shadow-white/10 scale-105"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  All Posts
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag.slug}
                    onClick={() =>
                      setSelectedTag(selectedTag === tag.slug ? null : tag.slug)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      selectedTag === tag.slug
                        ? "text-white shadow-lg scale-105"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white"
                    }`}
                    style={
                      selectedTag === tag.slug
                        ? {
                            backgroundColor: `${tag.color}20`,
                            borderColor: tag.color,
                            color: tag.color === "#000000" ? "#fff" : tag.color, // Handle black color override if needed, though we fixed json
                          }
                        : {}
                    }
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan"></div>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <BlogCard
                  key={blog.slug}
                  slug={blog.slug}
                  image={blog.coverImage}
                  category={blog.tags[0]?.name || "Tech"}
                  categoryColor={`text-[${blog.tags[0]?.color || "#4F46E5"}]`}
                  date={new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  readTime={`${blog.readingTime} min read`}
                  title={blog.title}
                  excerpt={blog.summary}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search text-2xl text-slate-500"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No articles found
              </h3>
              <p className="text-slate-400">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag(null);
                }}
                className="mt-6 text-brand-cyan hover:text-brand-blue font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

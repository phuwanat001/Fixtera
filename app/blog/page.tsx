"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogCard from "../components/BlogCard";

interface Tag {
  _id?: string;
  name: string;
  slug: string;
  color?: string;
}

interface Blog {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  coverImage?: string;
  tags: (string | Tag)[];
  publishedAt: string;
  readingTime?: number;
  views?: number;
}

function BlogContent() {
  const searchParams = useSearchParams();
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Read tag from URL on mount
  useEffect(() => {
    const tagFromUrl = searchParams.get("tag");
    if (tagFromUrl) {
      setSelectedTag(tagFromUrl);
    }
  }, [searchParams]);

  // Fetch blogs and tags from API
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch both blogs and tags in parallel
        const [blogsResponse, tagsResponse] = await Promise.all([
          fetch("/api/blogs?status=published"),
          fetch("/api/tags"),
        ]);

        const blogsData = await blogsResponse.json();
        const tagsData = await tagsResponse.json();

        if (blogsData.blogs) {
          // Process blogs
          const processedBlogs = blogsData.blogs.map((blog: any) => ({
            ...blog,
            readingTime:
              blog.readingTime ||
              Math.max(
                1,
                Math.ceil((blog.content?.split(/\s+/).length || 0) / 200)
              ) ||
              5, // ~200 words per minute
          }));
          setAllBlogs(processedBlogs);
        }

        if (tagsData.success && tagsData.tags) {
          setAllTags(tagsData.tags);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Helper function to check if blog has a specific tag
  const blogHasTag = (blog: Blog, tagSlug: string): boolean => {
    if (!blog.tags || !Array.isArray(blog.tags)) return false;

    return blog.tags.some((tag) => {
      if (typeof tag === "string") {
        // Tag is stored as string - check both as slug and name
        const normalizedTag = tag.toLowerCase().replace(/\s+/g, "-");
        const normalizedSlug = tagSlug.toLowerCase();
        return (
          normalizedTag === normalizedSlug ||
          tag.toLowerCase() === normalizedSlug ||
          tag.toLowerCase() === tagSlug.toLowerCase().replace(/-/g, " ")
        );
      } else if (tag && typeof tag === "object") {
        // Tag is stored as object
        return (
          tag.slug === tagSlug ||
          tag.name?.toLowerCase() === tagSlug.toLowerCase()
        );
      }
      return false;
    });
  };

  // Get tag color from allTags
  const getTagColor = (tagSlugOrName: string | Tag): string => {
    if (typeof tagSlugOrName === "object" && tagSlugOrName.color) {
      return tagSlugOrName.color;
    }

    const slug =
      typeof tagSlugOrName === "string"
        ? tagSlugOrName.toLowerCase().replace(/\s+/g, "-")
        : tagSlugOrName.slug;

    const foundTag = allTags.find(
      (t) => t.slug === slug || t.name?.toLowerCase() === slug
    );
    return foundTag?.color || "#4F46E5";
  };

  // Get tag name from slug
  const getTagName = (blog: Blog): string => {
    if (!blog.tags || blog.tags.length === 0) return "Tech";

    const firstTag = blog.tags[0];
    if (typeof firstTag === "string") {
      // Find the proper name from allTags
      const foundTag = allTags.find(
        (t) =>
          t.slug === firstTag.toLowerCase().replace(/\s+/g, "-") ||
          t.name.toLowerCase() === firstTag.toLowerCase()
      );
      return foundTag?.name || firstTag;
    } else if (firstTag && typeof firstTag === "object") {
      return firstTag.name || "Tech";
    }
    return "Tech";
  };

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.summary?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = selectedTag ? blogHasTag(blog, selectedTag) : true;

      return matchesSearch && matchesTag;
    });
  }, [allBlogs, searchQuery, selectedTag, allTags]);

  // Handle tag click - update URL
  const handleTagClick = (tagSlug: string | null) => {
    setSelectedTag(tagSlug);

    // Update URL without page reload
    const url = new URL(window.location.href);
    if (tagSlug) {
      url.searchParams.set("tag", tagSlug);
    } else {
      url.searchParams.delete("tag");
    }
    window.history.pushState({}, "", url.toString());
  };

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
                  onClick={() => handleTagClick(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === null
                      ? "bg-white text-slate-950 shadow-lg shadow-white/10 scale-105"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  All Posts
                </button>
                {allTags.map((tag) => {
                  const isSelected = selectedTag === tag.slug;
                  const color = tag.color || "#4F46E5";

                  return (
                    <button
                      key={tag.slug}
                      onClick={() =>
                        handleTagClick(isSelected ? null : tag.slug)
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        isSelected
                          ? "text-white shadow-lg scale-105"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white"
                      }`}
                      style={
                        isSelected
                          ? {
                              backgroundColor: `${color}20`,
                              borderColor: color,
                              color: color,
                            }
                          : {}
                      }
                    >
                      {tag.name}
                    </button>
                  );
                })}
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
              {filteredBlogs.map((blog) => {
                // Convert blog tags to proper format with colors
                const blogTags = (blog.tags || []).map((tag) => {
                  if (typeof tag === "string") {
                    const foundTag = allTags.find(
                      (t) =>
                        t.slug === tag.toLowerCase().replace(/\s+/g, "-") ||
                        t.name.toLowerCase() === tag.toLowerCase()
                    );
                    return {
                      name: foundTag?.name || tag,
                      slug:
                        foundTag?.slug ||
                        tag.toLowerCase().replace(/\s+/g, "-"),
                      color: foundTag?.color || "#4F46E5",
                    };
                  }
                  // Already an object, just ensure color
                  const foundTag = allTags.find((t) => t.slug === tag.slug);
                  return {
                    ...tag,
                    color: tag.color || foundTag?.color || "#4F46E5",
                  };
                });

                return (
                  <BlogCard
                    key={blog.slug}
                    slug={blog.slug}
                    image={blog.coverImage || ""}
                    tags={blogTags}
                    date={new Date(blog.publishedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      }
                    )}
                    views={blog.views || 0}
                    title={blog.title}
                    excerpt={blog.summary}
                  />
                );
              })}
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
                {selectedTag
                  ? `No articles found with tag "${selectedTag}"`
                  : "Try adjusting your search or filter to find what you're looking for."}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  handleTagClick(null);
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

export default function BlogArchivePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan"></div>
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  );
}

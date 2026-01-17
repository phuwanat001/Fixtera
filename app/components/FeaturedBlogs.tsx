import React from "react";
import BlogCard from "./BlogCard";
import { connectToDatabase } from "@/app/lib/mongodb";

interface Tag {
  _id?: string;
  name: string;
  slug: string;
  color?: string;
}

export default async function FeaturedBlogs() {
  let blogs: any[] = [];
  let tagsMap: Map<string, Tag> = new Map();

  try {
    const { db } = await connectToDatabase();

    // Fetch blogs
    blogs = await db
      .collection("blogs")
      .find({ status: "published" })
      .sort({ publishedAt: -1 })
      .limit(6) // Fetch latest 6
      .toArray();

    // Fetch all tags to get their colors
    const allTags = await db.collection("tags").find({}).toArray();
    allTags.forEach((tag: any) => {
      tagsMap.set(tag.slug, {
        _id: tag._id?.toString(),
        name: tag.name,
        slug: tag.slug,
        color: tag.color || "#4F46E5",
      });
      // Also map by name for flexibility
      tagsMap.set(tag.name.toLowerCase(), {
        _id: tag._id?.toString(),
        name: tag.name,
        slug: tag.slug,
        color: tag.color || "#4F46E5",
      });
    });
  } catch (error) {
    console.error("Failed to fetch blogs for landing page:", error);
  }

  // Helper to convert blog's tags to proper format with colors
  const formatBlogTags = (blogTags: any[]): Tag[] => {
    if (!blogTags || !Array.isArray(blogTags)) return [];

    return blogTags.map((tag) => {
      if (typeof tag === "string") {
        // Look up tag from our map
        const normalizedSlug = tag.toLowerCase().replace(/\s+/g, "-");
        const foundTag =
          tagsMap.get(normalizedSlug) || tagsMap.get(tag.toLowerCase());
        return {
          name: foundTag?.name || tag,
          slug: foundTag?.slug || normalizedSlug,
          color: foundTag?.color || "#4F46E5",
        };
      } else if (tag && typeof tag === "object") {
        // Already an object
        const foundTag = tagsMap.get(tag.slug);
        return {
          name: tag.name || "Unknown",
          slug: tag.slug || "unknown",
          color: tag.color || foundTag?.color || "#4F46E5",
        };
      }
      return { name: "Unknown", slug: "unknown", color: "#4F46E5" };
    });
  };

  return (
    <section id="blogs" className="py-20 md:py-28 bg-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Featured Articles
            </h2>
            <p className="text-slate-400">
              Hand-picked guides to solve your toughest tech headaches.
            </p>
          </div>
          <a
            href="/blog"
            className="text-blue-500 hover:text-cyan-400 font-medium flex items-center gap-2 transition-colors"
          >
            View all posts <i className="fas fa-arrow-right"></i>
          </a>
        </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => {
              // Format all tags with proper colors
              const blogTags = formatBlogTags(blog.tags || []);

              return (
                <BlogCard
                  key={blog._id.toString()}
                  slug={blog.slug}
                  image={
                    blog.coverImage ||
                    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
                  }
                  tags={blogTags}
                  date={new Date(
                    blog.publishedAt || blog.createdAt
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  views={blog.views || 0}
                  title={blog.title}
                  excerpt={blog.summary || "No summary available."}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
            <i className="ph ph-article text-4xl text-slate-600 mb-4"></i>
            <p className="text-slate-400">
              No published articles yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

import React from "react";
import BlogCard from "./BlogCard";
import { connectToDatabase } from "@/app/lib/mongodb";

export default async function FeaturedBlogs() {
  let blogs: any[] = [];

  try {
    const { db } = await connectToDatabase();
    blogs = await db
      .collection("blogs")
      .find({ status: "published" })
      .sort({ publishedAt: -1 })
      .limit(6) // Fetch latest 6
      .toArray();
  } catch (error) {
    console.error("Failed to fetch blogs for landing page:", error);
  }

  // Calculate read time roughly (200 words per minute)
  const calculateReadTime = (content: string) => {
    const words = content?.trim().split(/\s+/).length || 0;
    return Math.ceil(words / 200);
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
              // Handle tags which might be string[] or object[] depending on legacy data
              // In new editor it is string[]
              const firstTag = Array.isArray(blog.tags)
                ? typeof blog.tags[0] === "string"
                  ? blog.tags[0]
                  : blog.tags[0]?.name
                : "Tech";

              return (
                <BlogCard
                  key={blog._id.toString()}
                  slug={blog.slug}
                  image={
                    blog.coverImage ||
                    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
                  }
                  category={firstTag || "General"}
                  categoryColor="" // Let card decide based on name
                  date={new Date(
                    blog.publishedAt || blog.createdAt
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  readTime={`${calculateReadTime(blog.content || "")} min read`}
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

import ImageWithFallback from "@/app/components/ImageWithFallback";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import BlogCard from "@/app/components/BlogCard";
import CodeBlock from "@/app/components/CodeBlock";
import ShareButtons from "@/app/components/ShareButtons";
import BlogInteractions from "@/app/components/BlogInteractions";
import BlogSectionsRenderer from "@/app/components/BlogSectionsRenderer";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// Helper to format tags
const formatTags = (tags: any[]) => {
  if (!Array.isArray(tags)) return [];
  return tags.map((tag) => {
    if (typeof tag === "string") {
      return { _id: tag, name: tag, slug: tag, color: "#4F46E5" };
    }
    return tag;
  });
};

// Helper to format author
const formatAuthor = (author: any, email?: string) => {
  if (typeof author === "string") {
    return {
      _id: "1",
      displayName: author,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`,
      role: "Writer",
    };
  }
  return (
    author || {
      _id: "1",
      displayName: "Admin Writer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
      role: "Writer",
    }
  );
};

export async function generateStaticParams() {
  try {
    const { db } = await connectToDatabase();
    const blogs = await db
      .collection("blogs")
      .find({ status: "published" }, { projection: { slug: 1 } })
      .toArray();
    return blogs.map((blog) => ({ slug: blog.slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const { db } = await connectToDatabase();
    const blog = await db.collection("blogs").findOne({ slug });

    if (!blog) {
      return { title: "Blog Not Found" };
    }

    return {
      title: `${blog.title} | FixTera`,
      description: blog.summary,
    };
  } catch (error) {
    return { title: "Error" };
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let blog: any = null;
  let relatedPosts: any[] = [];

  console.log("DEBUG: BlogDetailPage params.slug:", slug);
  const decodedSlug = decodeURIComponent(slug); // Ensure decoded
  console.log("DEBUG: Decoded Slug:", decodedSlug);

  try {
    const { db } = await connectToDatabase();
    // Try finding by slug (decoded)
    blog = await db.collection("blogs").findOne({ slug: decodedSlug });

    if (!blog && decodedSlug !== slug) {
      // Try raw slug just in case
      console.log("DEBUG: trying raw slug:", slug);
      blog = await db.collection("blogs").findOne({ slug: slug });
    }

    console.log("DEBUG: Found blog?", !!blog);

    if (blog) {
      // Fetch related posts (simple approach: same category/tag, excluding current)
      const tags = Array.isArray(blog.tags) ? blog.tags : [];
      const tagSlugs = tags.map((t: any) =>
        typeof t === "string" ? t : t.slug,
      );

      relatedPosts = await db
        .collection("blogs")
        .find({
          status: "published",
          slug: { $ne: slug },
          // Only filter if we have tags, else just get latest
          ...(tagSlugs.length > 0 ? { tags: { $in: tagSlugs } } : {}),
        })
        .limit(3)
        .toArray();
    }
  } catch (error) {
    console.error("Error fetching blog:", error);
  }

  if (!blog) {
    notFound();
  }

  // Format data for UI
  const formattedBlog = {
    ...blog,
    tags: formatTags(blog.tags),
    author: formatAuthor(blog.author, blog.authorEmail),
    readingTime:
      blog.readingTime || Math.ceil((blog.content?.length || 0) / 1000) || 5,
    publishedAt: blog.publishedAt || blog.createdAt,
  };

  const formattedRelatedPosts = relatedPosts.map((post) => ({
    ...post,
    tags: formatTags(post.tags),
    readingTime:
      post.readingTime || Math.ceil((post.content?.length || 0) / 1000) || 5,
    publishedAt: post.publishedAt || post.createdAt,
  }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 pt-24">
        {/* Hero Section */}
        <div className="relative">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-linear-to-b from-brand-blue/10 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Navigation Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-1 font-mono">
              <Link
                href="/"
                className="hover:text-brand-cyan transition-colors flex items-center gap-1.5 shrink-0"
              >
                <i className="fas fa-home text-slate-500" />
                <span>home</span>
              </Link>
              <span className="text-slate-600">/</span>
              <Link
                href="/blog"
                className="hover:text-brand-cyan transition-colors shrink-0"
              >
                blogs
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-brand-cyan font-medium truncate max-w-[200px] sm:max-w-md">
                {formattedBlog.slug}
              </span>
            </nav>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {formattedBlog.tags.map((tag: any) => {
                const color = tag.color || "#4F46E5";
                // Generate rgba background from hex color
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                const bgGlow = `rgba(${r}, ${g}, ${b}, 0.15)`;

                return (
                  <a
                    key={tag.slug || tag.name}
                    href={`/blog?tag=${tag.slug}`}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-600"
                    style={{
                      borderColor: `${color}30`,
                    }}
                  >
                    {/* Colored Icon */}
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: bgGlow }}
                    >
                      <i
                        className="fas fa-tag text-xs"
                        style={{ color: color }}
                      ></i>
                    </div>
                    {/* Tag Name */}
                    <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                      {tag.name}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              {formattedBlog.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-400 mb-8">
              {formattedBlog.summary}
            </p>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src={formattedBlog.author.avatar}
                  alt={formattedBlog.author.displayName}
                  className="w-12 h-12 rounded-full bg-slate-800"
                />
                <div>
                  <p className="font-medium text-white">
                    {formattedBlog.author.displayName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formattedBlog.author.role}
                  </p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-10 bg-slate-800" />

              <div className="flex items-center gap-2 text-slate-400">
                <i className="fas fa-calendar text-slate-500" />
                <span>
                  {new Date(formattedBlog.publishedAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <i className="fas fa-clock text-slate-500" />
                <span>{formattedBlog.readingTime} min read</span>
              </div>

              <div className="hidden sm:block w-px h-10 bg-slate-800" />
              <BlogInteractions
                initialLikes={formattedBlog.likeCount || 0}
                initialViews={formattedBlog.viewCount || 0}
              />
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <ImageWithFallback
              src={formattedBlog.coverImage}
              alt={formattedBlog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 to-transparent" />
          </div>
        </div>

        {/* Content */}
        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Check if blog has sections (new drag-drop format) */}
          {formattedBlog.sections && formattedBlog.sections.length > 0 ? (
            <BlogSectionsRenderer sections={formattedBlog.sections} />
          ) : (
            /* Legacy markdown content rendering */
            <div className="prose prose-invert prose-lg max-w-none">
              {formattedBlog.content ? (
                (() => {
                  const lines = formattedBlog.content.split("\n");
                  const elements = [];
                  let currentCodeBlock: {
                    code: string;
                    language: string;
                    filename?: string;
                  } | null = null;
                  let insideCodeBlock = false;

                  for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];

                    // Code block start/end
                    if (line.trim().startsWith("```")) {
                      if (insideCodeBlock) {
                        // End of code block
                        if (currentCodeBlock) {
                          elements.push(
                            <CodeBlock
                              key={`code-${i}`}
                              code={currentCodeBlock.code.trim()}
                              language={currentCodeBlock.language}
                              filename={currentCodeBlock.filename}
                            />,
                          );
                        }
                        currentCodeBlock = null;
                        insideCodeBlock = false;
                      } else {
                        // Start of code block
                        insideCodeBlock = true;
                        const meta = line
                          .trim()
                          .replace("```", "")
                          .trim()
                          .split(":");
                        currentCodeBlock = {
                          code: "",
                          language: meta[0] || "text",
                          filename: meta[1],
                        };
                      }
                      continue;
                    }

                    // Inside code block
                    if (insideCodeBlock && currentCodeBlock) {
                      currentCodeBlock.code += line + "\n";
                      continue;
                    }

                    // Normal content rendering (Simplified markdown)
                    if (line.startsWith("## ")) {
                      elements.push(
                        <h2
                          key={`h2-${i}`}
                          className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6"
                        >
                          {line.replace("## ", "")}
                        </h2>,
                      );
                    } else if (line.startsWith("### ")) {
                      elements.push(
                        <h3
                          key={`h3-${i}`}
                          className="text-xl sm:text-2xl font-semibold text-white mt-8 mb-4"
                        >
                          {line.replace("### ", "")}
                        </h3>,
                      );
                    } else if (line.startsWith("- ")) {
                      elements.push(
                        <li
                          key={`li-${i}`}
                          className="text-slate-300 ml-4 mb-2"
                        >
                          {line.replace("- ", "")}
                        </li>,
                      );
                    } else if (/^\d+\./.test(line)) {
                      elements.push(
                        <li
                          key={`ol-${i}`}
                          className="text-slate-300 ml-4 list-decimal mb-2"
                        >
                          {line.replace(/^\d+\.\s*/, "")}
                        </li>,
                      );
                    } else if (line.trim().startsWith("![")) {
                      // Handle markdown images: ![alt](url)
                      const imageMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
                      if (imageMatch) {
                        const [, alt, src] = imageMatch;
                        elements.push(
                          <figure key={`img-${i}`} className="my-8">
                            <img
                              src={src}
                              alt={alt || "Blog image"}
                              className="w-full rounded-xl border border-slate-800 shadow-lg"
                            />
                            {alt && alt !== "Image" && (
                              <figcaption className="text-center text-sm text-slate-500 mt-3 italic">
                                {alt}
                              </figcaption>
                            )}
                          </figure>,
                        );
                      }
                    } else if (
                      line.trim() !== "" &&
                      !/^\*[^*]+\*$/.test(line.trim())
                    ) {
                      // Skip standalone italic lines (image captions already handled)
                      elements.push(
                        <p
                          key={`p-${i}`}
                          className="text-slate-300 leading-relaxed mb-4"
                        >
                          {line}
                        </p>,
                      );
                    }
                  }
                  return elements;
                })()
              ) : (
                <p className="text-slate-400 italic">Content pending...</p>
              )}
            </div>
          )}

          {/* Share Section */}
          <div className="mt-16 pt-8 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-slate-400">Share this article</p>
              <div className="flex items-center gap-3">
                <ShareButtons
                  title={formattedBlog.title}
                  slug={formattedBlog.slug}
                />
              </div>
            </div>
          </div>

          {/* Author Card */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="flex flex-col sm:flex-row gap-6">
              <ImageWithFallback
                src={formattedBlog.author.avatar}
                alt={formattedBlog.author.displayName}
                className="w-20 h-20 rounded-full bg-slate-800"
              />
              <div>
                <p className="text-sm text-brand-cyan mb-1">Written by</p>
                <h3 className="text-xl font-bold text-white mb-2">
                  {formattedBlog.author.displayName}
                </h3>
                <p className="text-slate-400 mb-4">
                  {formattedBlog.author.role} at FixTera. Passionate about
                  building great software and sharing knowledge with the
                  developer community.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {formattedRelatedPosts.length > 0 && (
          <div className="bg-[#020617] py-20 border-t border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-white mb-10">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {formattedRelatedPosts.map((post: any) => (
                  <BlogCard
                    key={post.slug}
                    slug={post.slug}
                    image={post.coverImage}
                    category={post.tags[0]?.name || "Tech"}
                    categoryColor={`text-[${post.tags[0]?.color || "#4F46E5"}]`}
                    date={new Date(post.publishedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      },
                    )}
                    readTime={`${post.readingTime} min read`}
                    title={post.title}
                    excerpt={post.summary}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

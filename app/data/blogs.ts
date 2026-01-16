import publicBlogPosts from "@/mockdata/user/publicBlogPosts.json";
import blogContent from "@/mockdata/user/blogContent.json";

export interface BlogTag {
  _id: string;
  name: string;
  slug: string;
  color: string;
}

export interface BlogAuthor {
  _id: string;
  displayName: string;
  avatar: string;
  role?: string; // Optional as it might not be in all mock data
}

export interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  summary: string; // Changed from description
  content?: string; // Optional because public list doesn't have it
  coverImage: string;
  difficultyLevel: string;
  readingTime: number; // Changed from string to number (minutes)
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  tags: BlogTag[];
  author: BlogAuthor;
  relatedPosts?: {
    _id: string;
    slug: string;
    title: string;
    coverImage: string;
  }[];
}

// Transform public posts to match strict types if needed, or cast
const posts: BlogPost[] = publicBlogPosts.map((post) => ({
  ...post,
  author: { ...post.author, role: "Writer" }, // Default role if missing
}));

export function getAllBlogs(): BlogPost[] {
  return posts;
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  // First try to find in content map for full content
  const contentKey = Object.keys(blogContent).find(
    (key) => (blogContent as any)[key].slug === slug
  );

  if (contentKey) {
    const content = (blogContent as any)[contentKey];
    return {
      ...content,
      author: { ...content.author, role: "Writer" },
    } as BlogPost;
  }

  // Fallback to public list (no content)
  return posts.find((blog) => blog.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((blog) => blog.slug);
}

export function getRelatedPosts(currentSlug: string): BlogPost[] {
  const currentPost = getBlogBySlug(currentSlug);
  if (!currentPost) return [];

  const currentTagSlugs = currentPost.tags.map((t) => t.slug);

  return posts
    .filter((post) => {
      // Exclude current post
      if (post.slug === currentSlug) return false;

      // Check for shared tags
      return post.tags.some((tag) => currentTagSlugs.includes(tag.slug));
    })
    .slice(0, 3); // Limit to 3 related posts
}

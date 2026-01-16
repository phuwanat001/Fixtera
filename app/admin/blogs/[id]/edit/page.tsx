"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import BlogEditor from "../../../components/BlogEditor";
import AdminPageLayout from "../../../components/AdminPageLayout";
import { use } from "react";

interface BlogData {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  tags: string[];
  author: string;
  status: string;
  source?: string;
}

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${id}`);
        const data = await response.json();
        
        if (data.blog) {
          setBlog(data.blog);
        } else {
          setError(data.error || "Blog not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlog();
  }, [id]);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Changes saved!");
        router.push("/admin?tab=blogs");
      } else {
        toast.error(result.error || "Failed to save changes");
      }
    } catch (err) {
      console.error("Error saving blog:", err);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminPageLayout activeTab="blogs">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      </AdminPageLayout>
    );
  }

  if (error || !blog) {
    return (
      <AdminPageLayout activeTab="blogs">
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <i className="ph ph-warning text-3xl text-red-400"></i>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Blog Not Found</h2>
          <p className="text-slate-400 mb-6">{error || "The blog you're looking for doesn't exist."}</p>
          <button
            onClick={() => router.push("/admin?tab=blogs")}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </AdminPageLayout>
    );
  }

  const initialData = {
    title: blog.title,
    slug: blog.slug,
    summary: blog.summary || "",
    content: blog.content,
    coverImage: blog.coverImage || "",
    tags: blog.tags || [],
    authorName: blog.author || "Admin",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    status: blog.status as "draft" | "published" | "review" | "pending_review",
  };

  return (
    <AdminPageLayout activeTab="blogs">
      {blog.source === "ai" && blog.status === "pending_review" && (
        <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-3">
          <i className="ph ph-magic-wand text-purple-400 text-xl"></i>
          <div>
            <p className="text-sm font-medium text-purple-200">AI Generated Content</p>
            <p className="text-xs text-purple-300/70">Review and edit the content before publishing</p>
          </div>
        </div>
      )}
      <BlogEditor
        initialData={initialData}
        isEditing={true}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </AdminPageLayout>
  );
}

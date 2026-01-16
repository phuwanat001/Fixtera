"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import BlogEditor from "../../components/BlogEditor";
import AdminPageLayout from "../../components/AdminPageLayout";
import { useAuth } from "../../../lib/auth-context";

export default function CreateBlogPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          author: user?.displayName || "Admin",
          authorEmail: user?.email || "",
          source: "manual",
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Blog saved successfully!");
        router.push("/admin?tab=blogs");
      } else {
        toast.error(result.error || "Failed to save blog");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save blog");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminPageLayout activeTab="blogs">
      <BlogEditor onSave={handleSave} isSaving={isSaving} />
    </AdminPageLayout>
  );
}

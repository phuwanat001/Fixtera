"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Tag {
  _id: string;
  name: string;
  slug: string;
  color: string;
  description: string;
  articleCount: number;
}

export default function TagsSection() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    color: "#4F46E5",
    description: "",
  });

  // Fetch tags
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags");
      const data = await response.json();
      if (data.success) {
        setTags(data.tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to load tags");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-"),
    });
  };

  // Open modal for create
  const handleCreate = () => {
    setEditingTag(null);
    setFormData({ name: "", slug: "", color: "#4F46E5", description: "" });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      description: tag.description,
    });
    setIsModalOpen(true);
  };

  // Save tag (create or update)
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      const url = editingTag ? `/api/tags/${editingTag._id}` : "/api/tags";
      const method = editingTag ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingTag ? "Tag updated!" : "Tag created!");
        setIsModalOpen(false);
        fetchTags(); // Refresh list
      } else {
        toast.error(data.error || "Failed to save tag");
      }
    } catch (error) {
      console.error("Error saving tag:", error);
      toast.error("Failed to save tag");
    }
  };

  // Delete tag
  const handleDelete = async (tag: Tag) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>Delete tag "{tag.name}"? This cannot be undone.</span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const response = await fetch(`/api/tags/${tag._id}`, {
                    method: "DELETE",
                  });

                  const data = await response.json();

                  if (data.success) {
                    toast.success("Tag deleted!");
                    fetchTags();
                  } else {
                    toast.error(data.error || "Failed to delete tag");
                  }
                } catch (error) {
                  console.error("Error deleting tag:", error);
                  toast.error("Failed to delete tag");
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-slate-600 text-white rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">
          Tags Overview ({tags.length})
        </h3>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-blue-500/20 text-sm font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <i className="ph ph-plus-circle text-lg"></i>
          Add Tag
        </button>
      </div>

      {/* Tags Grid */}
      {tags.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <i className="ph ph-hash text-4xl mb-2 opacity-50"></i>
          <p>No tags yet. Create your first tag!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <div
              key={tag._id}
              className="group border border-slate-800/50 p-5 rounded-2xl bg-slate-900/30 hover:border-slate-700 transition-all duration-300 relative overflow-hidden"
            >
              {/* Action buttons */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={() => handleEdit(tag)}
                  className="text-slate-400 hover:text-white bg-slate-800/80 p-1.5 rounded-lg backdrop-blur-sm"
                >
                  <i className="ph ph-pencil text-sm"></i>
                </button>
                <button
                  onClick={() => handleDelete(tag)}
                  className="text-slate-400 hover:text-red-400 bg-slate-800/80 p-1.5 rounded-lg backdrop-blur-sm"
                >
                  <i className="ph ph-trash text-sm"></i>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                  }}
                >
                  <i className="ph ph-hash"></i>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg tracking-tight">
                    {tag.name}
                  </h4>
                  <p className="text-xs font-medium text-slate-500">
                    {tag.articleCount} articles
                  </p>
                </div>
              </div>

              {tag.description && (
                <p className="text-sm text-slate-400 mt-3 line-clamp-2">
                  {tag.description}
                </p>
              )}

              {/* Color indicator */}
              <div
                className="mt-4 h-1 rounded-full opacity-60"
                style={{ backgroundColor: tag.color }}
              ></div>
            </div>
          ))}
        </div>
      )}

      {/* Tag Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">
                {editingTag ? "Edit Tag" : "Create Tag"}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. React"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. react"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 font-mono"
                    placeholder="#4F46E5"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 resize-none"
                  placeholder="Brief description of this tag..."
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold"
              >
                {editingTag ? "Save Changes" : "Create Tag"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface AIContext {
  _id: string;
  name: string;
  description: string;
  systemPrompt: string;
  userPromptTemplate: string;
  category: string;
  isActive: boolean;
  isDefault: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  { value: "blog", label: "Blog Generation" },
  { value: "tutorial", label: "Tutorial" },
  { value: "review", label: "Tech Review" },
  { value: "news", label: "News Article" },
  { value: "general", label: "General" },
];

export default function AIConfigsSection() {
  const [contexts, setContexts] = useState<AIContext[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingContext, setEditingContext] = useState<AIContext | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    userPromptTemplate: "เขียนบทความเกี่ยวกับ: {{topic}}",
    category: "blog",
    isActive: true,
    isDefault: false,
  });

  // Fetch contexts from API
  const fetchContexts = async () => {
    try {
      const response = await fetch("/api/ai-contexts");
      const data = await response.json();
      if (data.contexts) {
        setContexts(data.contexts);
      }
    } catch (error) {
      console.error("Error fetching contexts:", error);
      toast.error("Failed to load AI contexts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContexts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      systemPrompt: "",
      userPromptTemplate: "เขียนบทความเกี่ยวกับ: {{topic}}",
      category: "blog",
      isActive: true,
      isDefault: false,
    });
    setEditingContext(null);
  };

  const handleOpenModal = (context?: AIContext) => {
    if (context) {
      setEditingContext(context);
      setFormData({
        name: context.name,
        description: context.description,
        systemPrompt: context.systemPrompt,
        userPromptTemplate: context.userPromptTemplate,
        category: context.category,
        isActive: context.isActive,
        isDefault: context.isDefault,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSave = async () => {
    if (!formData.name || !formData.systemPrompt) {
      toast.error("Name and System Prompt are required");
      return;
    }

    setIsSaving(true);
    try {
      const url = "/api/ai-contexts";
      const method = editingContext ? "PUT" : "POST";
      const body = editingContext
        ? { _id: editingContext._id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingContext ? "Context updated!" : "Context created!");
        handleCloseModal();
        fetchContexts();
      } else {
        toast.error(data.error || "Failed to save context");
      }
    } catch (error) {
      console.error("Error saving context:", error);
      toast.error("Failed to save context");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const context = contexts.find((c) => c._id === id);

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>Delete context "{context?.name}"?</span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const response = await fetch(`/api/ai-contexts?id=${id}`, {
                    method: "DELETE",
                  });
                  const data = await response.json();

                  if (data.success) {
                    toast.success("Context deleted!");
                    fetchContexts();
                  } else {
                    toast.error(data.error || "Failed to delete context");
                  }
                } catch (error) {
                  console.error("Error deleting context:", error);
                  toast.error("Failed to delete context");
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

  const handleSetDefault = async (context: AIContext) => {
    try {
      const response = await fetch("/api/ai-contexts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: context._id, isDefault: true }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(`"${context.name}" set as default`);
        fetchContexts();
      }
    } catch (error) {
      console.error("Error setting default:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            AI Context Templates
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage fixed prompts and contexts for AI blog generation
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl shadow-lg shadow-cyan-500/20 text-sm font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <i className="ph ph-plus-circle text-lg"></i>
          New Context
        </button>
      </div>

      {/* Empty State */}
      {contexts.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <i className="ph ph-brain text-3xl text-slate-500"></i>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            No AI Contexts Yet
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            Create your first AI context template to get started
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Create First Context
          </button>
        </div>
      )}

      {/* Contexts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {contexts.map((context) => (
          <div
            key={context._id}
            className="group p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    context.isDefault
                      ? "bg-cyan-500/20 border-cyan-500/30"
                      : "bg-slate-800 border-slate-700"
                  }`}
                >
                  <i
                    className={`ph ph-brain text-xl ${
                      context.isDefault ? "text-cyan-400" : "text-slate-400"
                    }`}
                  ></i>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-lg">
                      {context.name}
                    </h3>
                    {context.isDefault && (
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide rounded-full bg-cyan-950/50 text-cyan-400 border border-cyan-500/20">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {CATEGORIES.find((c) => c.value === context.category)
                      ?.label || context.category}
                    {" • "}
                    {context.usageCount || 0} uses
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {!context.isDefault && (
                  <button
                    onClick={() => handleSetDefault(context)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
                    title="Set as default"
                  >
                    <i className="ph ph-star text-lg"></i>
                  </button>
                )}
                <button
                  onClick={() => handleOpenModal(context)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <i className="ph ph-pencil-simple text-lg"></i>
                </button>
                <button
                  onClick={() => handleDelete(context._id)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <i className="ph ph-trash text-lg"></i>
                </button>
              </div>
            </div>

            {context.description && (
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                {context.description}
              </p>
            )}

            {/* System Prompt Preview */}
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">
                System Prompt
              </p>
              <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed font-mono opacity-80">
                {context.systemPrompt}
              </p>
            </div>

            {/* User Prompt Template */}
            <div className="mt-3 p-3 bg-slate-950/30 rounded-lg border border-slate-800/30">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                User Prompt Template
              </p>
              <p className="text-xs text-slate-400 font-mono">
                {context.userPromptTemplate}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">
                {editingContext ? "Edit Context" : "New AI Context"}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Name & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g., Tech Blog Writer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Short description of this context"
                />
              </div>

              {/* System Prompt */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  System Prompt *
                </label>
                <textarea
                  value={formData.systemPrompt}
                  onChange={(e) =>
                    setFormData({ ...formData, systemPrompt: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none resize-none font-mono text-sm"
                  placeholder="You are a professional tech writer..."
                />
              </div>

              {/* User Prompt Template */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  User Prompt Template
                  <span className="text-slate-500 font-normal ml-2">
                    Use {"{{topic}}"} as placeholder
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.userPromptTemplate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      userPromptTemplate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none font-mono text-sm"
                  placeholder="Write a blog about: {{topic}}"
                />
              </div>

              {/* Options */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-slate-300">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      setFormData({ ...formData, isDefault: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-slate-300">Set as Default</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="ph ph-floppy-disk"></i>
                    {editingContext ? "Update" : "Create"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

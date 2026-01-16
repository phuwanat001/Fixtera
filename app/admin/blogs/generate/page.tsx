"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AdminPageLayout from "../../components/AdminPageLayout";
import { useAuth } from "../../../lib/auth-context";

interface AIContext {
  _id: string;
  name: string;
  description: string;
  isDefault: boolean;
}

const GEMINI_MODELS = [
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    desc: "เร็ว, เสถียร (แนะนำ)",
  },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", desc: "ฉลาด, คุณภาพสูงสุด" },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    desc: "ประหยัด, ทำงานเร็ว",
  },
];

export default function GenerateBlogPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [contexts, setContexts] = useState<AIContext[]>([]);
  const [formData, setFormData] = useState({
    topic: "",
    contextId: "",
    language: "th",
    customPrompt: "",
    model: "gemini-2.0-flash",
  });

  // Fetch AI contexts
  useEffect(() => {
    const fetchContexts = async () => {
      try {
        const response = await fetch("/api/ai-contexts?isActive=true");
        const data = await response.json();
        if (data.contexts) {
          setContexts(data.contexts);
          // Set default context if available
          const defaultCtx = data.contexts.find((c: AIContext) => c.isDefault);
          if (defaultCtx) {
            setFormData((prev) => ({ ...prev, contextId: defaultCtx._id }));
          }
        }
      } catch (error) {
        console.error("Error fetching contexts:", error);
      }
    };
    fetchContexts();
  }, []);

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("Generating blog with AI...");

    try {
      const response = await fetch("/api/ai/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: formData.topic,
          contextId: formData.contextId || undefined,
          customPrompt: formData.customPrompt || undefined,
          language: formData.language,
          model: formData.model,
          author: user?.displayName || "AI Writer",
          authorEmail: user?.email || "",
        }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Blog generated! Redirecting to edit...");
        router.push(`/admin/blogs/${data.blogId}/edit`);
      } else {
        toast.error(data.error || "Failed to generate blog");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error generating blog:", error);
      toast.error("Failed to generate blog");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AdminPageLayout activeTab="blogs">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-slate-400 text-sm mb-4">
            <a
              href="/admin?tab=blogs"
              className="hover:text-white transition-colors"
            >
              Blogs
            </a>
            <span>/</span>
            <span className="text-white font-medium">Generate with AI</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <i className="ph ph-magic-wand text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                AI Blog Generator
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Generate blog content using AI with customizable prompts
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Topic */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <label className="block text-sm font-bold text-white mb-3">
              <i className="ph ph-lightbulb text-amber-400 mr-2"></i>
              Topic / หัวข้อ
            </label>
            <textarea
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none text-lg"
              placeholder="e.g., วิธีใช้ React Server Components ใน Next.js 15"
            />
            <p className="text-xs text-slate-500 mt-2">
              อธิบายหัวข้อที่ต้องการให้ AI เขียนบทความ
            </p>
          </div>

          {/* Context Selection */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <label className="block text-sm font-bold text-white mb-3">
              <i className="ph ph-brain text-purple-400 mr-2"></i>
              AI Context Template
            </label>
            <select
              value={formData.contextId}
              onChange={(e) =>
                setFormData({ ...formData, contextId: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="">Use Default System Prompt</option>
              {contexts.map((ctx) => (
                <option key={ctx._id} value={ctx._id}>
                  {ctx.name} {ctx.isDefault && "(Default)"}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-2">
              เลือก Context Template ที่สร้างไว้ หรือใช้ค่าเริ่มต้น
            </p>
          </div>

          {/* Model Selection */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <label className="block text-sm font-bold text-white mb-3">
              <i className="ph ph-cpu text-emerald-400 mr-2"></i>
              AI Model
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GEMINI_MODELS.map((model) => (
                <label
                  key={model.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.model === model.id
                      ? "bg-purple-500/10 border-purple-500/50"
                      : "bg-slate-950 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="model"
                    value={model.id}
                    checked={formData.model === model.id}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    className="w-4 h-4 text-purple-500 bg-slate-800 border-slate-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-white text-sm font-medium">
                      {model.name}
                    </span>
                    <p className="text-xs text-slate-500">{model.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <label className="block text-sm font-bold text-white mb-3">
              <i className="ph ph-globe text-cyan-400 mr-2"></i>
              Language / ภาษา
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="th"
                  checked={formData.language === "th"}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  className="w-4 h-4 text-purple-500 bg-slate-800 border-slate-600 focus:ring-purple-500"
                />
                <span className="text-white">🇹🇭 ภาษาไทย</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={formData.language === "en"}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  className="w-4 h-4 text-purple-500 bg-slate-800 border-slate-600 focus:ring-purple-500"
                />
                <span className="text-white">🇺🇸 English</span>
              </label>
            </div>
          </div>

          {/* Custom Prompt (Optional) */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <label className="block text-sm font-bold text-white mb-3">
              <i className="ph ph-pencil-simple text-emerald-400 mr-2"></i>
              Custom Instructions (Optional)
            </label>
            <textarea
              value={formData.customPrompt}
              onChange={(e) =>
                setFormData({ ...formData, customPrompt: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none"
              placeholder="Additional instructions for AI... (e.g., Include code examples, Focus on beginners, etc.)"
            />
            <p className="text-xs text-slate-500 mt-2">
              คำสั่งเพิ่มเติม (ไม่บังคับ) จะรวมกับ Context Template
            </p>
          </div>

          {/* Generate Button */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/admin?tab=blogs")}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.topic.trim()}
              className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <i className="ph ph-magic-wand text-xl"></i>
                  Generate Blog
                </>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <i className="ph ph-info text-purple-400 text-lg mt-0.5"></i>
              <div>
                <p className="text-sm text-purple-200 font-medium">
                  How it works
                </p>
                <p className="text-xs text-purple-300/70 mt-1">
                  AI จะสร้างบทความตามหัวข้อที่ระบุ บทความที่สร้างจะถูกบันทึกเป็น
                  "Pending Review" คุณสามารถแก้ไขและ Publish
                  ได้หลังจากตรวจสอบเนื้อหา
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}

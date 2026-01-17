"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

interface BlogBlock {
  id: string;
  type: "text" | "image" | "code" | "file-tree";
  content: string;
  imageUrl?: string;
  caption?: string;
  language?: string;
}

interface BlogEditorProps {
  initialData?: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    blocks?: BlogBlock[];
    coverImage: string;
    tags: string[];
    authorName: string;
    authorAvatar: string;
    status: "draft" | "published" | "review" | "pending_review";
  };
  isEditing?: boolean;
  onSave?: (data: any) => void;
  isSaving?: boolean;
}

// Parse markdown content to blocks (for backward compatibility with old blogs)
const parseContentToBlocks = (content: string): BlogBlock[] => {
  if (!content) return [{ id: "1", type: "text", content: "" }];

  const blocks: BlogBlock[] = [];
  const lines = content.split("\n");
  let currentTextBlock = "";
  let insideCodeBlock = false;
  let codeBlockContent = "";
  let codeBlockLanguage = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.trim().startsWith("```")) {
      if (insideCodeBlock) {
        // End code block - determine if it's code or file-tree based on language
        const isFileTree =
          !codeBlockLanguage ||
          codeBlockLanguage === "text" ||
          codeBlockLanguage === "plain";
        blocks.push({
          id: Date.now().toString() + (isFileTree ? "-tree-" : "-code-") + i,
          type: isFileTree ? "file-tree" : "code",
          content: codeBlockContent.trim(),
          language: isFileTree ? undefined : codeBlockLanguage,
        });
        codeBlockContent = "";
        insideCodeBlock = false;
      } else {
        // Save any pending text
        if (currentTextBlock.trim()) {
          blocks.push({
            id: Date.now().toString() + "-text-" + i,
            type: "text",
            content: currentTextBlock.trim(),
          });
          currentTextBlock = "";
        }
        // Start code block
        insideCodeBlock = true;
        codeBlockLanguage =
          line.trim().replace("```", "").split(":")[0].trim() || "";
      }
      continue;
    }

    if (insideCodeBlock) {
      codeBlockContent += line + "\n";
      continue;
    }

    // Handle images: ![alt](url)
    const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      // Save any pending text
      if (currentTextBlock.trim()) {
        blocks.push({
          id: Date.now().toString() + "-text-" + i,
          type: "text",
          content: currentTextBlock.trim(),
        });
        currentTextBlock = "";
      }
      // Add image block
      blocks.push({
        id: Date.now().toString() + "-img-" + i,
        type: "image",
        content: "",
        imageUrl: imageMatch[2],
        caption: imageMatch[1] !== "Image" ? imageMatch[1] : "",
      });
      continue;
    }

    // Skip standalone italic caption lines (already part of image)
    if (/^\*[^*]+\*$/.test(line.trim())) {
      continue;
    }

    // Regular text
    currentTextBlock += line + "\n";
  }

  // Add remaining text
  if (currentTextBlock.trim()) {
    blocks.push({
      id: Date.now().toString() + "-text-final",
      type: "text",
      content: currentTextBlock.trim(),
    });
  }

  return blocks.length > 0 ? blocks : [{ id: "1", type: "text", content: "" }];
};

export default function BlogEditor({
  initialData,
  isEditing = false,
  onSave,
  isSaving: externalIsSaving,
}: BlogEditorProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    summary: initialData?.summary || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    tags: initialData?.tags.join(", ") || "",
    authorName: initialData?.authorName || "Admin Writer",
    authorAvatar:
      initialData?.authorAvatar ||
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    status: initialData?.status || "draft",
  });

  // Use saved blocks if available, otherwise parse content to blocks
  const [blocks, setBlocks] = useState<BlogBlock[]>(() => {
    if (initialData?.blocks && initialData.blocks.length > 0) {
      return initialData.blocks;
    }
    return parseContentToBlocks(initialData?.content || "");
  });

  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [internalIsSaving, setInternalIsSaving] = useState(false);
  const isSaving =
    externalIsSaving !== undefined ? externalIsSaving : internalIsSaving;

  // Tag selection state
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        const data = await response.json();
        if (data.success) {
          setAvailableTags(data.tags);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  // Auto-generate slug from title if not editing
  useEffect(() => {
    if (!isEditing && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Post Title is required");
      // Scroll to top to show the error field
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setInternalIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setInternalIsSaving(false);
      if (onSave) {
        // Compile blocks to markdown content for backward compatibility
        const compiledContent = blocks
          .map((b) => {
            if (b.type === "image") {
              return `![${b.caption || "Image"}](${b.imageUrl})\n\n*${
                b.caption || ""
              }*`;
            } else if (b.type === "code") {
              return "```" + (b.language || "") + "\n" + b.content + "\n```";
            } else if (b.type === "file-tree") {
              return "```\n" + b.content + "\n```";
            }
            return b.content;
          })
          .join("\n\n");

        onSave({
          ...formData,
          content: compiledContent,
          blocks,
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        });
      }
    }, 1000);
  };

  const [deleteBlockId, setDeleteBlockId] = useState<string | null>(null);

  const confirmDeleteBlock = () => {
    if (deleteBlockId) {
      setBlocks(blocks.filter((b) => b.id !== deleteBlockId));
      setDeleteBlockId(null);
      toast.success("Block deleted successfully");
    }
  };

  const handleImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Temporary limit: 500KB to prevent MongoDB 16MB document limit
    // TODO: Implement S3 upload - see docs/S3_Image_Upload_Plan.md
    if (file.size > 500 * 1024) {
      toast.error(
        "File is too large (max 500KB). Please use an external image URL instead, or wait for S3 integration.",
      );
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newBlocks = [...blocks];
      newBlocks[index].imageUrl = base64String;
      setBlocks(newBlocks);
      toast.success("Image uploaded!");
    };
    reader.readAsDataURL(file);
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Temporary limit: 500KB to prevent MongoDB 16MB document limit
    // TODO: Implement S3 upload - see docs/S3_Image_Upload_Plan.md
    if (file.size > 500 * 1024) {
      toast.error(
        "Cover image is too large (max 500KB). Please use an external image URL or compress the image.",
      );
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        coverImage: reader.result as string,
      }));
      toast.success("Cover image uploaded!");
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-20 relative">
      {/* Delete Confirmation Modal */}
      {deleteBlockId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <i className="ph ph-trash text-2xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Delete Block?
                </h3>
                <p className="text-sm text-slate-400">
                  Are you sure you want to remove this section? This action
                  cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  type="button"
                  onClick={() => setDeleteBlockId(null)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteBlock}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2 text-slate-400">
          <Link
            href="/admin?tab=blogs"
            className="hover:text-white transition-colors"
          >
            Blogs
          </Link>
          <span>/</span>
          <span className="text-white font-medium">
            {isEditing ? "Edit Post" : "New Post"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={formData.status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFormData({ ...formData, status: e.target.value as any })
            }
            className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          >
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="published">Published</option>
          </select>
          <button
            type="submit"
            disabled={isSaving}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <i className="ph ph-spinner animate-spin"></i> Saving...
              </>
            ) : (
              <>
                <i className="ph ph-floppy-disk"></i> Save Post
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">
              Post Title
            </label>
            <TextareaAutosize
              minRows={1}
              placeholder="Enter post title..."
              className="block p-4 w-full text-3xl font-bold text-white bg-transparent border-none rounded-lg focus:ring-0 placeholder:text-slate-600 resize-none"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
              Slug URL
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-800 border border-r-0 border-slate-700 rounded-l-md">
                /blog/
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="rounded-none rounded-r-lg bg-slate-900 border border-slate-700 text-slate-300 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                placeholder="post-url-slug"
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900/50 relative group"
              >
                {/* Block Controls */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-slate-900/80 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (index === 0) return;
                      const newBlocks = [...blocks];
                      [newBlocks[index - 1], newBlocks[index]] = [
                        newBlocks[index],
                        newBlocks[index - 1],
                      ];
                      setBlocks(newBlocks);
                    }}
                    className="p-1 hover:text-white text-slate-400 disabled:opacity-30"
                    disabled={index === 0}
                  >
                    <i className="ph ph-arrow-up"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (index === blocks.length - 1) return;
                      const newBlocks = [...blocks];
                      [newBlocks[index + 1], newBlocks[index]] = [
                        newBlocks[index],
                        newBlocks[index + 1],
                      ];
                      setBlocks(newBlocks);
                    }}
                    className="p-1 hover:text-white text-slate-400 disabled:opacity-30"
                    disabled={index === blocks.length - 1}
                  >
                    <i className="ph ph-arrow-down"></i>
                  </button>
                  <div className="w-px h-4 bg-slate-700 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => setDeleteBlockId(block.id)}
                    className="p-1 hover:text-red-400 text-slate-400"
                  >
                    <i className="ph ph-trash"></i>
                  </button>
                </div>

                {/* Block Content */}
                <div className="p-4">
                  <div className="mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <i
                      className={`ph ${
                        block.type === "text"
                          ? "ph-text-aa"
                          : block.type === "image"
                            ? "ph-image"
                            : block.type === "code"
                              ? "ph-code"
                              : "ph-tree-structure"
                      }`}
                    ></i>
                    {block.type === "file-tree" ? "Structure" : block.type}{" "}
                    Block
                  </div>

                  {block.type === "text" && (
                    <TextareaAutosize
                      minRows={3}
                      value={block.content}
                      onChange={(e) => {
                        const newBlocks = [...blocks];
                        newBlocks[index].content = e.target.value;
                        setBlocks(newBlocks);
                      }}
                      placeholder="Write your content here (Markdown supported)..."
                      className="w-full bg-transparent border-none text-slate-300 focus:ring-0 resize-none font-mono text-sm leading-relaxed p-0"
                    />
                  )}

                  {block.type === "image" && (
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start">
                        <div className="flex-1 space-y-3">
                          {/* URL Input */}
                          <div>
                            <label className="block mb-1.5 text-xs font-medium text-slate-400">
                              Image Source
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={block.imageUrl || ""}
                                onChange={(e) => {
                                  const newBlocks = [...blocks];
                                  newBlocks[index].imageUrl = e.target.value;
                                  setBlocks(newBlocks);
                                }}
                                className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Paste Image URL..."
                              />
                              <div className="relative">
                                <input
                                  type="file"
                                  id={`file-upload-${block.id}`}
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(index, e)}
                                />
                                <label
                                  htmlFor={`file-upload-${block.id}`}
                                  className="h-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap text-sm font-medium"
                                  title="Upload from device"
                                >
                                  <i className="ph ph-upload-simple"></i>
                                  <span className="hidden sm:inline">
                                    Upload
                                  </span>
                                </label>
                              </div>
                            </div>
                            <p className="mt-1.5 text-[10px] text-slate-500">
                              Provide an external URL or upload a file (converts
                              to Base64)
                            </p>
                          </div>

                          {/* Caption */}
                          <div>
                            <input
                              type="text"
                              value={block.caption || ""}
                              onChange={(e) => {
                                const newBlocks = [...blocks];
                                newBlocks[index].caption = e.target.value;
                                setBlocks(newBlocks);
                              }}
                              className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              placeholder="Caption (optional)"
                            />
                          </div>
                        </div>

                        {/* Preview */}
                        <div className="w-1/3 min-w-[120px]">
                          {block.imageUrl ? (
                            <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 aspect-video flex items-center justify-center group/preview">
                              <img
                                src={block.imageUrl}
                                alt="Preview"
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newBlocks = [...blocks];
                                  newBlocks[index].imageUrl = "";
                                  setBlocks(newBlocks);
                                }}
                                className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-red-500 text-white rounded opacity-0 group-hover/preview:opacity-100 transition-all backdrop-blur-sm"
                              >
                                <i className="ph ph-x"></i>
                              </button>
                            </div>
                          ) : (
                            <div className="aspect-video rounded-lg border-2 border-dashed border-slate-700/50 flex flex-col items-center justify-center text-slate-600 bg-slate-900/30">
                              <i className="ph ph-image text-2xl mb-1"></i>
                              <span className="text-[10px]">No Image</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {block.type === "code" && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={block.language || ""}
                        onChange={(e) => {
                          const newBlocks = [...blocks];
                          newBlocks[index].language = e.target.value;
                          setBlocks(newBlocks);
                        }}
                        className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
                        placeholder="Language (e.g. typescript, python)..."
                      />
                      <div className="bg-slate-950 rounded-lg border border-slate-700 p-2">
                        <TextareaAutosize
                          minRows={5}
                          value={block.content}
                          onChange={(e) => {
                            const newBlocks = [...blocks];
                            newBlocks[index].content = e.target.value;
                            setBlocks(newBlocks);
                          }}
                          placeholder="Paste your code here..."
                          className="w-full bg-transparent border-none text-slate-300 focus:ring-0 resize-none font-mono text-sm leading-relaxed p-0"
                        />
                      </div>
                    </div>
                  )}

                  {block.type === "file-tree" && (
                    <div className="space-y-2">
                      <div className="bg-slate-950 rounded-lg border border-slate-700 p-4 font-mono text-sm">
                        <TextareaAutosize
                          minRows={5}
                          value={block.content}
                          onChange={(e) => {
                            const newBlocks = [...blocks];
                            newBlocks[index].content = e.target.value;
                            setBlocks(newBlocks);
                          }}
                          placeholder={`- app
  - page.tsx
  - layout.tsx
- components
  - Header.tsx`}
                          className="w-full bg-transparent border-none text-slate-300 focus:ring-0 resize-none p-0 whitespace-pre"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Use indentation to show hierarchy
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add Block Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
              <button
                type="button"
                onClick={() =>
                  setBlocks([
                    ...blocks,
                    { id: Date.now().toString(), type: "text", content: "" },
                  ])
                }
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all"
              >
                <i className="ph ph-text-aa text-lg"></i>
                <span className="text-sm font-medium">Add Text</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setBlocks([
                    ...blocks,
                    {
                      id: Date.now().toString(),
                      type: "image",
                      content: "",
                      imageUrl: "",
                    },
                  ])
                }
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all"
              >
                <i className="ph ph-image text-lg"></i>
                <span className="text-sm font-medium">Add Image</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setBlocks([
                    ...blocks,
                    {
                      id: Date.now().toString(),
                      type: "code",
                      content: "",
                      language: "typescript",
                    },
                  ])
                }
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all"
              >
                <i className="ph ph-code text-lg"></i>
                <span className="text-sm font-medium">Add Code</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setBlocks([
                    ...blocks,
                    {
                      id: Date.now().toString(),
                      type: "file-tree",
                      content: "",
                    },
                  ])
                }
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all"
              >
                <i className="ph ph-tree-structure text-lg"></i>
                <span className="text-sm font-medium">Add Structure</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Column */}
        <div className="space-y-6">
          {/* Metadata - Required fields first */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <i className="ph ph-tag text-blue-400"></i>
              Metadata
            </h3>

            <div className="mb-4 relative">
              <label className="block mb-2 text-sm font-medium text-slate-400">
                Tags <span className="text-red-400">*</span>
              </label>

              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tagSlug) => {
                    const tagInfo = availableTags.find(
                      (t) => t.slug === tagSlug || t.name === tagSlug,
                    );
                    return (
                      <span
                        key={tagSlug}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300"
                        style={
                          tagInfo?.color
                            ? {
                                borderColor: tagInfo.color + "40",
                                color: tagInfo.color,
                                backgroundColor: tagInfo.color + "10",
                              }
                            : {}
                        }
                      >
                        {tagInfo?.name || tagSlug}
                        <button
                          type="button"
                          onClick={() => {
                            const newTags = formData.tags
                              .split(",")
                              .map((t) => t.trim())
                              .filter((t) => t && t !== tagSlug)
                              .join(", ");
                            setFormData({ ...formData, tags: newTags });
                          }}
                          className="hover:text-red-400 transition-colors ml-0.5"
                        >
                          <i className="ph ph-x"></i>
                        </button>
                      </span>
                    );
                  })}
              </div>

              {/* Tag Search Input */}
              <div className="relative">
                {isTagDropdownOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsTagDropdownOpen(false)}
                  ></div>
                )}

                <div className="relative z-50">
                  <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => {
                      setTagSearch(e.target.value);
                      setIsTagDropdownOpen(true);
                    }}
                    onFocus={() => setIsTagDropdownOpen(true)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 p-2.5"
                    placeholder="Search to add tags..."
                  />

                  {isTagDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                      {availableTags
                        .filter((t) => {
                          const currentTags = formData.tags
                            .split(",")
                            .map((tag) => tag.trim());
                          return (
                            !currentTags.includes(t.slug) &&
                            (t.name
                              .toLowerCase()
                              .includes(tagSearch.toLowerCase()) ||
                              t.slug
                                .toLowerCase()
                                .includes(tagSearch.toLowerCase()))
                          );
                        })
                        .map((tag) => (
                          <button
                            key={tag._id}
                            type="button"
                            onClick={() => {
                              const currentTags = formData.tags
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean);
                              const newTags = [...currentTags, tag.slug].join(
                                ", ",
                              );
                              setFormData({ ...formData, tags: newTags });
                              setTagSearch("");
                              setIsTagDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-3 transition-colors border-b border-slate-700/50 last:border-0"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full shadow-sm"
                              style={{ backgroundColor: tag.color }}
                            ></span>
                            <span className="font-medium">{tag.name}</span>
                            <span className="text-xs text-slate-500 ml-auto font-mono opacity-70">
                              {tag.slug}
                            </span>
                          </button>
                        ))}
                      {availableTags.length === 0 && (
                        <div className="px-4 py-3 text-sm text-slate-500 text-center">
                          No tags available. Create one in Tags Management.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-400">
                Author
              </label>
              <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg border border-slate-700">
                <span className="text-sm font-medium text-white">
                  {formData.authorName}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <i className="ph ph-image text-emerald-400"></i>
              Featured Image
            </h3>
            <div className="mb-4">
              {formData.coverImage ? (
                <div className="aspect-video relative rounded-lg overflow-hidden border border-slate-700 group">
                  <img
                    src={formData.coverImage}
                    alt="Cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1627398242450-274d0c71ba44?w=800&auto=format&fit=crop&q=60";
                    }}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, coverImage: "" })}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="ph ph-trash"></i>
                  </button>
                </div>
              ) : (
                <div className="aspect-video rounded-lg border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
                  <i className="ph ph-image text-3xl mb-2"></i>
                  <span className="text-xs">Preview Area</span>
                </div>
              )}
            </div>
            <label className="block mb-2 text-sm font-medium text-slate-400">
              Image Source
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Paste URL..."
              />
              <div className="relative">
                <input
                  type="file"
                  id="cover-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                />
                <label
                  htmlFor="cover-upload"
                  className="h-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap text-sm font-medium"
                  title="Upload cover image"
                >
                  <i className="ph ph-upload-simple"></i>
                </label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <i className="ph ph-text-align-left text-violet-400"></i>
              Summary
            </h3>
            <label className="block mb-2 text-sm font-medium text-slate-400">
              Description (for SEO)
            </label>
            <textarea
              rows={4}
              value={formData.summary}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              className="block p-2.5 w-full text-sm text-slate-300 bg-slate-900 rounded-lg border border-slate-700 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Brief description for SEO and cards..."
            ></textarea>
          </div>
        </div>
      </div>
    </form>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import DraggableBlock from "./DraggableBlock";
import { LayoutType, getLayoutColumns } from "./LayoutPicker";

// Types
interface ContentBlock {
  id: string;
  type: "text" | "image" | "code" | "file-tree" | "quote" | "divider";
  content: string;
  imageUrl?: string;
  caption?: string;
  language?: string;
}

interface SectionBlock {
  id: string;
  type: "section";
  layoutType: LayoutType;
  columns: {
    id: string;
    blocks: ContentBlock[];
  }[];
}

// Helper functions
const createSection = (layoutType: LayoutType): SectionBlock => {
  const columns = getLayoutColumns(layoutType);
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "section",
    layoutType,
    columns: columns.map((_, index) => ({
      id: `col-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      blocks: [],
    })),
  };
};

const createContentBlock = (
  type: ContentBlock["type"],
  content: string = "",
): ContentBlock => ({
  id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type,
  content,
  ...(type === "image" && { imageUrl: "", caption: "" }),
  ...(type === "code" && { language: "typescript" }),
});

// Inline Layout Picker Component
function InlineLayoutPicker({
  onSelect,
  onClose,
}: {
  onSelect: (layout: LayoutType) => void;
  onClose: () => void;
}) {
  const layouts: { type: LayoutType; label: string; icon: React.ReactNode }[] =
    [
      {
        type: "full",
        label: "Full",
        icon: <div className="w-full h-4 bg-current rounded opacity-60" />,
      },
      {
        type: "two-equal",
        label: "50/50",
        icon: (
          <div className="flex gap-0.5 w-full h-4">
            <div className="flex-1 bg-current rounded opacity-60" />
            <div className="flex-1 bg-current rounded opacity-60" />
          </div>
        ),
      },
      {
        type: "two-left",
        label: "70/30",
        icon: (
          <div className="flex gap-0.5 w-full h-4">
            <div className="w-[70%] bg-current rounded opacity-60" />
            <div className="w-[30%] bg-current rounded opacity-60" />
          </div>
        ),
      },
      {
        type: "two-right",
        label: "30/70",
        icon: (
          <div className="flex gap-0.5 w-full h-4">
            <div className="w-[30%] bg-current rounded opacity-60" />
            <div className="w-[70%] bg-current rounded opacity-60" />
          </div>
        ),
      },
      {
        type: "three-equal",
        label: "3-col",
        icon: (
          <div className="flex gap-0.5 w-full h-4">
            <div className="flex-1 bg-current rounded opacity-60" />
            <div className="flex-1 bg-current rounded opacity-60" />
            <div className="flex-1 bg-current rounded opacity-60" />
          </div>
        ),
      },
    ];

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-xl border border-slate-700 shadow-xl animate-in fade-in zoom-in-95 duration-150">
      {layouts.map((layout) => (
        <button
          key={layout.type}
          type="button"
          onClick={() => {
            onSelect(layout.type);
            onClose();
          }}
          className="w-16 p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all flex flex-col items-center gap-1"
          title={layout.label}
        >
          <div className="w-full">{layout.icon}</div>
          <span className="text-[9px] font-medium">{layout.label}</span>
        </button>
      ))}
      <button onClick={onClose} className="p-1 text-slate-500 hover:text-white">
        <i className="ph ph-x" />
      </button>
    </div>
  );
}

// Add Section Button Component
function AddSectionButton({
  onAddSection,
  position,
}: {
  onAddSection: (layout: LayoutType) => void;
  position: "top" | "between" | "bottom";
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div
      className={`relative flex items-center justify-center ${position === "between" ? "py-2" : "py-4"}`}
    >
      {!showPicker ? (
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className={`
            group flex items-center gap-2 px-4 py-2 
            ${
              position === "between"
                ? "text-slate-500 hover:text-blue-400 text-sm"
                : "bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-slate-400 hover:text-white rounded-xl"
            }
            transition-all
          `}
        >
          <i className="ph ph-plus-circle text-lg group-hover:scale-110 transition-transform" />
          <span
            className={
              position === "between" ? "text-xs" : "text-sm font-medium"
            }
          >
            {position === "top"
              ? "Add First Section"
              : position === "bottom"
                ? "Add Section"
                : "Insert Section"}
          </span>
        </button>
      ) : (
        <InlineLayoutPicker
          onSelect={onAddSection}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

// Content Block Editor Component
function ContentBlockEditor({
  block,
  onUpdate,
  onDelete,
}: {
  block: ContentBlock;
  onUpdate: (block: ContentBlock) => void;
  onDelete: () => void;
}) {
  const blockIcons: Record<string, string> = {
    text: "ph-text-aa",
    image: "ph-image",
    code: "ph-code",
    "file-tree": "ph-tree-structure",
    quote: "ph-quotes",
    divider: "ph-minus",
  };

  return (
    <div className="group relative bg-slate-900/80 border border-slate-700/50 rounded-lg hover:border-slate-600 transition-all">
      {/* Compact Header - shows on hover */}
      <div className="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <span className="px-2 py-0.5 text-[10px] font-medium uppercase bg-slate-800 text-slate-400 rounded-full border border-slate-700">
          <i className={`ph ${blockIcons[block.type]} mr-1`} />
          {block.type}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="w-5 h-5 flex items-center justify-center bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full transition-all"
        >
          <i className="ph ph-x text-xs" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {block.type === "text" && (
          <TextareaAutosize
            minRows={2}
            value={block.content}
            onChange={(e) => onUpdate({ ...block, content: e.target.value })}
            placeholder="เขียนเนื้อหาที่นี่... (รองรับ Markdown)"
            className="w-full bg-transparent border-none text-slate-300 focus:ring-0 resize-none text-sm p-0 placeholder:text-slate-600"
          />
        )}

        {block.type === "image" && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={block.imageUrl || ""}
                onChange={(e) =>
                  onUpdate({ ...block, imageUrl: e.target.value })
                }
                className="flex-1 bg-slate-800/50 border border-slate-700 text-slate-300 text-xs rounded-lg p-2"
                placeholder="URL รูปภาพ..."
              />
            </div>
            {block.imageUrl && (
              <img
                src={block.imageUrl}
                alt="Preview"
                className="max-h-40 rounded-lg border border-slate-700"
              />
            )}
            <input
              type="text"
              value={block.caption || ""}
              onChange={(e) => onUpdate({ ...block, caption: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs rounded-lg p-2"
              placeholder="Caption (ถ้ามี)"
            />
          </div>
        )}

        {block.type === "code" && (
          <div className="space-y-2">
            <input
              type="text"
              value={block.language || ""}
              onChange={(e) => onUpdate({ ...block, language: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs rounded-lg p-2"
              placeholder="ภาษา (เช่น typescript, python)"
            />
            <TextareaAutosize
              minRows={4}
              value={block.content}
              onChange={(e) => onUpdate({ ...block, content: e.target.value })}
              placeholder="// โค้ดของคุณ..."
              className="w-full bg-slate-950 border border-slate-700 text-emerald-300 rounded-lg font-mono text-xs p-3"
            />
          </div>
        )}

        {block.type === "quote" && (
          <div className="border-l-2 border-blue-500 pl-3">
            <TextareaAutosize
              minRows={2}
              value={block.content}
              onChange={(e) => onUpdate({ ...block, content: e.target.value })}
              placeholder="Quote..."
              className="w-full bg-transparent border-none text-slate-300 focus:ring-0 resize-none text-sm italic p-0"
            />
          </div>
        )}

        {block.type === "divider" && <hr className="border-slate-600 my-2" />}

        {block.type === "file-tree" && (
          <TextareaAutosize
            minRows={4}
            value={block.content}
            onChange={(e) => onUpdate({ ...block, content: e.target.value })}
            placeholder="📁 folder/&#10;  📄 file.ts"
            className="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded-lg font-mono text-xs p-3"
          />
        )}
      </div>
    </div>
  );
}

// Section Editor Component
function SectionEditor({
  section,
  onUpdate,
  onDelete,
}: {
  section: SectionBlock;
  onUpdate: (section: SectionBlock) => void;
  onDelete: () => void;
}) {
  const [showBlockMenu, setShowBlockMenu] = useState<number | null>(null);
  const columns = getLayoutColumns(section.layoutType);

  const layoutLabels: Record<LayoutType, string> = {
    full: "Full Width",
    "two-equal": "50 / 50",
    "two-left": "70 / 30",
    "two-right": "30 / 70",
    "three-equal": "3 Columns",
  };

  const handleAddBlock = (colIndex: number, type: ContentBlock["type"]) => {
    const newSection = { ...section };
    newSection.columns = section.columns.map((col, ci) => {
      if (ci === colIndex) {
        return { ...col, blocks: [...col.blocks, createContentBlock(type)] };
      }
      return col;
    });
    onUpdate(newSection);
    setShowBlockMenu(null);
  };

  const handleUpdateBlock = (
    colIndex: number,
    blockIndex: number,
    updatedBlock: ContentBlock,
  ) => {
    const newSection = { ...section };
    newSection.columns = section.columns.map((col, ci) => {
      if (ci === colIndex) {
        return {
          ...col,
          blocks: col.blocks.map((b, bi) =>
            bi === blockIndex ? updatedBlock : b,
          ),
        };
      }
      return col;
    });
    onUpdate(newSection);
  };

  const handleDeleteBlock = (colIndex: number, blockIndex: number) => {
    const newSection = { ...section };
    newSection.columns = section.columns.map((col, ci) => {
      if (ci === colIndex) {
        return {
          ...col,
          blocks: col.blocks.filter((_, bi) => bi !== blockIndex),
        };
      }
      return col;
    });
    onUpdate(newSection);
  };

  const blockTypes: {
    type: ContentBlock["type"];
    icon: string;
    label: string;
  }[] = [
    { type: "text", icon: "ph-text-aa", label: "Text" },
    { type: "image", icon: "ph-image", label: "Image" },
    { type: "code", icon: "ph-code", label: "Code" },
    { type: "quote", icon: "ph-quotes", label: "Quote" },
    { type: "file-tree", icon: "ph-tree-structure", label: "Tree" },
    { type: "divider", icon: "ph-minus", label: "Line" },
  ];

  return (
    <div className="group border border-slate-700/50 rounded-xl bg-slate-900/30 hover:border-slate-600/50 transition-all overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/30 border-b border-slate-700/30">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <i className="ph ph-layout text-blue-400" />
          {layoutLabels[section.layoutType]}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          title="Delete section"
        >
          <i className="ph ph-trash" />
        </button>
      </div>

      {/* Columns Grid */}
      <div
        className="grid gap-3 p-4"
        style={{ gridTemplateColumns: columns.map((w) => `${w}fr`).join(" ") }}
      >
        {section.columns.map((column, colIndex) => (
          <div
            key={column.id}
            className="min-h-[100px] rounded-lg border border-dashed border-slate-700/40 bg-slate-900/20 p-2 relative"
          >
            {/* Blocks */}
            <div className="space-y-2">
              {column.blocks.map((block, blockIndex) => (
                <ContentBlockEditor
                  key={block.id}
                  block={block}
                  onUpdate={(updated) =>
                    handleUpdateBlock(colIndex, blockIndex, updated)
                  }
                  onDelete={() => handleDeleteBlock(colIndex, blockIndex)}
                />
              ))}
            </div>

            {/* Add Block Button */}
            <div className="mt-2 relative">
              {showBlockMenu === colIndex ? (
                <div className="flex flex-wrap gap-1 p-2 bg-slate-800 rounded-lg border border-slate-700 animate-in fade-in zoom-in-95">
                  {blockTypes.map((bt) => (
                    <button
                      key={bt.type}
                      type="button"
                      onClick={() => handleAddBlock(colIndex, bt.type)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                    >
                      <i className={`ph ${bt.icon}`} />
                      {bt.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowBlockMenu(null)}
                    className="px-2 py-1 text-slate-500 hover:text-white"
                  >
                    <i className="ph ph-x text-xs" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowBlockMenu(colIndex)}
                  className="w-full py-2 text-slate-500 hover:text-blue-400 text-xs flex items-center justify-center gap-1 rounded-lg hover:bg-slate-800/50 transition-all"
                >
                  <i className="ph ph-plus-circle" />
                  Add block
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Editor Props
interface DragDropBlogEditorProps {
  initialData?: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    blocks?: any[];
    sections?: SectionBlock[];
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

// Main Editor Component
export default function DragDropBlogEditor({
  initialData,
  isEditing = false,
  onSave,
  isSaving: externalIsSaving,
}: DragDropBlogEditorProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    summary: initialData?.summary || "",
    coverImage: initialData?.coverImage || "",
    tags: initialData?.tags?.join(", ") || "",
    authorName: initialData?.authorName || "Admin Writer",
    authorAvatar: initialData?.authorAvatar || "",
    status: initialData?.status || "draft",
  });

  const [sections, setSections] = useState<SectionBlock[]>(() => {
    if (initialData?.sections && initialData.sections.length > 0) {
      return initialData.sections;
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [internalIsSaving, setInternalIsSaving] = useState(false);
  const isSaving =
    externalIsSaving !== undefined ? externalIsSaving : internalIsSaving;

  // Tags from API
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  // Fetch tags from API
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // Auto-generate slug
  useEffect(() => {
    if (!isEditing && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, isEditing]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      setSections(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const handleAddSection = (layoutType: LayoutType, insertAt?: number) => {
    const newSection = createSection(layoutType);
    if (insertAt !== undefined) {
      const newSections = [...sections];
      newSections.splice(insertAt, 0, newSection);
      setSections(newSections);
    } else {
      setSections([...sections, newSection]);
    }
  };

  const handleUpdateSection = (index: number, updated: SectionBlock) => {
    const newSections = [...sections];
    newSections[index] = updated;
    setSections(newSections);
  };

  const handleDeleteSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
    toast.success("Section deleted");
  };

  const compileToMarkdown = (): string => {
    return sections
      .flatMap((section) =>
        section.columns.flatMap((col) =>
          col.blocks.map((block) => {
            if (block.type === "text") return block.content;
            if (block.type === "image")
              return `![${block.caption || "Image"}](${block.imageUrl})`;
            if (block.type === "code")
              return (
                "```" + (block.language || "") + "\n" + block.content + "\n```"
              );
            if (block.type === "quote")
              return "> " + block.content.replace(/\n/g, "\n> ");
            if (block.type === "divider") return "---";
            if (block.type === "file-tree")
              return "```\n" + block.content + "\n```";
            return "";
          }),
        ),
      )
      .join("\n\n");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("กรุณาใส่ชื่อบทความ");
      return;
    }
    setInternalIsSaving(true);
    setTimeout(() => {
      setInternalIsSaving(false);
      onSave?.({
        ...formData,
        content: compileToMarkdown(),
        sections,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
    }, 500);
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      toast.error("ไฟล์ใหญ่เกินไป (max 500KB)");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, coverImage: reader.result as string }));
      toast.success("อัพโหลดสำเร็จ!");
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin?tab=blogs"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <i className="ph ph-arrow-left text-lg" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">
              {isEditing ? "Edit Post" : "Create New Post"}
            </h1>
            <p className="text-xs text-slate-500">Drag & Drop Editor</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-slate-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab("write")}
              className={`px-3 py-1.5 text-sm ${activeTab === "write" ? "bg-slate-700 text-white" : "text-slate-400"}`}
            >
              <i className="ph ph-pencil-simple mr-1" />
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 text-sm ${activeTab === "preview" ? "bg-slate-700 text-white" : "text-slate-400"}`}
            >
              <i className="ph ph-eye mr-1" />
              Preview
            </button>
          </div>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as any })
            }
            className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2"
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
          </select>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <i className="ph ph-spinner animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <i className="ph ph-floppy-disk" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-4">
          {/* Title */}
          <TextareaAutosize
            minRows={1}
            placeholder="ชื่อบทความ..."
            className="w-full text-2xl font-bold text-white bg-transparent border-none focus:ring-0 placeholder:text-slate-600 resize-none"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          {/* Slug */}
          <div className="flex text-sm">
            <span className="px-3 py-2 bg-slate-800 text-slate-500 border border-r-0 border-slate-700 rounded-l-lg">
              /blog/
            </span>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 rounded-r-lg px-3 py-2"
              placeholder="url-slug"
            />
          </div>

          {activeTab === "write" ? (
            <div className="space-y-2">
              {/* Empty State */}
              {sections.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/20">
                  <i className="ph ph-layout text-4xl text-slate-600 mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">
                    เริ่มสร้างบทความ
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                    เลือก Layout เพื่อเพิ่ม Section แรก
                  </p>
                  <AddSectionButton
                    onAddSection={(layout) => handleAddSection(layout)}
                    position="top"
                  />
                </div>
              )}

              {/* Sections with DnD */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section, index) => (
                    <React.Fragment key={section.id}>
                      <DraggableBlock id={section.id}>
                        <SectionEditor
                          section={section}
                          onUpdate={(updated) =>
                            handleUpdateSection(index, updated)
                          }
                          onDelete={() => handleDeleteSection(index)}
                        />
                      </DraggableBlock>
                      {/* Add section button between sections */}
                      <AddSectionButton
                        onAddSection={(layout) =>
                          handleAddSection(layout, index + 1)
                        }
                        position={
                          index === sections.length - 1 ? "bottom" : "between"
                        }
                      />
                    </React.Fragment>
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 prose prose-invert max-w-none">
              <h1>{formData.title || "Untitled"}</h1>
              <ReactMarkdown>{compileToMarkdown()}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Cover Image */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <i className="ph ph-image text-green-400" />
              Cover Image
            </h4>
            {formData.coverImage ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-700 mb-3">
                <img
                  src={formData.coverImage}
                  alt="Cover"
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, coverImage: "" })}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 text-white rounded"
                >
                  <i className="ph ph-x" />
                </button>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-slate-700 rounded-lg p-6 text-center cursor-pointer hover:border-slate-600 transition-colors mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="hidden"
                />
                <i className="ph ph-upload-simple text-2xl text-slate-500 mb-2" />
                <p className="text-xs text-slate-500">Click to upload</p>
              </label>
            )}
            <input
              type="text"
              value={formData.coverImage}
              onChange={(e) =>
                setFormData({ ...formData, coverImage: e.target.value })
              }
              className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg p-2"
              placeholder="หรือใส่ URL..."
            />
          </div>

          {/* Tags */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <i className="ph ph-tag text-purple-400" />
              Tags
            </h4>
            {/* Selected Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
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
                      className="px-2 py-1 text-xs rounded-lg flex items-center gap-1 border"
                      style={
                        tagInfo?.color
                          ? {
                              borderColor: tagInfo.color + "40",
                              color: tagInfo.color,
                              backgroundColor: tagInfo.color + "15",
                            }
                          : { backgroundColor: "#1e293b", color: "#cbd5e1" }
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
                        className="hover:text-red-400 ml-0.5"
                      >
                        <i className="ph ph-x text-[10px]" />
                      </button>
                    </span>
                  );
                })}
            </div>

            {/* Tag Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-400 hover:border-slate-600 transition-colors"
              >
                <span>เลือก Tag...</span>
                <i
                  className={`ph ph-caret-down transition-transform ${showTagDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showTagDropdown && (
                <div className="absolute z-20 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {availableTags.length === 0 ? (
                    <div className="p-3 text-xs text-slate-500 text-center">
                      ไม่มี Tag
                    </div>
                  ) : (
                    availableTags.map((tag) => {
                      const isSelected = formData.tags
                        .split(",")
                        .map((t) => t.trim())
                        .includes(tag.slug);
                      return (
                        <button
                          key={tag._id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              const newTags = formData.tags
                                .split(",")
                                .map((t) => t.trim())
                                .filter((t) => t && t !== tag.slug)
                                .join(", ");
                              setFormData({ ...formData, tags: newTags });
                            } else {
                              const currentTags = formData.tags
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean);
                              setFormData({
                                ...formData,
                                tags: [...currentTags, tag.slug].join(", "),
                              });
                            }
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                            isSelected
                              ? "bg-blue-500/10 text-blue-400"
                              : "text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: tag.color || "#4F46E5" }}
                          />
                          <span className="flex-1">{tag.name}</span>
                          {isSelected && (
                            <i className="ph ph-check text-blue-400" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <i className="ph ph-text-align-left text-yellow-400" />
              Summary
            </h4>
            <TextareaAutosize
              minRows={3}
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg p-2 resize-none"
              placeholder="คำอธิบายสั้นๆ..."
            />
          </div>
        </div>
      </div>
    </form>
  );
}

"use client";

import React, { useState, useEffect } from "react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function NotificationModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: NotificationModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    isUnread: true,
  });

  useEffect(() => {
    if (initialData) {
      let type = initialData.type || "info";

      setFormData({
        title: initialData.title || "",
        message: initialData.message || "",
        type: type,
        isUnread: initialData.isUnread ?? true,
      });
    } else {
      setFormData({
        title: "",
        message: "",
        type: "info",
        isUnread: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-generate icon styling based on type
    const iconMap: Record<string, any> = {
      info: {
        icon: "info",
        iconColor: "text-blue-400",
        iconBg: "bg-blue-500/20",
      },
      success: {
        icon: "check-circle",
        iconColor: "text-green-400",
        iconBg: "bg-green-500/10",
      },
      warning: {
        icon: "warning",
        iconColor: "text-amber-400",
        iconBg: "bg-amber-500/10",
      },
      error: {
        icon: "x-circle",
        iconColor: "text-rose-400",
        iconBg: "bg-rose-500/10",
      },
    };

    const style = iconMap[formData.type] || iconMap.info;

    onSave({
      ...formData,
      ...style,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white tracking-tight">
            {initialData ? "Edit Notification" : "New Notification"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg"
          >
            <i className="ph ph-x text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-600 transition-all"
              placeholder="Notification Title"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Message
            </label>
            <textarea
              required
              rows={3}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none placeholder:text-slate-600 transition-all"
              placeholder="Notification details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Type
              </label>
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full appearance-none bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                >
                  <option value="info">Info (Blue)</option>
                  <option value="success">Success (Green)</option>
                  <option value="warning">Warning (Amber)</option>
                  <option value="error">Error (Red)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <i className="ph ph-caret-down text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-xl border border-slate-800/50">
            <input
              type="checkbox"
              id="isUnread"
              checked={formData.isUnread}
              onChange={(e) =>
                setFormData({ ...formData, isUnread: e.target.checked })
              }
              className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
            />
            <label
              htmlFor="isUnread"
              className="text-sm font-medium text-slate-300 cursor-pointer select-none"
            >
              Mark as Unread
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all"
            >
              {initialData ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

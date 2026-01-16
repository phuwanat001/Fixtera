import React from "react";

interface NotificationItemProps {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  message: React.ReactNode;
  time: string;
  isUnread?: boolean;
  onMarkRead: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({
  id,
  icon,
  iconColor,
  iconBg,
  title,
  message,
  time,
  isUnread = false,
  onMarkRead,
  onEdit,
  onDelete,
}: NotificationItemProps) {
  return (
    <div
      className={`group flex gap-4 p-5 rounded-2xl border transition-all duration-200 ${
        isUnread
          ? "bg-slate-900/80 border-cyan-500/30 border-l-4 border-l-cyan-500 shadow-md"
          : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
      }`}
    >
      <div className="mt-0.5 shrink-0">
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shadow-inner`}
        >
          <i className={`ph ph-${icon} text-lg`}></i>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4
            className={`text-sm ${
              isUnread ? "font-bold text-white" : "font-semibold text-slate-300"
            }`}
          >
            {title}
          </h4>
          <div className="flex items-center gap-3">
            {isUnread && (
              <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold bg-cyan-950/30 px-2 py-0.5 rounded-full border border-cyan-500/20">
                New
              </span>
            )}
            <span
              className={`text-xs ${
                isUnread ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {time}
            </span>
          </div>
        </div>
        <p
          className={`text-sm leading-relaxed ${
            isUnread ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {message}
        </p>

        {/* Actions - visible on hover or always for better UX */}
        <div className="flex gap-2 mt-4 opacity-80 group-hover:opacity-100 transition-opacity">
          {isUnread && (
            <button
              onClick={() => onMarkRead(id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/10 transition-colors font-medium"
            >
              Mark as Read
            </button>
          )}
          <button
            onClick={() => onEdit(id)}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/10 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

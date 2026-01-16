"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "squares-four" },
  { id: "blogs", label: "Blogs Management", icon: "article" },
  { id: "tags", label: "Tags Management", icon: "tag" },
  { id: "aimodels", label: "AI Models", icon: "cpu" },
  { id: "aiconfigs", label: "AI Configs", icon: "sliders" },
  { id: "users", label: "Users", icon: "users" },
  { id: "aijobs", label: "AI Jobs", icon: "lightning" },
  { id: "reviews", label: "Reviews", icon: "check-circle", badge: 1 },
  { id: "notifications", label: "Notifications", icon: "bell", badge: 3 },
];

export default function Sidebar({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}: SidebarProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Overlay (Mobile) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-md transition-opacity ${
          isOpen ? "block" : "hidden"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-72 bg-slate-950 border-r border-slate-800 transform transition-transform duration-300 ease-in-out z-[60] flex flex-col h-full shadow-2xl lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold mr-3 shadow-lg shadow-cyan-500/20">
            F
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Fixtera{" "}
            <span className="text-slate-500 font-medium text-xs uppercase tracking-wider ml-1">
              Admin
            </span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "text-white bg-slate-800/80 border border-slate-700/50 shadow-lg shadow-black/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                } ${item.badge ? "justify-between" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <i
                    className={`ph ph-${item.icon} text-xl transition-colors ${
                      isActive
                        ? "text-cyan-400"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  ></i>
                  {item.label}
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-cyan-500 text-white shadow-sm shadow-cyan-500/20"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 m-4 border border-slate-800 rounded-2xl bg-slate-900/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-2 cursor-pointer group">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "Admin"}
                className="w-10 h-10 rounded-full border border-slate-700 group-hover:border-cyan-500/30 transition-colors"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-slate-800 to-slate-700 flex items-center justify-center border border-slate-700 text-slate-300 font-bold group-hover:border-cyan-500/30 transition-colors">
                {user?.displayName?.charAt(0) || "A"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                {user?.displayName || "Admin"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || "admin@fixtera.com"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <i className="ph ph-sign-out text-lg"></i>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import toast from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AdminProtection from "../components/AdminProtection";
import StatCard from "./components/StatCard";
import TrafficChart from "./components/TrafficChart";
import RecentBlogs from "./components/RecentBlogs";
import BlogsTable from "./components/BlogsTable";
import TagCard from "./components/TagCard";
import NotificationItem from "./components/NotificationItem";
import NotificationModal from "./components/NotificationModal";
import AIStatCard from "./components/AIStatCard";
import RecentAIActivity from "./components/RecentAIActivity";
import AIModelsSection from "./components/AIModelsSection";
import AIConfigsSection from "./components/AIConfigsSection";
import UsersSection from "./components/UsersSection";
import AIJobsSection from "./components/AIJobsSection";
import ReviewsSection from "./components/ReviewsSection";
import { useSearchParams, useRouter } from "next/navigation";

// Import mock data
import tagsData from "@/mockdata/admin/tags.json";
import initialNotificationsData from "@/mockdata/admin/notifications.json";

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  blogs: "Blogs Management",
  tags: "Tags Overview",
  aimodels: "AI Models",
  aiconfigs: "AI Configs",
  users: "Users Management",
  aijobs: "AI Jobs",
  reviews: "Reviews",
  notifications: "Notifications",
};

const statsData = [
  {
    title: "Total Blogs",
    value: "1,248",
    icon: "article",
    iconColor: "text-fixtera-blue",
    iconBg: "bg-fixtera-blue/10",
    trend: { value: "12%", isPositive: true, label: "vs last month" },
  },
  {
    title: "Total Views",
    value: "45.2k",
    icon: "eye",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    trend: { value: "8.5%", isPositive: true, label: "vs last month" },
  },
  {
    title: "Active Tags",
    value: "64",
    icon: "hash",
    iconColor: "text-fixtera-cyan",
    iconBg: "bg-fixtera-cyan/10",
    badge: { text: "Global Categories", color: "text-slate-500" },
  },
  {
    title: "Pending Reviews",
    value: "8",
    icon: "warning-circle",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/10",
    badge: {
      text: "Low Priority",
      color: "text-orange-400 font-medium bg-orange-400/10",
    },
  },
];

function AdminContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [blogSearch, setBlogSearch] = useState("");
  const searchParams = useSearchParams();

  // Notification State
  const [notifications, setNotifications] = useState(initialNotificationsData);
  const [filterType, setFilterType] = useState<"all" | "unread">("all");

  // Notification Modal State
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState<any>(null);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === "unread") return n.isUnread;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  // Handler to open modal for creating new notification
  const handleCreateClick = () => {
    setEditingNotif(null);
    setIsNotifModalOpen(true);
  };

  // Handler to open modal for editing existing notification
  const handleEditClick = (id: string) => {
    const notif = notifications.find((n) => n.id === id);
    if (notif) {
      setEditingNotif(notif);
      setIsNotifModalOpen(true);
    }
  };

  // Handler to save notification from modal
  const handleSaveNotification = (data: any) => {
    if (editingNotif) {
      // Update existing
      setNotifications((prev) =>
        prev.map((n) => (n.id === editingNotif.id ? { ...n, ...data } : n))
      );
    } else {
      // Create new
      const newNotif = {
        id: Date.now().toString(),
        time: "Just now",
        ...data,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
    setIsNotifModalOpen(false);
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && pageTitles[tab]) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCreateTag = () => {
    toast("Create Tag modal would open here", { icon: "📝" });
  };

  return (
    <>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <Header
          title={pageTitles[activeTab]}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative scroll-smooth">
          {/* Dashboard Section */}
          <div
            className={`section-content space-y-6 ${
              activeTab === "dashboard" ? "active" : ""
            }`}
          >
            {/* AI Status Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AIStatCard
                title="AI Jobs Today"
                total={29}
                icon="lightning"
                iconColor="text-amber-400"
                iconBg="bg-amber-500/10"
                breakdown={[
                  {
                    label: "Success",
                    value: 24,
                    color: "text-green-400",
                    icon: "check-circle",
                  },
                  {
                    label: "Failed",
                    value: 2,
                    color: "text-red-400",
                    icon: "warning",
                  },
                  {
                    label: "Processing",
                    value: 3,
                    color: "text-blue-400",
                    icon: "spinner",
                  },
                ]}
              />
              <AIStatCard
                title="Blog Status"
                total={1248}
                icon="article"
                iconColor="text-fixtera-blue"
                iconBg="bg-fixtera-blue/10"
                breakdown={[
                  {
                    label: "Published",
                    value: 856,
                    color: "text-green-400",
                    icon: "globe",
                  },
                  {
                    label: "Drafts",
                    value: 342,
                    color: "text-yellow-400",
                    icon: "pencil",
                  },
                  {
                    label: "In Review",
                    value: 50,
                    color: "text-purple-400",
                    icon: "eye",
                  },
                ]}
              />
              <StatCard
                title="Total Views"
                value="45.2k"
                icon="eye"
                iconColor="text-purple-400"
                iconBg="bg-purple-500/10"
                trend={{
                  value: "8.5%",
                  isPositive: true,
                  label: "vs last month",
                }}
              />
              <StatCard
                title="Active Models"
                value="5/8"
                icon="cpu"
                iconColor="text-fixtera-cyan"
                iconBg="bg-fixtera-cyan/10"
                badge={{
                  text: "All Systems Go",
                  color: "text-green-400 bg-green-500/10",
                }}
              />
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TrafficChart />
                <RecentBlogs />
              </div>
              <div className="lg:col-span-1">
                <RecentAIActivity />
              </div>
            </div>
          </div>

          {/* Blogs Section */}
          <div
            className={`section-content space-y-6 ${
              activeTab === "blogs" ? "active" : ""
            }`}
          >
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:max-w-xs">
                <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 text-sm text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-500 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-900/50 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 text-sm flex items-center gap-2 transition-colors">
                  <i className="ph ph-funnel"></i> Filter
                </button>

                {/* Manual Write Button */}
                <button
                  onClick={() => router.push("/admin/blogs/create")}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
                >
                  <i className="ph ph-pencil-simple text-cyan-400"></i> Manual
                </button>

                {/* AI Generate Button */}
                <button
                  onClick={() => router.push("/admin/blogs/generate")}
                  className="px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20"
                >
                  <i className="ph ph-magic-wand"></i> AI Generate
                </button>
              </div>
            </div>

            <BlogsTable searchQuery={blogSearch} />
          </div>

          {/* Tags Section */}
          <div
            className={`section-content space-y-6 ${
              activeTab === "tags" ? "active" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Tags Overview
              </h3>
              <button
                onClick={handleCreateTag}
                className="px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-blue-500/20 text-sm font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <i className="ph ph-plus-circle text-lg"></i>
                Add Tag
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tagsData.map((tag, index) => (
                <TagCard
                  key={tag._id}
                  name={tag.name}
                  articleCount={(index + 1) * 7 + 12}
                  icon={"hash"}
                  color={index % 2 === 0 ? "blue" : "pink"}
                  progress={((index + 1) * 11) % 100}
                />
              ))}
            </div>
          </div>

          {/* AI Models Section */}
          <div
            className={`section-content space-y-6 ${
              activeTab === "aimodels" ? "active" : ""
            }`}
          >
            <AIModelsSection />
          </div>

          {/* AI Configs Section */}
          <div
            className={`section-content space-y-6 ${
              activeTab === "aiconfigs" ? "active" : ""
            }`}
          >
            <AIConfigsSection />
          </div>

          {/* Users Section */}
          <div
            className={`section-content space-y-6 ${
              activeTab === "users" ? "active" : ""
            }`}
          >
            <UsersSection />
          </div>

          {/* AI Jobs Section */}
          <div
            className={`section-content space-y-6 ${
              activeTab === "aijobs" ? "active" : ""
            }`}
          >
            <AIJobsSection />
          </div>

          {/* Reviews Section */}
          <div
            className={`section-content space-y-6 ${
              activeTab === "reviews" ? "active" : ""
            }`}
          >
            <ReviewsSection />
          </div>

          {/* Notifications Section */}
          <div
            className={`section-content space-y-6 ${
              activeTab === "notifications" ? "active" : ""
            }`}
          >
            <div className="flex gap-2 pb-4 border-b border-midnight-700 overflow-x-auto justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filterType === "all"
                      ? "bg-fixtera-blue text-white"
                      : "bg-midnight-800 text-slate-400 border border-midnight-700 hover:bg-midnight-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("unread")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filterType === "unread"
                      ? "bg-fixtera-blue text-white"
                      : "bg-midnight-800 text-slate-400 border border-midnight-700 hover:bg-midnight-700"
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCreateClick}
                  className="px-3 py-1.5 text-xs font-medium text-fixtera-blue bg-fixtera-blue/10 hover:bg-fixtera-blue/20 rounded-lg transition-colors border border-fixtera-blue/30"
                >
                  + New Notification
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    {...notification}
                    onMarkRead={handleMarkAsRead}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteNotification}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <i className="ph ph-bell-slash text-4xl mb-2 opacity-50"></i>
                  <p>No notifications found</p>
                </div>
              )}
            </div>

            <NotificationModal
              isOpen={isNotifModalOpen}
              onClose={() => setIsNotifModalOpen(false)}
              onSave={handleSaveNotification}
              initialData={editingNotif}
            />
          </div>

          {/* Footer */}
          <footer className="mt-8 pt-8 border-t border-midnight-800 text-center text-xs text-slate-600">
            &copy; 2024 Fixtera. All rights reserved. v1.0.0
          </footer>
        </main>
      </div>
    </>
  );
}

export default function AdminPage() {
  return (
    <AdminProtection>
      <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
        <AdminContent />
      </Suspense>
    </AdminProtection>
  );
}

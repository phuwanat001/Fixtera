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
import TagsSection from "./components/TagsSection";
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

// Notification interface
interface Notification {
  _id: string;
  id?: string;
  title: string;
  message: string;
  type: string;
  icon: string;
  isUnread: boolean;
  time: string;
  link?: string | null;
}

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

// Default stats structure
interface DashboardStats {
  blogs: {
    total: number;
    published: number;
    draft: number;
    review: number;
    pendingReview: number;
  };
  views: {
    total: number;
    formatted: string;
  };
  tags: {
    total: number;
  };
  pendingReviews: number;
}

function AdminContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [blogSearch, setBlogSearch] = useState("");
  const searchParams = useSearchParams();

  // Dashboard Stats State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "unread">("all");

  // Notification Modal State
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState<any>(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        if (data.success) {
          setNotifications(
            data.notifications.map((n: any) => ({ ...n, id: n._id })),
          );
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setNotificationsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === "unread") return n.isUnread;
    return true;
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, isUnread: false }),
      });
      const data = await response.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id || n._id === id ? { ...n, isUnread: false } : n,
          ),
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== id && n._id !== id),
        );
        toast.success("Notification deleted");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await fetch("/api/notifications?clearAll=true", {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setNotifications([]);
        toast.success("All notifications cleared");
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("Failed to clear notifications");
    }
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
  const handleSaveNotification = async (data: any) => {
    try {
      if (editingNotif) {
        // Update existing
        const response = await fetch("/api/notifications", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: editingNotif._id || editingNotif.id,
            ...data,
          }),
        });
        const result = await response.json();
        if (result.success) {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === editingNotif.id || n._id === editingNotif._id
                ? { ...n, ...data }
                : n,
            ),
          );
          toast.success("Notification updated");
        }
      } else {
        // Create new
        const response = await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.success) {
          setNotifications((prev) => [
            { ...result.notification, id: result.notification._id },
            ...prev,
          ]);
          toast.success("Notification created");
        }
      }
    } catch (error) {
      console.error("Error saving notification:", error);
      toast.error("Failed to save notification");
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
                title="Total Blogs"
                total={statsLoading ? 0 : stats?.blogs.total || 0}
                icon="article"
                iconColor="text-fixtera-blue"
                iconBg="bg-fixtera-blue/10"
                breakdown={[
                  {
                    label: "Published",
                    value: stats?.blogs.published || 0,
                    color: "text-green-400",
                    icon: "globe",
                  },
                  {
                    label: "Drafts",
                    value: stats?.blogs.draft || 0,
                    color: "text-yellow-400",
                    icon: "pencil",
                  },
                  {
                    label: "In Review",
                    value:
                      (stats?.blogs.review || 0) +
                      (stats?.blogs.pendingReview || 0),
                    color: "text-purple-400",
                    icon: "eye",
                  },
                ]}
              />
              <StatCard
                title="Total Views"
                value={statsLoading ? "..." : stats?.views.formatted || "0"}
                icon="eye"
                iconColor="text-purple-400"
                iconBg="bg-purple-500/10"
              />
              <StatCard
                title="Active Tags"
                value={statsLoading ? "..." : String(stats?.tags.total || 0)}
                icon="hash"
                iconColor="text-fixtera-cyan"
                iconBg="bg-fixtera-cyan/10"
                badge={{ text: "Global Categories", color: "text-slate-500" }}
              />
              <StatCard
                title="Pending Reviews"
                value={
                  statsLoading ? "..." : String(stats?.pendingReviews || 0)
                }
                icon="warning-circle"
                iconColor="text-orange-400"
                iconBg="bg-orange-500/10"
                badge={{
                  text:
                    (stats?.pendingReviews || 0) > 5
                      ? "Needs Attention"
                      : "Low Priority",
                  color:
                    (stats?.pendingReviews || 0) > 5
                      ? "text-red-400 font-medium bg-red-400/10"
                      : "text-orange-400 font-medium bg-orange-400/10",
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

                {/* Create Blog Button (uses Drag & Drop Editor) */}
                <button
                  onClick={() => router.push("/admin/blogs/create")}
                  className="px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                >
                  <i className="ph ph-grid-four"></i> Create Blog
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
            <TagsSection />
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
                    key={notification._id || notification.id}
                    id={notification._id || notification.id || ""}
                    icon={notification.icon}
                    title={notification.title}
                    message={notification.message}
                    time={notification.time}
                    isUnread={notification.isUnread}
                    type={notification.type}
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

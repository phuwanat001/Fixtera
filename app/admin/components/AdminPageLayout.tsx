"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useRouter } from "next/navigation";

interface AdminPageLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export default function AdminPageLayout({
  children,
  activeTab,
}: AdminPageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Used for sidebar navigation - redirects back to main dashboard with tab param
  // or simple navigation if we had real routes for each tab
  const handleTabChange = (tabId: string) => {
    // For now, since most admin parts are in one page, we direct back there
    if (tabId !== "blogs") {
      router.push(`/admin?tab=${tabId}`);
    } else {
      // If clicking blogs while in sub-blog page, go back to table
      router.push("/admin?tab=blogs");
    }
  };

  return (
    <>
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <Header
          title={activeTab === "blogs" ? "Blogs Management" : "Admin Panel"}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative scroll-smooth">
          {children}
        </main>
      </div>
    </>
  );
}

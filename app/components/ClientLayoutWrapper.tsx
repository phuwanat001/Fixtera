"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollIndicator from "./ScrollIndicator";
import { AuthProvider } from "../lib/auth-context";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isLogin = pathname === "/login";

  return (
    <AuthProvider>
      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(15, 23, 42, 0.95)",
            color: "#e2e8f0",
            border: "1px solid rgba(51, 65, 85, 0.5)",
            borderRadius: "12px",
            backdropFilter: "blur(12px)",
            padding: "12px 16px",
            fontSize: "14px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
          },
          success: {
            iconTheme: {
              primary: "#22d3ee",
              secondary: "#0f172a",
            },
            style: {
              borderColor: "rgba(34, 211, 238, 0.2)",
            },
          },
          error: {
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#0f172a",
            },
            style: {
              borderColor: "rgba(244, 63, 94, 0.2)",
            },
          },
          loading: {
            iconTheme: {
              primary: "#3b82f6",
              secondary: "#0f172a",
            },
          },
        }}
      />

      {!isAdmin && !isLogin && <ScrollIndicator />}
      {!isAdmin && !isLogin && <Navbar />}
      <main>{children}</main>
      {!isAdmin && !isLogin && <Footer />}
    </AuthProvider>
  );
}

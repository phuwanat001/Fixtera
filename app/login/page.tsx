"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../lib/auth-context";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithGoogle, signInAsGuest, loading } = useAuth();
  const [isLoading, setIsLoading] = useState<"admin" | "user" | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    setIsLoading("admin");
    try {
      const result = await signInWithGoogle();
      if (result) {
        toast.success(`Welcome, ${result.displayName || "User"}!`);
        if (result.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading("user");
    try {
      const result = await signInAsGuest();
      if (result) {
        toast.success("Welcome, Guest!");
        router.push("/");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute top-[-30%] left-[-20%] w-[70%] h-[70%] bg-gradient-to-br from-blue-600/30 via-cyan-500/15 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-40%] right-[-20%] w-[70%] h-[70%] bg-gradient-to-tl from-purple-500/25 via-blue-500/15 to-transparent rounded-full blur-[120px] animate-pulse-glow delay-1000" />
        <div className="absolute top-1/4 right-1/3 w-[35%] h-[35%] bg-gradient-to-r from-cyan-400/10 to-transparent rounded-full blur-[80px] animate-float" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/50 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-float delay-500" />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-purple-400/50 rounded-full animate-float delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8 animate-[fadeIn_0.6s_ease-out]">
          <Link href="/" className="inline-block group">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform duration-300">
                  <i className="ph-bold ph-lightning text-xl text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              </div>
              <span className="text-2xl font-bold text-white">
                Fix
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Tera
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="relative animate-[fadeIn_0.8s_ease-out_0.1s_both]">
          {/* Card glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-[28px] blur-sm opacity-50" />

          <div className="relative bg-slate-900/70 backdrop-blur-2xl border border-slate-800/50 rounded-3xl shadow-2xl p-8 overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                  Welcome Back
                </h1>
                <p className="text-slate-400">Sign in to access your account</p>
              </div>

              {/* Login Buttons */}
              <div className="space-y-4">
                {/* Google (Admin) */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading !== null}
                  onMouseEnter={() => setHoveredButton("admin")}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-slate-900 rounded-xl font-bold transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden hover:shadow-lg hover:shadow-white/20"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isLoading === "admin" ? (
                      <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    <span>Continue with Google</span>
                    <span className="px-2 py-0.5 text-xs bg-slate-200 text-slate-600 rounded-md">
                      Admin
                    </span>
                  </span>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-slate-100 to-white transition-opacity duration-300 ${
                      hoveredButton === "admin" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                  <div className="flex-1 border-t border-slate-700/50" />
                  <span className="px-4 text-sm text-slate-500">or</span>
                  <div className="flex-1 border-t border-slate-700/50" />
                </div>

                {/* Guest Login */}
                <button
                  onClick={handleGuestLogin}
                  disabled={isLoading !== null}
                  onMouseEnter={() => setHoveredButton("user")}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-800/80 text-white rounded-xl font-bold transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed border border-slate-700/50 overflow-hidden hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isLoading === "user" ? (
                      <div className="w-5 h-5 border-2 border-slate-500 border-t-cyan-400 rounded-full animate-spin" />
                    ) : (
                      <i className="ph-duotone ph-user-circle text-xl text-cyan-400" />
                    )}
                    <span>Continue as Guest</span>
                    <span className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded-md">
                      User
                    </span>
                  </span>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 transition-opacity duration-300 ${
                      hoveredButton === "user" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-xs text-slate-500 leading-relaxed">
                  By continuing, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center animate-[fadeIn_0.8s_ease-out_0.3s_both]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <i className="ph ph-arrow-left" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

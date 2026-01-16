"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  {
    icon: "ph-duotone ph-database",
    title: "1. Information We Collect",
    content:
      "We may collect personal information that you voluntarily provide to us when you register for an account, subscribe to our newsletter, or contact us. This may include your name, email address, and any other information you choose to provide.",
  },
  {
    icon: "ph-duotone ph-gear",
    title: "2. How We Use Your Information",
    content:
      "We use the information we collect to provide, maintain, and improve our services; communicate with you about updates, newsletters, and promotional offers; respond to your comments, questions, and requests; and monitor and analyze trends and usage.",
  },
  {
    icon: "ph-duotone ph-cookie",
    title: "3. Cookies & Tracking",
    content:
      "We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
  },
  {
    icon: "ph-duotone ph-shield-check",
    title: "4. Data Security",
    content:
      "We strive to use commercially acceptable means to protect your personal information, but please remember that no method of transmission over the internet or method of electronic storage is 100% secure.",
  },
  {
    icon: "ph-duotone ph-arrows-clockwise",
    title: "5. Changes to This Policy",
    content:
      "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.",
  },
  {
    icon: "ph-duotone ph-envelope-simple",
    title: "6. Contact Us",
    content:
      "If you have any questions about this Privacy Policy, please contact us at contact@fixtera.dev.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 pt-24 pb-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-[-30%] right-[-15%] w-[55%] h-[55%] bg-gradient-to-tl from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-[100px] animate-pulse-glow delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-full blur-[80px]" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-[fadeIn_0.8s_ease-out]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6 backdrop-blur-sm">
              <i className="ph-duotone ph-shield-check text-lg" />
              <span>Your Data is Protected</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Privacy{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 animate-gradient bg-[length:200%_auto]">
                Policy
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-4">
              At FixTera, we take your privacy seriously. This policy describes
              how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-slate-500">
              <i className="ph ph-calendar-blank mr-2" />
              Last updated: January 13, 2026
            </p>
          </div>

          {/* Policy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] animate-[fadeIn_0.5s_ease-out] hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <i
                      className={`${section.icon} text-2xl text-cyan-400 group-hover:text-cyan-300 transition-colors`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-50 transition-colors">
                    {section.title}
                  </h3>

                  {/* Content */}
                  <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center animate-[fadeIn_0.8s_ease-out_0.6s_both]">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <i className="ph-duotone ph-question text-2xl text-white" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-white font-semibold mb-1">
                  Have questions about your privacy?
                </p>
                <a
                  href="mailto:contact@fixtera.dev"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  <span>contact@fixtera.dev</span>
                  <i className="ph ph-arrow-right" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const values = [
  {
    icon: "ph-duotone ph-rocket",
    title: "Innovation First",
    description:
      "We embrace cutting-edge technologies and methodologies to stay ahead of the curve.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: "ph-duotone ph-book-open-text",
    title: "Quality Content",
    description:
      "Every article is crafted with care, ensuring accuracy, relevance, and practical value.",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    icon: "ph-duotone ph-users-three",
    title: "Community Driven",
    description:
      "We listen to our community and build what developers actually need.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: "ph-duotone ph-code",
    title: "Open Source Spirit",
    description:
      "We believe in sharing knowledge and contributing back to the developer community.",
    gradient: "from-pink-500 to-orange-500",
  },
];

const stats = [
  { value: "10K+", label: "Monthly Readers" },
  { value: "500+", label: "Articles Published" },
  { value: "50+", label: "Tutorial Series" },
  { value: "24/7", label: "Community Support" },
];

const techStack = [
  { name: "React", icon: "ph-duotone ph-atom" },
  { name: "Next.js", icon: "ph-duotone ph-brackets-curly" },
  { name: "TypeScript", icon: "ph-duotone ph-file-ts" },
  { name: "Node.js", icon: "ph-duotone ph-circles-three" },
  { name: "AI/ML", icon: "ph-duotone ph-brain" },
  { name: "Cloud", icon: "ph-duotone ph-cloud" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 pt-24 pb-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-[-30%] right-[-15%] w-[55%] h-[55%] bg-gradient-to-tl from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-[120px] animate-pulse-glow delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-[100px]" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-[fadeIn_0.8s_ease-out]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6 backdrop-blur-sm">
              <i className="ph-duotone ph-sparkle text-lg" />
              <span>Our Story</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-gradient bg-[length:200%_auto]">
                FixTera
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Building the ultimate knowledge hub for the next generation of
              software engineers. We're passionate about making high-quality
              technical knowledge accessible, practical, and up-to-date.
            </p>
          </div>

          {/* Stats Section */}
          <div className="mb-20 animate-[fadeIn_0.8s_ease-out_0.2s_both]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="relative group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 text-center hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Section */}
          <div className="mb-20 animate-[fadeIn_0.8s_ease-out_0.3s_both]">
            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 md:p-12 overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                    <i className="ph-duotone ph-target text-2xl text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Our Mission
                  </h2>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed max-w-4xl">
                  At FixTera, we believe that high-quality technical knowledge
                  should be accessible, practical, and up-to-date. We are
                  dedicated to providing in-depth articles, tutorials, and
                  resources that help developers solve real-world problems and
                  advance their careers. Whether you are debugging a complex
                  issue or architecting a new system, FixTera is here to support
                  your journey.
                </p>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="mb-20">
            <div className="text-center mb-12 animate-[fadeIn_0.8s_ease-out_0.4s_both]">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Our Core Values
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] animate-[fadeIn_0.5s_ease-out] hover:-translate-y-1"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <i className={`${value.icon} text-xl text-white`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-50 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-20 animate-[fadeIn_0.8s_ease-out_0.7s_both]">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-white mb-2">
                Technologies We Cover
              </h2>
              <p className="text-sm text-slate-500">
                Expert content across the modern tech stack
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300"
                >
                  <i
                    className={`${tech.icon} text-lg text-slate-400 group-hover:text-cyan-400 transition-colors`}
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="animate-[fadeIn_0.8s_ease-out_0.8s_both]">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Meet The Team
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                The passionate developers behind FixTera
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 text-center hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_0_60px_rgba(6,182,212,0.1)]">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Avatar */}
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 p-0.5 group-hover:scale-105 transition-transform duration-300">
                      <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                          PD
                        </span>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                      <i className="ph-bold ph-check text-sm text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="text-xl font-bold text-white mb-1">
                    Phuwanat Developer
                  </h3>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-medium mb-3">
                    Founder & Lead Engineer
                  </p>
                  <p className="text-slate-400 text-sm mb-6">
                    Passionate about React, Next.js, and AI Agents. Building the
                    future of developer education.
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3">
                    {["twitter", "github", "linkedin"].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300 hover:-translate-y-1"
                      >
                        <i className={`ph-bold ph-${social}-logo text-lg`} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center animate-[fadeIn_0.8s_ease-out_1s_both]">
            <div className="inline-flex flex-col items-center p-8 rounded-3xl bg-gradient-to-r from-slate-900/80 via-slate-800/50 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-2">
                Ready to level up your skills?
              </h3>
              <p className="text-slate-400 mb-6">
                Join thousands of developers learning with FixTera
              </p>
              <a
                href="/"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              >
                Start Exploring
                <i className="ph ph-arrow-right group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

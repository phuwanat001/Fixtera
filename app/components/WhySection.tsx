"use client";

import React from "react";

const features = [
  {
    icon: "fa-terminal",
    color: "#06b6d4",
    title: "Practical Fixes",
    description:
      "Real-world solutions to the bugs that haunt your codebase at 2 AM.",
    code: "fixBug(issue);",
  },
  {
    icon: "fa-microchip",
    color: "#3b82f6",
    title: "AI-First Approach",
    description:
      "Integrating modern AI tools seamlessly into your daily dev workflow.",
    code: "ai.enhance(code);",
  },
  {
    icon: "fa-bolt",
    color: "#eab308",
    title: "Fast & Clean",
    description:
      "Zero bloat. Optimized content designed for quick consumption.",
    code: "optimize(all);",
  },
  {
    icon: "fa-code-branch",
    color: "#a855f7",
    title: "Open Source",
    description: "We believe in community. All code examples are open for use.",
    code: "git push origin",
  },
];

export default function WhySection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div
        className="absolute top-0 left-0 w-full h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #06b6d4, transparent)",
        }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full -z-10"
        style={{ background: "rgba(6, 182, 212, 0.03)", filter: "blur(120px)" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-sm font-mono text-cyan-400 uppercase tracking-widest mb-6">
            <span className="text-slate-600">&lt;</span>
            why_fixtera
            <span className="text-slate-600">/&gt;</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Why Developers Choose{" "}
            <span className="text-gradient-bold">FixTera</span>
          </h2>
          <p className="text-slate-400 text-lg">
            We cut through the noise. No fluff, just actionable code,
            architecture advice, and industry insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl glass transition-all duration-500 hover:-translate-y-2"
              style={{
                borderColor: `${feature.color}20`,
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.borderColor = `${feature.color}50`;
                target.style.boxShadow = `0 20px 40px ${feature.color}15`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.borderColor = `${feature.color}20`;
                target.style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ background: `${feature.color}15` }}
              >
                <i
                  className={`fas ${feature.icon} text-2xl`}
                  style={{ color: feature.color }}
                ></i>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                {feature.description}
              </p>

              {/* Code snippet */}
              <div className="pt-4 border-t border-slate-800">
                <code
                  className="text-xs font-mono"
                  style={{ color: feature.color }}
                >
                  <span className="text-slate-600">$</span> {feature.code}
                  <span className="animate-pulse">_</span>
                </code>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="#blogs"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors group"
          >
            <span>See how we can help</span>
            <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
          </a>
        </div>
      </div>
    </section>
  );
}

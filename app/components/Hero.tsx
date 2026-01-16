import React from "react";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
      {/* Background Grid */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage: `linear-gradient(to right, rgba(6, 182, 212, 0.03) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(6, 182, 212, 0.03) 1px, transparent 1px)`,
        }}
      ></div>

      {/* Gradient Blur Effects - Enhanced */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full -z-10 animate-pulse-glow"
        style={{ background: "rgba(6, 182, 212, 0.15)", filter: "blur(150px)" }}
      ></div>
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full -z-10"
        style={{ background: "rgba(59, 130, 246, 0.1)", filter: "blur(120px)" }}
      ></div>
      <div
        className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full -z-10"
        style={{
          background: "rgba(139, 92, 246, 0.08)",
          filter: "blur(100px)",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/30 text-sm font-mono text-cyan-400 mb-10 glow-cyan">
          <span className="flex items-center gap-1.5">
            <span className="text-slate-500">&lt;/&gt;</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>FixTera</span>
            <span className="text-cyan-300 font-bold">v0.5</span>
          </span>
        </div>

        {/* Main Heading - Bold Typography with Space Grotesk */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-white mb-8 leading-[1.1]">
          <span className="block">Fix problems.</span>
          <span className="block text-gradient-bold text-glow-cyan">
            Build smarter.
          </span>
          <span className="block">Learn faster.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed font-light">
          A developer-first knowledge hub featuring deep dives into programming,
          AI engineering, and real-world debugging stories.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <a
            href="#blogs"
            className="group w-full sm:w-auto px-8 py-4 rounded-xl gradient-border gradient-border-hover text-white font-bold transition-all duration-300 transform hover:-translate-y-1 glow-cyan-hover flex items-center justify-center gap-2"
          >
            <i className="fas fa-book-open text-cyan-400"></i>
            Start Reading
          </a>
          <a
            href="#tags"
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass border-slate-700 hover:border-cyan-500/50 text-white font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Explore Topics
            <i className="fas fa-arrow-right text-sm opacity-70 group-hover:translate-x-1 transition-transform"></i>
          </a>
        </div>

        {/* Code Snippet - Developer Style */}
        <div className="mt-8 mx-auto max-w-3xl code-block-dev rounded-2xl shadow-2xl overflow-hidden text-left transform hover:scale-[1.02] transition-all duration-500">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-xs text-cyan-400/70 font-mono flex items-center gap-2">
              <i className="fas fa-terminal text-[10px]"></i>
              solver.ts
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                live
              </span>
            </div>
          </div>

          {/* Code Content */}
          <div className="p-6 font-mono text-sm md:text-base overflow-x-auto">
            <div className="space-y-1">
              {/* Line 1 */}
              <div className="flex">
                <span className="w-8 text-slate-600 select-none">1</span>
                <span>
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-cyan-400">fixBug</span>{" "}
                  <span className="text-slate-400">=</span>{" "}
                  <span className="text-yellow-300">(</span>
                  <span className="text-orange-300">issue</span>
                  <span className="text-slate-400">:</span>{" "}
                  <span className="text-green-400">Bug</span>
                  <span className="text-yellow-300">)</span>{" "}
                  <span className="text-purple-400">=&gt;</span>{" "}
                  <span className="text-yellow-300">{"{"}</span>
                </span>
              </div>
              {/* Line 2 */}
              <div className="flex">
                <span className="w-8 text-slate-600 select-none">2</span>
                <span className="pl-4">
                  <span className="text-purple-400">if</span>{" "}
                  <span className="text-blue-300">(</span>
                  <span className="text-orange-300">issue</span>
                  <span className="text-slate-400">.</span>
                  <span className="text-white">isComplex</span>
                  <span className="text-blue-300">)</span>{" "}
                  <span className="text-blue-300">{"{"}</span>
                </span>
              </div>
              {/* Line 3 */}
              <div className="flex bg-cyan-500/5 -mx-6 px-6 border-l-2 border-cyan-400">
                <span className="w-8 text-cyan-400 select-none">3</span>
                <span className="pl-8">
                  <span className="text-purple-400">return</span>{" "}
                  <span className="text-cyan-400">FixTera</span>
                  <span className="text-slate-400">.</span>
                  <span className="text-yellow-400">solve</span>
                  <span className="text-purple-300">(</span>
                  <span className="text-green-400">&apos;instantly&apos;</span>
                  <span className="text-purple-300">)</span>
                  <span className="text-slate-400">;</span>
                </span>
              </div>
              {/* Line 4 */}
              <div className="flex">
                <span className="w-8 text-slate-600 select-none">4</span>
                <span className="pl-4">
                  <span className="text-blue-300">{"}"}</span>
                </span>
              </div>
              {/* Line 5 */}
              <div className="flex">
                <span className="w-8 text-slate-600 select-none">5</span>
                <span className="pl-4">
                  <span className="text-slate-500">
                    {"// Build something amazing"}
                  </span>
                </span>
              </div>
              {/* Line 6 */}
              <div className="flex">
                <span className="w-8 text-slate-600 select-none">6</span>
                <span className="pl-4">
                  <span className="text-purple-400">return</span>{" "}
                  <span className="text-green-400">&apos;Solved!&apos;</span>
                  <span className="text-slate-400">;</span>
                </span>
              </div>
              {/* Line 7 */}
              <div className="flex">
                <span className="w-8 text-slate-600 select-none">7</span>
                <span>
                  <span className="text-yellow-300">{"}"}</span>
                  <span className="text-slate-400">;</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 text-slate-500 animate-float">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <i className="fas fa-chevron-down text-cyan-400/50"></i>
        </div>
      </div>
    </section>
  );
}

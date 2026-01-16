import React from "react";

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] rounded-full -z-10"
        style={{ background: "rgba(6, 182, 212, 0.08)", filter: "blur(150px)" }}
      ></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-3xl p-10 md:p-16 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(139, 92, 246, 0.1) 100%)",
            border: "1px solid rgba(6, 182, 212, 0.2)",
          }}
        >
          {/* Decorative elements */}
          <div
            className="absolute top-0 left-0 w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{
              background: "rgba(6, 182, 212, 0.2)",
              filter: "blur(60px)",
            }}
          ></div>
          <div
            className="absolute bottom-0 right-0 w-48 h-48 rounded-full translate-x-1/3 translate-y-1/3"
            style={{
              background: "rgba(139, 92, 246, 0.15)",
              filter: "blur(80px)",
            }}
          ></div>

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundSize: "30px 30px",
              backgroundImage: `linear-gradient(to right, rgba(6, 182, 212, 0.05) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(6, 182, 212, 0.05) 1px, transparent 1px)`,
            }}
          ></div>

          <div className="relative z-10 text-center">
            {/* Terminal badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-mono text-cyan-400 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-slate-500">npm run</span>
              <span className="text-cyan-300">level-up</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Level up your
              <br />
              <span className="text-gradient-bold">development skills.</span>
            </h2>

            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of developers reading FixTera every week. Stay
              curious, stay sharp, ship faster.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="#blogs"
                className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-cyan-500/25 flex items-center justify-center gap-2"
              >
                <i className="fas fa-rocket"></i>
                Start Reading Now
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl glass border-cyan-500/30 hover:border-cyan-400/60 text-white font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <i className="fab fa-github"></i>
                View on GitHub
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-slate-800/50 flex justify-center gap-12 md:gap-16">
              <div>
                <p className="text-3xl font-bold text-white">10K+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                  Readers
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gradient-bold">50+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                  Articles
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                  Free
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

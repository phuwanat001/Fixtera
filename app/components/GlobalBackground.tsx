"use client";

import React from "react";

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#020617]">
      {/* 1. Large Purple/Magenta Orb (Right) */}
      <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] rounded-full bg-fuchsia-600/20 blur-[100px] mix-blend-screen opacity-60 animate-pulse-glow" />

      {/* 2. Blue Abstract Shape (Left) */}
      <div className="absolute top-[20%] left-[-10%] w-[70vw] h-[70vw] md:w-[500px] md:h-[500px] rounded-full bg-blue-600/20 blur-[80px] mix-blend-screen opacity-50" />

      {/* 3. Horizontal Scanlines (Left) */}
      <div className="absolute top-[10%] left-0 w-1/2 h-[300px] opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, transparent 50%, rgba(6, 182, 212, 0.5) 51%, transparent 52%)",
            backgroundSize: "100% 20px", // Spacing of lines
            maskImage: "linear-gradient(to right, black, transparent)",
            WebkitMaskImage: "linear-gradient(to right, black, transparent)",
          }}
        />
      </div>

      {/* 4. Vertical Equalizer Lines (Middle-Right) */}
      <div className="absolute top-[30%] right-[20%] flex gap-4 opacity-40 transform -rotate-12">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="w-[2px] bg-linear-to-b from-transparent via-purple-400 to-transparent"
            style={{
              height: `${Math.random() * 200 + 100}px`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* 5. Additional Ambient Glows */}
      <div className="absolute bottom-0 left-1/4 w-[40vw] h-[40vw] rounded-full bg-cyan-900/10 blur-[90px]" />
    </div>
  );
}

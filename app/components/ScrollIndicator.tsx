"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isDragging) return; // Don't update while dragging
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDragging]);

  // Handle click on track to scroll to position
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const trackHeight = rect.height;
    const clickPercent = (clickY / trackHeight) * 100;

    // Calculate scroll position
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollTo = (clickPercent / 100) * totalHeight;

    window.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });
  };

  // Handle drag on thumb
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const mouseY = moveEvent.clientY - rect.top;
      const trackHeight = rect.height;
      const percent = Math.max(0, Math.min(100, (mouseY / trackHeight) * 100));

      setScrollProgress(percent);

      // Scroll the page
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollTo = (percent / 100) * totalHeight;
      window.scrollTo({ top: scrollTo });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Section markers
  const sections = [
    { position: 0, label: "Hero" },
    { position: 20, label: "Tags" },
    { position: 40, label: "Blogs" },
    { position: 65, label: "Why" },
    { position: 85, label: "CTA" },
  ];

  return (
    <div
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Track - clickable */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative w-2 h-40 rounded-full cursor-pointer hover:w-3 transition-all duration-200"
        style={{ background: "rgba(51, 65, 85, 0.5)" }}
      >
        {/* Section markers */}
        {sections.map((section, index) => (
          <div
            key={index}
            className="absolute left-1/2 -translate-x-1/2 w-full h-[2px] bg-slate-600"
            style={{ top: `${section.position}%` }}
            title={section.label}
          />
        ))}

        {/* Current position indicator - draggable */}
        <div
          onMouseDown={handleMouseDown}
          className={`absolute left-1/2 -translate-x-1/2 w-4 h-6 rounded-full cursor-grab active:cursor-grabbing transition-all duration-150 ease-out ${
            isDragging ? "scale-110" : ""
          }`}
          style={{
            top: `calc(${Math.min(scrollProgress, 96)}% - 12px)`,
            background: "#3b82f6",
            boxShadow: isDragging
              ? "0 0 12px rgba(59, 130, 246, 0.8)"
              : "0 0 8px rgba(59, 130, 246, 0.5)",
          }}
        />
      </div>
    </div>
  );
}

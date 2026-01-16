import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Fixtera – Admin Panel",
  description: "Admin panel for Fixtera blog management",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500 selection:text-white overflow-hidden font-sans">
      <Script
        src="https://unpkg.com/@phosphor-icons/web"
        strategy="lazyOnload"
      />

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse-slow delay-1000"></div>
        <div className="absolute top-[20%] right-[30%] w-[20%] h-[20%] bg-indigo-600/10 rounded-full blur-[80px] mix-blend-screen opacity-30"></div>
      </div>

      <div className="relative z-10 flex h-full">{children}</div>
    </div>
  );
}

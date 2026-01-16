"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../lib/auth-context";
import { useRouter } from "next/navigation";

type MenuKey = "home" | "blogs" | "tags" | "about";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>("home");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRefs = useRef<{ [key in MenuKey]?: HTMLAnchorElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, signOut, isAdmin } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    router.push("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems: { key: MenuKey; label: string; href: string }[] = [
    { key: "home", label: "Home", href: "/" },
    { key: "blogs", label: "Blogs", href: "/#blog" },
    { key: "tags", label: "Tags", href: "/#tags" },
    { key: "about", label: "About", href: "/#about" },
  ];

  // Update indicator position when activeMenu changes
  useEffect(() => {
    const activeRef = menuRefs.current[activeMenu];
    const container = containerRef.current;
    if (activeRef && container) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeRef.getBoundingClientRect();
      setIndicatorStyle({
        left: activeRect.left - containerRect.left,
        width: activeRect.width,
      });
    }
  }, [activeMenu]);

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50 flex justify-center px-4 pt-4">
        <nav className="w-full max-w-6xl bg-slate-900/80 backdrop-blur-md border border-slate-800/50 rounded-full shadow-lg shadow-black/20 transition-all duration-300">
          <div className="px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0 cursor-pointer group">
                <span className="text-xl md:text-2xl font-bold font-mono tracking-tighter text-white">
                  Fix<span className="text-brand-cyan">Tera</span>
                  <span className="text-brand-blue">.</span>
                </span>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:block">
                <div
                  ref={containerRef}
                  className="relative flex items-baseline space-x-1 lg:space-x-8"
                >
                  {/* Sliding Indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-9 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-full shadow-lg shadow-black/20 transition-all duration-300 ease-out"
                    style={{
                      left: indicatorStyle.left,
                      width: indicatorStyle.width,
                    }}
                  />
                  {menuItems.map((item) => (
                    <a
                      key={item.key}
                      ref={(el) => {
                        menuRefs.current[item.key] = el;
                      }}
                      href={item.href}
                      onClick={() => setActiveMenu(item.key)}
                      className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                        activeMenu === item.key
                          ? "text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA & Mobile Toggle */}
              <div className="flex items-center gap-4">
                <a
                  href="#blog"
                  className="hidden md:inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-brand-blue  transition-all shadow-md hover:shadow-brand-blue/30"
                >
                  Explore
                </a>
                {user ? (
                  <div className="hidden md:block relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          className="w-7 h-7 rounded-full"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                          {user.displayName?.charAt(0) || "U"}
                        </div>
                      )}
                      <span className="text-sm font-medium text-white max-w-[120px] truncate">
                        {user.displayName?.split(" ")[0] || "User"}
                      </span>
                      <i className={`fas fa-chevron-down text-xs text-slate-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`}></i>
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-xl shadow-black/30 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-slate-700/50">
                          <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                        {isAdmin && (
                          <a
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                          >
                            <i className="fas fa-cog w-4"></i>
                            Admin Panel
                          </a>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                          <i className="fas fa-sign-out-alt w-4"></i>
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href="/login"
                    className="hidden md:inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-brand-blue bg-blue-600 transition-all shadow-md hover:shadow-brand-blue/30"
                  >
                    Sign in
                  </a>
                )}

                {/* Mobile menu button */}
                <div className="flex md:hidden">
                  <button
                    type="button"
                    onClick={toggleMenu}
                    className="inline-flex items-center justify-center p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
                  >
                    <span className="sr-only">Open main menu</span>
                    <i className="fas fa-bars text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Slide-in Menu (Drawer) */}
      {/* Overlay */}
      <div
        onClick={toggleMenu}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-slate-900 border-l border-slate-800 z-[70] shadow-2xl rounded-l-3xl md:hidden flex flex-col transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex justify-between items-center border-b border-slate-800">
          <span className="text-xl font-bold font-mono tracking-tighter text-white">
            Fix<span className="text-brand-cyan">Tera</span>.
          </span>
          <button
            onClick={toggleMenu}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="relative">
            {/* Left Sliding Indicator Bar */}
            <div
              className="absolute left-0 w-1 h-12 bg-brand-cyan rounded-full shadow-lg shadow-brand-cyan/30 transition-all duration-300 ease-out"
              style={{
                top: `${
                  menuItems.findIndex((item) => item.key === activeMenu) * 56
                }px`,
              }}
            />
            <div className="space-y-2 pl-4">
              {menuItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setActiveMenu(item.key)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                    activeMenu === item.key
                      ? "text-white bg-slate-800/60 backdrop-blur-sm border border-slate-700/50"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                  }`}
                >
                  <i
                    className={`fas ${
                      item.key === "home"
                        ? "fa-home"
                        : item.key === "blogs"
                        ? "fa-newspaper"
                        : item.key === "tags"
                        ? "fa-tags"
                        : "fa-info-circle"
                    } w-5 ${
                      activeMenu === item.key
                        ? "text-brand-cyan"
                        : "text-slate-500"
                    }`}
                  ></i>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-950/30 rounded-bl-3xl">
          <a
            href="/blog"
            className="block w-full text-center px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-90 transition-opacity shadow-lg"
          >
            Explore Blogs
          </a>
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {user.displayName?.charAt(0) || "U"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              {isAdmin && (
                <a href="/admin" className="block w-full text-center px-5 py-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors">
                  Admin Panel
                </a>
              )}
              <button onClick={handleSignOut} className="block w-full text-center px-5 py-3 rounded-xl font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors">
                Sign out
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="block w-full text-center px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-90 transition-opacity shadow-lg"
            >
              Login
            </a>
          )}
          <p className="text-center text-xs text-slate-600 mt-4">
            v2.0.1 &copy; FixTera
          </p>
        </div>
      </div>
    </>
  );
}

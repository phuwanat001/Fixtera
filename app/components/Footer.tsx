import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/"
              className="text-2xl font-bold font-mono tracking-tighter text-white"
            >
              Fix<span className="text-cyan-400">Tera</span>.
            </Link>
            <p className="mt-4 text-slate-500 text-sm">
              Building the knowledge base for the next generation of software
              engineers.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Content</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Latest Posts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Snippets
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Topics</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  JavaScript
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  AI & ML
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  DevOps
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="/about"
                  className="hover:text-blue-500 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-blue-500 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-blue-500 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-sm">
            &copy; 2024 FixTera. All rights reserved.
          </p>
          <div className="flex items-center gap-2 mt-4 md:mt-0 text-slate-600 text-sm">
            <span>Designed with and TailwindCSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

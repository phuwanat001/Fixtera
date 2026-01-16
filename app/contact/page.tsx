"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const contactInfo = [
  {
    icon: "ph-duotone ph-envelope-simple",
    title: "Email Us",
    value: "contact@fixtera.dev",
    description: "We'll respond within 24 hours",
    color: "cyan",
  },
  {
    icon: "ph-duotone ph-map-pin",
    title: "Location",
    value: "Bangkok, Thailand",
    description: "GMT+7 Timezone",
    color: "blue",
  },
  {
    icon: "ph-duotone ph-chat-circle-dots",
    title: "Social",
    value: "@fixtera",
    description: "Follow us for updates",
    color: "purple",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 pt-24 pb-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-[100px] animate-pulse-glow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[45%] h-[45%] bg-gradient-to-tl from-purple-500/15 via-blue-500/10 to-transparent rounded-full blur-[100px] animate-pulse-glow delay-1000" />
          <div className="absolute top-1/3 right-1/4 w-[30%] h-[30%] bg-gradient-to-r from-cyan-500/10 to-transparent rounded-full blur-[80px] animate-float" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-[fadeIn_0.8s_ease-out]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 backdrop-blur-sm">
              <i className="ph-duotone ph-chat-teardrop-dots text-lg" />
              <span>Get in Touch</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Contact{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 animate-gradient bg-[length:200%_auto]">
                Us
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Have a question, feedback, or just want to say hello? We'd love to
              hear from you. Fill out the form below or reach us directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] animate-[fadeIn_0.5s_ease-out] hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${info.color}-500/20 to-${info.color}-600/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                      style={{
                        background: `linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(59,130,246,0.1) 100%)`,
                      }}
                    >
                      <i
                        className={`${info.icon} text-2xl text-cyan-400 group-hover:text-cyan-300 transition-colors`}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">
                        {info.title}
                      </p>
                      <p className="text-white font-semibold mb-1">
                        {info.value}
                      </p>
                      <p className="text-xs text-slate-500">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div className="pt-4">
                <p className="text-sm text-slate-500 mb-4">Follow us</p>
                <div className="flex gap-3">
                  {["twitter", "github", "discord", "linkedin"].map(
                    (social, i) => (
                      <a
                        key={social}
                        href="#"
                        className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300 hover:-translate-y-1"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <i className={`ph-bold ph-${social}-logo text-lg`} />
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 animate-[fadeIn_0.6s_ease-out_0.2s_both]">
              <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl">
                {/* Form glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur opacity-20" />

                <div className="relative z-10">
                  {submitted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16 animate-[fadeIn_0.5s_ease-out]">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-green-500/25 animate-[bounceIn_0.5s_ease-out]">
                        <i className="ph-bold ph-check text-3xl text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        Message Sent!
                      </h3>
                      <p className="text-slate-400 mb-6 max-w-sm">
                        Thank you for reaching out. We'll get back to you within
                        24 hours.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                      >
                        <i className="ph ph-arrow-left" />
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div className="relative">
                          <label className="block text-sm font-medium text-slate-400 mb-2">
                            Name
                          </label>
                          <div
                            className={`relative rounded-xl transition-all duration-300 ${
                              focusedField === "name"
                                ? "ring-2 ring-cyan-500/50"
                                : ""
                            }`}
                          >
                            <i className="ph ph-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              onFocus={() => setFocusedField("name")}
                              onBlur={() => setFocusedField(null)}
                              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="relative">
                          <label className="block text-sm font-medium text-slate-400 mb-2">
                            Email
                          </label>
                          <div
                            className={`relative rounded-xl transition-all duration-300 ${
                              focusedField === "email"
                                ? "ring-2 ring-cyan-500/50"
                                : ""
                            }`}
                          >
                            <i className="ph ph-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              onFocus={() => setFocusedField("email")}
                              onBlur={() => setFocusedField(null)}
                              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          Subject
                        </label>
                        <div
                          className={`relative rounded-xl transition-all duration-300 ${
                            focusedField === "subject"
                              ? "ring-2 ring-cyan-500/50"
                              : ""
                          }`}
                        >
                          <i className="ph ph-chat-circle-text absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                subject: e.target.value,
                              })
                            }
                            onFocus={() => setFocusedField("subject")}
                            onBlur={() => setFocusedField(null)}
                            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                            placeholder="How can we help?"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          Message
                        </label>
                        <div
                          className={`relative rounded-xl transition-all duration-300 ${
                            focusedField === "message"
                              ? "ring-2 ring-cyan-500/50"
                              : ""
                          }`}
                        >
                          <textarea
                            required
                            rows={5}
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                message: e.target.value,
                              })
                            }
                            onFocus={() => setFocusedField("message")}
                            onBlur={() => setFocusedField(null)}
                            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                            placeholder="Tell us more about your question or feedback..."
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98]"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <>
                              <i className="ph ph-circle-notch animate-spin text-xl" />
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <i className="ph ph-paper-plane-tilt text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

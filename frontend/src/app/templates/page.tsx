"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiMock } from "../../utils/apiMock";
import { 
  FileText, ArrowRight, Palette, Layout, Settings, 
  Terminal, ShieldCheck, Sparkles, Check, Smartphone, Monitor
} from "lucide-react";

export default function TemplatesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customizerTheme, setCustomizerTheme] = useState<"modern" | "minimal" | "corporate" | "developer">("modern");
  const [customizerColor, setCustomizerColor] = useState("#dc2626"); // Default red accent
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!apiMock.getCurrentUser());

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const themeDetails = {
    modern: { name: "Modern Glow", desc: "Glowing accent cards, liquid glass effects, and micro-shadows." },
    minimal: { name: "Classic Minimalist", desc: "Monochrome borders, serif header typography, and ample breathing room." },
    corporate: { name: "Executive Corporate", desc: "Professional flat panels, clean rows, and trustworthy navy layouts." },
    developer: { name: "Terminal Code", desc: "Monospace console outputs, green prompts, and retro code frames." }
  };

  const colors = [
    { value: "#dc2626", name: "Crimson Red" },
    { value: "#2563eb", name: "Royal Blue" },
    { value: "#10b981", name: "Emerald Green" },
    { value: "#f59e0b", name: "Amber Orange" },
    { value: "#8b5cf6", name: "Grape Purple" },
    { value: "#ec4899", name: "Hot Pink" }
  ];

  return (
    <div className="relative min-h-screen w-full text-white bg-transparent select-none">
      
      {/* Pinned Cinematic Background Image */}
      <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden bg-[#030304]">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/Gemini_Generated_Image_fl7uqwfl7uqwfl7u.png')",
            filter: "contrast(1.02) saturate(1.02) brightness(1.3) blur(0px)",
            opacity: 0.65,
          }}
        />
        
        {/* Floating Liquid Glass Refraction Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="liquid-glass-blob w-72 h-72 top-[12%] left-[8%] opacity-[0.65]" />
          <div className="liquid-glass-blob w-[450px] h-[450px] bottom-[8%] right-[4%] opacity-[0.55]" style={{ animationDelay: "-6s", animationDuration: "36s" }} />
          <div className="liquid-glass-blob w-80 h-80 top-[48%] right-[22%] opacity-[0.45]" style={{ animationDelay: "-12s", animationDuration: "30s" }} />
        </div>

        {/* Cinematic readability gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/10 to-black/50 pointer-events-none" />
        
        {/* Left-side dark radial shadow for legibility */}
        <div className="absolute top-[5%] left-[-15%] w-[70%] h-[75%] bg-black/35 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Unified Dynamic Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/85 backdrop-blur-md border-b border-black/10 py-1.5 shadow-md" 
          : "bg-white/70 backdrop-blur-md border-b border-black/5 py-2.5 shadow-sm"
      }`}>
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-serif text-3xl tracking-normal text-black hover:text-neutral-800 transition-colors duration-300"
          >
            hire.me
          </Link>

          {/* Centered Menu Links */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 text-[14px] font-extrabold uppercase tracking-widest transition-colors duration-300 text-black/80">
            <Link 
              href="/#pricing" 
              className="transition-colors duration-300 hover:text-black"
            >
              Pricing
            </Link>
            <Link 
              href="/why-us" 
              className="transition-colors duration-300 hover:text-black"
            >
              Why Us
            </Link>
            <Link 
              href="/faq" 
              className="transition-colors duration-300 hover:text-black"
            >
              FAQ
            </Link>
            <Link 
              href="/analytics" 
              className="transition-colors duration-300 hover:text-black"
            >
              Analytics
            </Link>
          </div>

          {/* Actions (Login & Get Started) */}
          <div className="flex items-center gap-4">
            <Link 
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="hidden sm:block text-[14px] font-extrabold uppercase tracking-widest text-black/80 hover:text-black transition-colors duration-300"
            >
              Login
            </Link>
            <Link 
              href="/onboarding"
              className="h-7 px-4 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-all duration-300 hover:scale-105 active:scale-95 text-center flex items-center justify-center shadow-md font-bold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-24">
        
        {/* Page Header */}
        <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-mono text-[#dc2626] font-bold mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse" />
            <span>Profile Customization</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Personalize Your Brand
          </h1>
          <p className="text-sm md:text-base text-neutral-305 max-w-2xl mx-auto leading-relaxed">
            Choose layout designs built to impress recruiters. Align your digital presence with your industry—from software engineers to design agency heads.
          </p>
        </div>

        {/* Interactive Customizer Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Settings Console (Col 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <div className="p-6 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md flex flex-col gap-6">
              
              {/* Option: Choose Layout */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 font-mono">
                  1. Choose Layout Theme
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  {(["modern", "minimal", "corporate", "developer"] as const).map((th) => (
                    <button
                      key={th}
                      onClick={() => setCustomizerTheme(th)}
                      className={`h-11 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 ${
                        customizerTheme === th 
                          ? "bg-white text-neutral-950 border-white shadow-lg shadow-white/10" 
                          : "border-white/5 bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {th === "developer" && <Terminal className="w-3.5 h-3.5" />}
                      <span>{th}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option: Choose Accent Color */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 font-mono">
                  2. Choose Accent Color
                </span>
                
                <div className="flex flex-wrap gap-2.5">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setCustomizerColor(color.value)}
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {customizerColor === color.value && (
                        <Check className="w-4.5 h-4.5 text-white bg-black/35 rounded-full p-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization stats checklist */}
              <div className="flex flex-col gap-3.5 border-t border-white/5 pt-4 text-xs font-medium text-neutral-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fully mobile and responsive CSS layout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Configurable custom domain tags (e.g. hire.me/alex)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fast, optimized PDF downloads generation</span>
                </div>
              </div>

            </div>
          </div>

          {/* Sandbox Live Preview (Col 7) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md p-6 rounded-3xl border border-white/10 bg-neutral-950/50 backdrop-blur-xl shadow-2xl flex flex-col gap-4 text-left relative overflow-hidden transition-all duration-300 min-h-[280px] justify-between">
              
              <div className="absolute top-4 right-4 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded text-[8px] uppercase tracking-widest text-neutral-400 font-mono">
                Live Preview
              </div>

              {/* Modern Theme Card */}
              {customizerTheme === "modern" && (
                <div className="flex flex-col gap-5 justify-between h-full pt-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-900 border-2" style={{ borderColor: customizerColor }}>
                        <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150" alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-white">Alex Rivera</span>
                        <span className="text-xs font-semibold" style={{ color: customizerColor }}>{themeDetails.modern.name}</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">{themeDetails.modern.desc}</p>
                  </div>
                  <button 
                    className="h-10 rounded-xl text-xs font-bold text-neutral-950 active:scale-95 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                    style={{ backgroundColor: customizerColor, color: "#ffffff" }}
                  >
                    <FileText className="w-3.5 h-3.5" /> View Resume
                  </button>
                </div>
              )}

              {/* Minimalist Theme Card */}
              {customizerTheme === "minimal" && (
                <div className="flex flex-col gap-4 justify-between h-full font-serif pt-4">
                  <div className="flex flex-col gap-3">
                    <h4 className="text-2xl font-light text-neutral-900 bg-white px-3 py-1 self-start rounded font-bold">Alex Rivera</h4>
                    <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest" style={{ color: customizerColor }}>{themeDetails.minimal.name}</span>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">{themeDetails.minimal.desc}</p>
                  </div>
                  <button className="h-10 rounded-lg border border-neutral-350 text-xs font-bold font-sans hover:bg-neutral-900 hover:text-white transition-all">
                    View PDF Document
                  </button>
                </div>
              )}

              {/* Corporate Theme Card */}
              {customizerTheme === "corporate" && (
                <div className="flex flex-col gap-4 justify-between h-full pt-4">
                  <div className="flex flex-col gap-4">
                    <div className="p-4 rounded-xl bg-white border border-neutral-200 text-neutral-900 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{themeDetails.corporate.name}</span>
                        <span className="text-[9px] text-neutral-400 uppercase tracking-widest mt-0.5">Corporate Theme</span>
                      </div>
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: customizerColor }} />
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">{themeDetails.corporate.desc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-extrabold uppercase tracking-widest">
                    <button className="h-10 rounded bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">Resume</button>
                    <button className="h-10 rounded border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 transition-colors">vCard</button>
                  </div>
                </div>
              )}

              {/* Terminal Code Theme Card */}
              {customizerTheme === "developer" && (
                <div className="flex flex-col gap-4 justify-between h-full font-mono text-emerald-450 pt-4" style={{ color: customizerColor }}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 border-b border-white/5 pb-2">
                      <span>guest@hire:~/{customizerTheme}</span>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: customizerColor }} />
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-neutral-300">&gt; cat theme_details.txt</span>
                      <span className="text-white mt-1 leading-relaxed text-[11px]">{themeDetails.developer.desc}</span>
                    </div>
                  </div>
                  <button className="h-9 rounded border text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/5 transition-colors" style={{ borderColor: customizerColor, color: customizerColor }}>
                    $ cat resume.pdf
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Feature Grid: Design details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md flex flex-col gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-rose-500">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Dynamic Palettes</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Every layout has a matching curated color palette. Change colors in seconds to align your profile with your brand guidelines.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md flex flex-col gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-sky-400">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Grid Customization</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Showcase exactly what matters to your role. Easily toggle project galleries, testimonial boards, or custom repositories.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md flex flex-col gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-purple-400">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Personal Settings</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Enable SEO search indexing, private links, password protection, and custom favicon branding directly from your dashboard console.
            </p>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-neutral-950/60 via-neutral-900/60 to-black/60 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 max-w-lg">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest bg-white/15 text-white font-mono font-bold self-center md:self-start flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-rose-550" /> Premium Templates
            </span>
            <h3 className="text-2xl font-bold text-white">Create Your Link Now</h3>
            <p className="text-xs text-neutral-350 leading-relaxed">
              Set up your profile once, choose your favorite layout, and share a single link that stays beautifully updated forever.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
            <Link 
              href="/onboarding"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 transition-all text-center"
            >
              Get Started Free
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

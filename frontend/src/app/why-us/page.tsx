"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiMock } from "../../utils/apiMock";
import { Layers, User } from "lucide-react";

export default function WhyUsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
              className="transition-colors duration-300 text-black font-black"
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
        
        {/* Features Content (What We Provide) */}
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-mono text-red-500 font-bold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>Features Overview</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              What We Provide
            </h1>
            <p className="text-sm md:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              A comprehensive credentials stack built directly into one permanent, shareable profile. Everything you need to showcase your work and details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
            {/* Left Column: Every Project Can Include */}
            <div className="flex flex-col gap-6 p-8 rounded-3xl border border-white/5 bg-neutral-950/45 backdrop-blur-md">
              <div className="flex items-center gap-3 pb-2">
                <Layers className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-bold text-white">Every Project Can Include</h3>
              </div>
              
              <ul className="flex flex-col gap-5 text-xs text-neutral-350">
                {[
                  { title: "Demo Video Preview", desc: "Let recruiters watch walk-through videos of your product directly on the page." },
                  { title: "GitHub Repository", desc: "Provide direct access to your clean code repository with a single click." },
                  { title: "Live Project Link", desc: "Allow hiring managers to test and experience your production-ready live builds." },
                  { title: "Up to 2 Screenshots", desc: "Showcase high-resolution interfaces and visual proof of what you've built." },
                  { title: "Technology Stack", desc: "Display clear stack tags showing the exact frameworks, databases, and tools used." },
                  { title: "Project Description", desc: "Provide clean details explaining the context, challenges, and results." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0 animate-pulse" />
                    <div className="flex flex-col gap-0.5">
                      <strong className="text-white text-sm font-semibold">{item.title}</strong>
                      <span className="text-xs text-neutral-400 font-medium leading-relaxed">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Your Profile Can Include */}
            <div className="flex flex-col gap-6 p-8 rounded-3xl border border-white/5 bg-neutral-950/45 backdrop-blur-md">
              <div className="flex items-center gap-3 pb-2">
                <User className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-bold text-white">Your Profile Can Include</h3>
              </div>

              <ul className="flex flex-col gap-5 text-xs text-neutral-350">
                {[
                  { title: "Resume Upload", desc: "Always host and serve the latest version of your PDF resume from one place." },
                  { title: "LinkedIn Profile Preview", desc: "Integrate your LinkedIn profile with directly accessible metadata." },
                  { title: "GitHub Profile Preview", desc: "Display your repos, code commits, and contribution chart automatically." },
                  { title: "X/Twitter Profile Preview", desc: "Embed an interactive feed of your professional updates and insights." },
                  { title: "Personal Website Link", desc: "Provide a quick outbound reference to custom personal landing pages." },
                  { title: "Featured Projects", desc: "Showcase up to three of your best projects featuring videos and repositories." },
                  { title: "Portfolio Demo Videos", desc: "Embed introduction video clips and visual highlights of your designs." },
                  { title: "Contact Information", desc: "Allow hiring managers to email you or save your contact card (.vcf) directly." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <strong className="text-white text-sm font-semibold">{item.title}</strong>
                      <span className="text-xs text-neutral-400 font-medium leading-relaxed">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 md:px-12 bg-neutral-950/60 backdrop-blur-md border-t border-white/5 text-neutral-400 text-xs select-none">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-sm text-white tracking-tight">hire.me</span>
            <span className="text-[10px] text-neutral-600 font-mono">© 2026 SaaS platform</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[11px] font-semibold uppercase tracking-wider">
            <Link href="/why-us" className="hover:text-white transition-colors">Why Us</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link>
            <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

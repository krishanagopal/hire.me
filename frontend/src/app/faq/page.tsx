"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiMock } from "../../utils/apiMock";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Keep first one open by default

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

  const faqs = [
    {
      q: "How is Hire.me different from a traditional resume PDF?",
      a: "A traditional resume tells recruiters what you've done, but it cannot show them. A PDF cannot play video walkthroughs, display active GitHub repository stats, or host interactive links. Hire.me unites your resume, code repositories, design portfolios, and social accounts in a single, high-fidelity profile page."
    },
    {
      q: "Do I still need to upload my resume?",
      a: "Yes! Hire.me hosts your latest resume PDF right on your page. Recruiters can preview it directly in their browser or download it in one click, meaning you still serve standard documents alongside interactive visual proof."
    },
    {
      q: "Can I customize the visual layout of my profile?",
      a: "Absolutely. Hire.me provides multiple layout styles matching different industry tones—ranging from a sleek developer console style for software engineers, to a clean minimalist design for UX/UI designers, and professional executive layouts for managers."
    },
    {
      q: "How do analytics work on Hire.me?",
      a: "You get a real-time analytics dashboard tracking page views, resume downloads, GitHub click-throughs, and contact link events. This lets you know exactly when hiring managers are reviewing your profile and which parts of your showcase interest them the most."
    },
    {
      q: "Is there a limit to the number of projects I can showcase?",
      a: "Free plans allow you to host your credentials profile and showcase up to two featured projects. Upgrading to our Pro plan ($5/mo) unlocks unlimited project hosting, advanced cover designs, custom theme customizations, and priority analytics breakdowns."
    },
    {
      q: "How do recruiters save my contact details?",
      a: "Recruiters can download a pre-configured contact card (.vcf file) directly to their mobile or desktop address book in one tap, or click our direct email buttons to get in touch instantly without leaving the page."
    }
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

      {/* Unified Navigation Bar */}
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
              className="transition-colors duration-300 text-black font-black"
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

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link 
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="hidden sm:block text-[14px] font-extrabold uppercase tracking-widest text-black/80 hover:text-black transition-colors duration-300"
            >
              Login
            </Link>
            <Link 
              href="/register"
              className="h-7 px-4 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-all duration-300 hover:scale-105 active:scale-95 text-center flex items-center justify-center shadow-md font-bold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-36 pb-24">
        
        <div className="flex flex-col gap-14">
          {/* Header */}
          <div className="flex flex-col gap-3 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-mono text-red-500 font-bold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>Questions & Answers</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-sm text-neutral-350 leading-relaxed">
              Everything you need to know about setting up your profile, showcases, analytics, and custom templates.
            </p>
          </div>

          {/* FAQ Accordion List (Typographic & Premium) */}
          <div className="flex flex-col border-t border-white/10 mt-4 bg-neutral-950/40 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/5">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx}
                  className={`transition-all duration-300 ${
                    isOpen ? "py-6" : "py-5"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center gap-6 text-left group cursor-pointer focus:outline-none"
                  >
                    <span className="text-base md:text-lg font-bold text-white group-hover:text-red-500 transition-colors duration-300">
                      {faq.q}
                    </span>
                    <span className="text-neutral-400 group-hover:text-red-500 transition-colors shrink-0">
                      {isOpen ? <span className="text-red-500"><ChevronUp className="w-5 h-5" /></span> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen ? "max-h-[300px] opacity-100 mt-3.5" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-xs md:text-sm text-neutral-400 leading-relaxed max-w-3xl">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
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

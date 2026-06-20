"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { apiMock } from "../utils/apiMock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Check, ArrowRight, ExternalLink, Eye, Download, MousePointer, 
  User, Sparkles, Smartphone, Monitor, MapPin, Award, Terminal, 
  FileText, Globe, ChevronDown, ChevronUp, Briefcase, HelpCircle, 
  Layers, Share2, Shield, Heart, Zap, Code, GraduationCap, Palette,
  Presentation, Rocket
} from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Custom interactive landing page states
  const [showDemoNotification, setShowDemoNotification] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  


  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run cursor tracking on fine-pointer devices (desktop)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let glowX = 0;
    let glowY = 0;
    let hasMoved = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        document.body.classList.add("cursor-active");
      }

      if (dot) {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
      }
    };

    const tick = () => {
      // Smooth interpolation (easing)
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;

      if (ring) {
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
      }

      if (glow) {
        glow.style.left = `${glowX}px`;
        glow.style.top = `${glowY}px`;
      }

      requestAnimationFrame(tick);
    };

    const handleMouseLeave = () => {
      document.body.classList.remove("cursor-active");
    };

    const handleMouseEnter = () => {
      if (hasMoved) {
        document.body.classList.add("cursor-active");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    
    const animId = requestAnimationFrame(tick);

    // Event delegation on mouseover to handle hover states on all interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") || 
        target.closest('[role="button"]') ||
        target.classList.contains("cursor-pointer") ||
        target.closest(".cursor-pointer");

      if (isInteractive) {
        document.body.classList.add("cursor-hovering");
      } else {
        document.body.classList.remove("cursor-hovering");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animId);
      document.body.classList.remove("cursor-active", "cursor-hovering");
    };
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await apiMock.getCurrentUser();
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    };
    checkAuth();

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Initialize GSAP ScrollTrigger and link scroll to section fade-ins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Smooth reveal fade-ins for content sections
      const sections = [
        "#hero-section", "#social-proof", "#problem-section", 
        "#qr-section", "#why-section", "#testimonials-section", 
        "#pricing-section", "#final-cta"
      ];

      sections.forEach((secId) => {
        gsap.fromTo(secId, 
          { 
            opacity: 0, 
            y: 80,
            filter: "blur(16px)",
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: secId,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

    }, scrollWrapperRef);

    return () => ctx.revert();
  }, []);

  // Theme layout helper description
  const themeDetails = {
    modern: { name: "Modern Glow", desc: "Glowing accent cards, liquid glass effects, and micro-shadows." },
    minimal: { name: "Classic Minimalist", desc: "Monochrome borders, serif header typography, and ample breathing room." },
    corporate: { name: "Executive Corporate", desc: "Professional flat panels, clean rows, and trustworthy navy layouts." },
    developer: { name: "Terminal Code", desc: "Monospace console outputs, green prompts, and retro code frames." }
  };



  return (
    <div 
      className="relative min-h-screen w-full text-white bg-transparent select-none" 
      ref={scrollWrapperRef}
    >
      
      {/* Pinned Cinematic Background Image */}
      <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden bg-[#030304]">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/samurai_bg.jpg')",
            filter: "contrast(1.05) saturate(1.1) brightness(0.9) blur(0px)",
            opacity: 0.85,
          }}
        />
        
        {/* Floating Liquid Glass Refraction Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="liquid-glass-blob w-72 h-72 top-[12%] left-[8%] opacity-[0.65]" />
          <div className="liquid-glass-blob w-[450px] h-[450px] bottom-[8%] right-[4%] opacity-[0.55]" style={{ animationDelay: "-6s", animationDuration: "36s" }} />
          <div className="liquid-glass-blob w-80 h-80 top-[48%] right-[22%] opacity-[0.45]" style={{ animationDelay: "-12s", animationDuration: "30s" }} />
        </div>

        {/* Cinematic readability gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70 pointer-events-none" />
        
        {/* Left-side dark radial shadow specifically under the hero text for maximum legibility */}
        <div className="absolute top-[5%] left-[-15%] w-[70%] h-[75%] bg-black/40 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Unified Dynamic Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-500 ease-out ${
        isScrolled || isMobileMenuOpen
          ? "bg-black/50 backdrop-blur-lg border-b border-white/10 py-3 md:py-3 text-white shadow-2xl shadow-black/40" 
          : "bg-transparent py-4 md:py-6 text-white"
      }`}>
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-serif text-3xl tracking-normal text-white hover:text-neutral-200 transition-colors duration-300"
          >
            hire.me
          </Link>

          {/* Centered Menu Links */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 text-[14px] font-extrabold uppercase tracking-widest text-white/90 transition-colors duration-300">
            <a 
              href="#pricing" 
              className="hover:text-white transition-colors duration-300"
            >
              Pricing
            </a>
            <Link 
              href="/why-us" 
              className="hover:text-white transition-colors duration-300"
            >
              Why Us
            </Link>
            <Link 
              href="/faq" 
              className="hover:text-white transition-colors duration-300"
            >
              FAQ
            </Link>
            <Link 
              href={currentUser?.onboardingCompleted ? "/dashboard" : "/onboarding"} 
              className="hover:text-white transition-colors duration-300"
            >
              Analytics
            </Link>
          </div>

          {/* Actions (Login & Get Started) */}
          <div className="flex items-center gap-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={async () => {
                      await apiMock.logout();
                      setIsLoggedIn(false);
                      setCurrentUser(null);
                    }}
                    className="text-[14px] font-extrabold uppercase tracking-widest text-white/80 hover:text-white cursor-pointer transition-colors duration-300"
                  >
                    Logout
                  </button>
                  {currentUser?.onboardingCompleted ? (
                    <Link 
                      href="/dashboard"
                      className="h-7 px-4 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-all duration-300 hover:scale-105 active:scale-95 text-center flex items-center justify-center shadow-md"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link 
                      href="/onboarding"
                      className="h-7 px-4 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-all duration-300 hover:scale-105 active:scale-95 text-center flex items-center justify-center shadow-md"
                    >
                      Get Started
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-[14px] font-extrabold uppercase tracking-widest text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup"
                    className="h-7 px-4 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-all duration-300 hover:scale-105 active:scale-95 text-center flex items-center justify-center shadow-md"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              {isLoggedIn ? (
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-11 h-11 rounded-full bg-neutral-800/80 border border-white/10 flex items-center justify-center text-white focus:outline-none hover:bg-neutral-700 transition-colors"
                  aria-label="Toggle user menu"
                >
                  <User className="w-5 h-5 text-neutral-300" />
                </button>
              ) : (
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-11 h-11 flex items-center justify-center text-white/80 hover:text-white focus:outline-none"
                  aria-label="Toggle mobile menu"
                >
                  <div className="space-y-1.5 flex flex-col items-center justify-center w-full h-full">
                    <span className={`block w-6 h-[2px] bg-current transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-[8px]" : ""}`}></span>
                    <span className={`block w-6 h-[2px] bg-current transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
                    <span className={`block w-6 h-[2px] bg-current transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-[8px]" : ""}`}></span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        <div 
          className={`absolute top-full left-0 right-0 w-full md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[500px] opacity-100 visible" : "max-h-0 opacity-0 invisible"}`}
        >
          <div className="relative z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 shadow-2xl flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <Link 
                  href={currentUser?.onboardingCompleted ? "/dashboard" : "/onboarding"} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center h-12 text-lg font-semibold text-white/90 hover:text-white active:bg-white/5 rounded-lg px-3 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/settings" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center h-12 text-lg font-semibold text-white/90 hover:text-white active:bg-white/5 rounded-lg px-3 transition-colors"
                >
                  Settings
                </Link>
                <div className="h-[1px] w-full bg-white/10 my-2" />
                <button 
                  onClick={async () => {
                    await apiMock.logout();
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                    setIsMobileMenuOpen(false);
                  }} 
                  className="flex items-center h-12 text-lg font-semibold text-rose-400 hover:text-rose-300 active:bg-rose-500/10 rounded-lg px-3 text-left transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="#what-recruiters-see" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center h-12 text-[15px] font-bold tracking-wide uppercase text-white/80 active:bg-white/5 rounded-lg px-3">Recruiters View</Link>
                <Link href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center h-12 text-[15px] font-bold tracking-wide uppercase text-white/80 active:bg-white/5 rounded-lg px-3">Pricing</Link>
                <Link href="/why-us" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center h-12 text-[15px] font-bold tracking-wide uppercase text-white/80 active:bg-white/5 rounded-lg px-3">Why Us</Link>
                <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center h-12 text-[15px] font-bold tracking-wide uppercase text-white/80 active:bg-white/5 rounded-lg px-3">FAQ</Link>
                <div className="h-[1px] w-full bg-white/10 my-3" />
                <div className="flex flex-col gap-3 px-3">
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="flex items-center justify-center h-12 rounded-xl border border-white/20 bg-transparent text-white font-bold text-base hover:bg-white/5 active:scale-[0.98] transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="flex items-center justify-center h-12 rounded-xl bg-white text-neutral-950 font-bold text-base shadow-lg shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Backdrop for outside click */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 top-[72px] bg-black/60 backdrop-blur-sm z-[90] md:hidden animate-in fade-in duration-300" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
        )}
      </header>

      {/* 1. HERO SECTION */}
      <section 
        id="hero-section"
        className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-start md:min-h-screen px-6 md:px-12 lg:px-24 pt-[96px] md:pt-[104px] pb-[48px] md:pb-12 w-full max-w-7xl mx-auto"
      >
        <div className="flex flex-col items-start text-left gap-6 md:gap-4 w-full max-w-2xl mx-auto md:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Mobile Badge */}
          <div className="md:hidden inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold text-neutral-100 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-xl shadow-black/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse" />
            <span>One Link. Everything You Need.</span>
          </div>

          {/* Desktop Badge */}
          <div className="hidden md:inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-neutral-100 text-shadow-sub">
            <span className="w-6 h-[1px] bg-[#dc2626]" />
            <span>One Link. Everything You Need.</span>
          </div>

          {/* Mobile Title */}
          <h1 
            className="md:hidden font-normal text-white leading-[1.2] text-[clamp(2.34rem,7.8vw,3.51rem)]"
            style={{ fontFamily: 'var(--font-cursive), serif' }}
          >
            <span className="text-shadow-hero drop-shadow-md">Your Entire</span><br />
            <span className="text-shadow-hero drop-shadow-md">Professional Identity.</span><br />
            <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              One Link.
            </span>
          </h1>

          {/* Desktop Title */}
          <h1 
            className="hidden md:block text-4xl md:text-7xl font-normal leading-[1.1] text-white"
            style={{ fontFamily: 'var(--font-cursive), serif' }}
          >
            <span className="text-shadow-hero drop-shadow-lg">Your Entire</span><br />
            <span className="text-shadow-hero drop-shadow-lg">Professional</span><br />
            <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              Identity. One Link.
            </span>
          </h1>
          
          {/* Mobile Content */}
          <div className="md:hidden flex flex-col gap-3 mt-1 text-base text-neutral-200 font-medium">
            <ul className="flex flex-col gap-3">
              {['Resume', 'GitHub', 'LinkedIn', 'Demo Videos', 'Project Screenshots'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-base text-neutral-300 leading-[1.5] font-medium text-shadow-sub max-w-md mt-2">
              Everything recruiters need to evaluate you in under 60 seconds.
            </p>
          </div>

          {/* Desktop Content */}
          <p className="hidden md:block text-base md:text-lg text-neutral-200 leading-relaxed font-medium text-shadow-sub">
            Resumes tell recruiters what you've done. <strong>Hire.me shows them.</strong> Consolidate your LinkedIn, GitHub, and best projects into a single, interactive link.
            <br className="hidden md:block" />
            <span className="block mt-2">Let hiring teams play demo videos, view screenshots, and download your resume instantly. No scattered tabs. Just proof.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-[16px] mt-4 w-full">
            {!currentUser?.onboardingCompleted ? (
              <Link 
                href={isLoggedIn ? "/onboarding" : "/signup"}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-neutral-950 font-bold text-base hover:scale-[1.02] transition-transform shadow-xl shadow-white/10 active:scale-[0.98] text-center flex items-center justify-center"
              >
                Create My hire.me Link
              </Link>
            ) : (
              <>
                <Link 
                  href={`/${currentUser.username}`}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-neutral-950 font-bold text-base hover:scale-[1.02] transition-transform shadow-xl shadow-white/10 active:scale-[0.98] text-center flex items-center justify-center"
                >
                  View Your Link
                </Link>
                <Link 
                  href="/dashboard?tab=share"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-base hover:bg-white/10 transition-colors active:scale-[0.98] text-center flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Share Link
                </Link>
              </>
            )}
          </div>
          {/* glowing url preview */}
          <div className="mt-2 flex items-center gap-2.5 text-shadow-sub">
            <span className="text-sm font-mono text-neutral-400">
              hire.me/<strong className="text-white hover:underline cursor-pointer">alex</strong>
            </span>
          </div>
        </div>
      </section>



      {/* 2. SOCIAL PROOF SECTION */}
      <section 
        id="social-proof"
        className="relative z-10 py-24 px-6 md:px-24 bg-neutral-950/55 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-12 text-center">
          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Built For Modern Professionals</h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Whether you're applying for jobs, networking at events, seeking freelance opportunities, or building your professional brand, hire.me helps you present yourself professionally with a single shareable link.
            </p>
          </div>
          {/* Desktop Bullet Points */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12 text-left w-full">
            {[
              { role: "Software Developers", desc: "Showcase github repos, tech stacks, and terminal portfolio layouts.", icon: <Code className="w-5 h-5" /> },
              { role: "Students & Graduates", desc: "Present academic papers, projects, and internships.", icon: <GraduationCap className="w-5 h-5" /> },
              { role: "Designers & Creatives", desc: "Display high-fidelity Figma designs and visual portfolios.", icon: <Palette className="w-5 h-5" /> },
              { role: "Product Managers", desc: "Highlight product roadmaps, user growth, and key metrics.", icon: <Presentation className="w-5 h-5" /> },
              { role: "Freelancers & Agencies", desc: "Centralize client testimonials, services offered, and active booking availability.", icon: <Briefcase className="w-5 h-5" /> },
              { role: "Startup Founders", desc: "Share company pitch decks, vision, founder bio, funding history, and advisor board details.", icon: <Rocket className="w-5 h-5" /> }
            ].map((audience) => (
              <div key={audience.role} className="flex flex-col gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    {audience.icon}
                  </div>
                  <h3 className="text-base font-bold text-white">{audience.role}</h3>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {audience.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile Fanned Cards */}
          <div className="md:!hidden fanned-card-container max-w-6xl mx-auto mt-12 text-left">
            {[
              { role: "Software Developers", desc: "Showcase github repos, tech stacks, and terminal portfolio layouts.", icon: <Code className="w-5 h-5" /> },
              { role: "Students & Graduates", desc: "Present academic papers, projects, and internships.", icon: <GraduationCap className="w-5 h-5" /> },
              { role: "Designers & Creatives", desc: "Display high-fidelity Figma designs and visual portfolios.", icon: <Palette className="w-5 h-5" /> },
              { role: "Product Managers", desc: "Highlight product roadmaps, user growth, and key metrics.", icon: <Presentation className="w-5 h-5" /> },
              { role: "Freelancers & Agencies", desc: "Centralize client testimonials, services offered, and active booking availability.", icon: <Briefcase className="w-5 h-5" /> },
              { role: "Startup Founders", desc: "Share company pitch decks, vision, founder bio, funding history, and advisor board details.", icon: <Rocket className="w-5 h-5" /> }
            ].map((audience) => (
              <div 
                key={audience.role}
                className="fanned-card relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/40 backdrop-blur-md p-6 flex flex-col justify-between group cursor-pointer transition-all duration-500 hover:border-white/30 hover:bg-neutral-950/50 hover:shadow-2xl hover:shadow-black/60"
              >
                {/* Top Row / Icon */}
                <div className="relative z-10 flex justify-between items-start">
                  <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/70 group-hover:text-[#dc2626] group-hover:border-[#dc2626]/20 group-hover:bg-[#dc2626]/5 transition-all duration-500">
                    {audience.icon}
                  </div>
                  <div className="text-white/30 group-hover:text-[#dc2626] transition-colors duration-300">
                    <ArrowRight className="w-4 h-4 transform -rotate-45 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 flex flex-col text-left">
                  <span className="text-lg font-bold text-white group-hover:text-[#dc2626] transition-colors duration-300 text-shadow-sub">{audience.role}</span>
                  <span className="text-xs text-neutral-100 font-medium mt-2 line-clamp-2 leading-relaxed text-shadow-sub">
                    {audience.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section 
        id="problem-section"
        className="relative z-10 py-24 px-6 md:px-24 bg-neutral-950/55 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-3 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">One Link. Everything Recruiters Need.</h2>
            <p className="text-sm text-neutral-300">
              Modern hiring requires more than just a resume—it requires visual proof. Stop sending fragmented links across multiple websites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-4">
            {/* Fragmented Process */}
            <div className="p-6 md:p-8 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-500" /> Scattered Assets (The Fragmented Way)
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Recruiters evaluate candidates across multiple websites, resulting in endless tab switching and lost context.
              </p>
              <div className="flex flex-col gap-2 font-semibold text-xs text-neutral-350">
                {[
                  "Traditional static PDF Resume",
                  "LinkedIn Profile (often requested separately)",
                  "GitHub Code Repositories",
                  "X/Twitter or Professional Social Handles",
                  "Personal Websites & Portfolio links",
                  "Scattered project screenshots & demo videos",
                  "Manual contact card or email copy-pasting"
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-[10px] text-neutral-400 shrink-0">{idx + 1}</span>
                    <span className="text-neutral-200">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Consolidated Process */}
            <div className="p-6 md:p-8 rounded-3xl border border-white/15 bg-neutral-950/50 backdrop-blur-md flex flex-col gap-4 relative overflow-hidden border-glow-neutral">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> The Unified Profile (Hire.me Way)
              </h3>
              <p className="text-xs text-neutral-200 leading-relaxed">
                Consolidate your entire professional identity under a single link. No endless tab switching, no searching through links.
              </p>
              <div className="flex flex-col gap-3 font-semibold text-xs text-neutral-300 py-2">
                {[
                  "Upload your Resume PDF with direct preview",
                  "Integrate LinkedIn, GitHub, and X/Twitter previews",
                  "Showcase up to 3 projects with demo video previews",
                  "Host live project URLs & GitHub repositories",
                  "Include up to 2 supporting screenshots per project",
                  "Display project technology stacks & details",
                  "Add instant download contact information"
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-white/10 bg-white/10 flex items-center justify-center text-[10px] text-neutral-200 shrink-0">✓</span>
                    <span className="text-neutral-100 font-bold">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>









      {/* 9. QR CODE SECTION */}
      <section 
        id="qr-section"
        className="relative z-10 py-24 px-6 md:px-24 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-12 items-center text-center">
          <div className="flex flex-col gap-3 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Offline Networking Meets Digital</h2>
            <p className="text-sm text-white/90 font-semibold">Scan codes and exchange details instantly at meetups, events, or on printouts.</p>
          </div>

          <div className="p-6 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md max-w-md flex flex-col items-center gap-5">
            <div className="p-4 rounded-2xl bg-white flex items-center justify-center border shadow-xl">
              {/* Simulated QR Code Layout */}
              <div className="w-36 h-36 border border-neutral-200 bg-neutral-150 flex items-center justify-center rounded">
                <svg className="w-full h-full text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 3h6v6H3zm12 0h6v6h-6zM3 15h6v6H3zm15 0h3v3h-3zm-3 3h3v3h-3zm3 0h3v-3h-3zm0-3v-3h-3v3zm-3 0h-3v3h3z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-1 max-w-xs">
              <span className="text-xs font-bold text-white">Scan to Load hire.me/alex</span>
              <p className="text-[11px] text-neutral-300 leading-normal">
                Visitors can simply scan your physical QR code to gain access to your resume PDF, credentials portfolio, and socials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. WHY HIRE.ME SECTION */}
      <section 
        id="why-section"
        className="relative z-10 py-24 px-6 md:px-24 bg-neutral-950/55 backdrop-blur-md border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-start">
          {/* Left Column: Big typography story */}
          <div className="w-full md:w-5/12 flex flex-col gap-6 md:sticky md:top-28">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Modern Hiring <br />
              Requires <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">Proof.</span>
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed font-medium">
              A static PDF resume tells recruiters what you've done. It cannot demonstrate how your product works, display your GitHub activity, or let them experience what you've built.
            </p>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Instead of forcing recruiters to search through separate social media profiles, repositories, and screenshots, Hire.me combines them into one seamless professional landing page.
            </p>
          </div>

          {/* Right Column: Clean horizontal list (anti-card) */}
          <div className="w-full md:w-7/12 flex flex-col">
            {[
              { 
                num: "01", 
                title: "Resumes Tell. Hire.me Shows.", 
                desc: "A PDF cannot show your app's responsiveness, play a demo video, or exhibit your real-time coding output. Hire.me embeds live visuals directly." 
              },
              { 
                num: "02", 
                title: "Zero Friction, All Context", 
                desc: "Recruiters evaluate you in seconds. By keeping project demos, repository code, screenshots, and profiles on a single page, you completely eliminate tab fatigue." 
              },
              { 
                num: "03", 
                title: "Instant Recruiter Discovery", 
                desc: "Allow hiring managers to view project demos, check GitHub links, browse LinkedIn updates, and download your latest resume—all without leaving the page." 
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="py-5 flex gap-6 items-start group transition-colors duration-300"
              >
                <span className="font-mono text-xs text-red-500 font-extrabold tracking-widest">{item.num}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors duration-300">{item.title}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. TESTIMONIALS SECTION */}
      <section 
        id="testimonials-section"
        className="relative z-10 py-24 px-6 md:px-24 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-14 text-center">
          <div className="flex flex-col gap-3 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Professionals Love hire.me</h2>
            <p className="text-sm text-neutral-300 font-semibold">See how developers, managers, and designers land roles with their profile links.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { n: "Alex Rivera", r: "Software Architect", f: "Using hire.me simplified my applications. I just paste my single link and recruiters get my code, resume, and contact card instantly." },
              { n: "Sarah Chen", r: "UX Designer", f: "I love the minimal template theme! It lets my project showcase and case studies take center stage without clutter." },
              { n: "David Park", r: "Startup Founder", f: "Whenever developers apply with their hire.me link, I evaluate their entire profile in 30 seconds. It's a lifesaver for recruiters." }
            ].map((t, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md flex flex-col justify-between gap-6"
              >
                <p className="text-xs text-neutral-300 leading-relaxed italic">"{t.f}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-[11px] font-bold text-neutral-300 border border-white/5 shrink-0">
                    {t.n[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">{t.n}</span>
                    <span className="text-[10px] text-neutral-400 font-semibold">{t.r}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. PRICING SECTION */}
      <section 
        id="pricing"
        className="relative z-10 py-24 px-6 md:px-24 bg-neutral-950/55 backdrop-blur-md border-t border-white/5"
      >
        <div id="pricing-section" className="max-w-4xl mx-auto flex flex-col gap-14 text-center">
          <div className="flex flex-col gap-3 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Start Free. Upgrade When You Grow.</h2>
            <p className="text-sm text-neutral-300">Setup is instant. Choose a plan matching your reach aspirations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left items-stretch max-w-2xl mx-auto w-full">
            {/* Free Plan */}
            <div className="p-6 md:p-8 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md flex flex-col justify-between gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white">Free Plan</span>
                  <span className="text-xs text-neutral-400 font-medium mt-0.5">Core digital profile</span>
                </div>
                <div className="text-3xl font-black text-white">$0 <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Forever</span></div>
                <div className="flex flex-col gap-2 mt-2 text-xs text-neutral-300 font-semibold">
                  {["Professional Profile", "Resume PDF Hosting", "Basic Analytics views", "Projects Showcase (2)", "Skills Management"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="h-11 rounded-xl border border-white/10 bg-white/5 text-white font-bold text-xs hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center">
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-6 md:p-8 rounded-3xl border border-white/15 bg-neutral-950/50 backdrop-blur-md relative overflow-hidden flex flex-col justify-between gap-8 border-glow-neutral shadow-xl">
              <div className="absolute top-4 right-4 bg-white/10 px-2 py-0.5 rounded-full text-[9px] uppercase font-mono tracking-widest text-neutral-300">
                Recommended
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white flex items-center gap-1.5"><Zap className="w-4 h-4" /> Pro Plan</span>
                  <span className="text-xs text-neutral-300 font-medium mt-0.5">Custom themes & branding</span>
                </div>
                <div className="text-3xl font-black text-white">$5 <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">/ month</span></div>
                <div className="flex flex-col gap-2 mt-2 text-xs text-neutral-200 font-semibold">
                  {["Advanced Analytics clicks", "Full Template Customization", "Unlimited Projects Showcase", "Enhanced Cover Branding", "Priority Support Desk"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/onboarding" className="h-11 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-100 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-white/5">
                Go Pro Now
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* 14. FINAL CALL TO ACTION */}
      <section 
        id="final-cta"
        className="relative z-10 py-24 px-6 md:px-24 border-t border-white/5"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl border border-white/15 bg-neutral-950/50 relative overflow-hidden flex flex-col items-center gap-6 shadow-2xl border-glow-neutral">
            <div className="absolute -top-20 -left-20 w-44 h-44 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-44 h-44 rounded-full bg-white/5 blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-neutral-300">
              <span>Under 5 Minutes Setup</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-2xl">
              Your Career Deserves<br />
              <span className="bg-gradient-to-r from-white via-neutral-150 to-neutral-300 bg-clip-text text-transparent">
                More Than A Resume
              </span>
            </h2>
            <p className="max-w-md text-sm text-neutral-350 leading-relaxed">
              Build a professional identity that represents you fully. Connect your accounts, showcase your best projects with live video demos, and upload your resume to create a single shareable link for modern hiring.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full justify-center">
              <Link 
                href="/onboarding"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-neutral-950 font-extrabold text-sm hover:scale-105 transition-all shadow-lg shadow-white/10 active:scale-95 text-center flex items-center justify-center"
              >
                Create My hire.me Link
              </Link>
              <button 
                onClick={triggerToast}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all active:scale-95"
              >
                Browse Talent Pool
              </button>
            </div>
            {/* supporting text */}
            <div className="flex flex-col items-center gap-1.5 mt-2">
              <span className="text-xs text-neutral-450 font-mono">One Link. Infinite Opportunities.</span>
              <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest">hire.me/yourname</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation bar */}
      <footer className="relative z-10 py-12 px-6 md:px-12 bg-neutral-950/60 backdrop-blur-md border-t border-white/5 text-neutral-400 text-xs select-none">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-sm text-white tracking-tight">hire.me</span>
            <span className="text-[10px] text-neutral-600 font-mono">© 2026 SaaS platform</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[11px] font-semibold uppercase tracking-wider">
            <Link href="/why-us" className="hover:text-white transition-colors">Why Us</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href={currentUser?.onboardingCompleted ? "/dashboard" : "/onboarding"} className="hover:text-white transition-colors">Analytics</Link>
            <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
        </div>
      </footer>

      {/* Glassmorphic Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl border border-white/10 bg-neutral-950/60 backdrop-blur-xl shadow-2xl text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-ping" />
          Talent Directory is coming soon!
        </div>
      )}

      {/* Custom high-performance cursor elements */}
      <div ref={glowRef} className="custom-cursor-glow" />
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </div>
  );
}

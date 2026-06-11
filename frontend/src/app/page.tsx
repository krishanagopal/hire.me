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
  Layers, Share2, Shield, Heart, Zap
} from "lucide-react";

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Custom interactive landing page states
  const [isScrolled, setIsScrolled] = useState(false);
  const [customizerTheme, setCustomizerTheme] = useState<"modern" | "minimal" | "corporate" | "developer">("modern");
  const [customizerColor, setCustomizerColor] = useState("#3b82f6");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [showDemoNotification, setShowDemoNotification] = useState(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<"about" | "skills" | "projects" | "contact">("about");
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

  useEffect(() => {
    setIsLoggedIn(!!apiMock.getCurrentUser());
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Initialize GSAP ScrollTrigger and link scroll to active nav highlights and section fade-ins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Monitor scroll to sync active section highlight in the header nav
      ScrollTrigger.create({
        trigger: scrollWrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          // Map scroll progress to 6 core section categories (0 to 5)
          const sec = Math.min(Math.floor(self.progress * 6), 5);
          setActiveSection(sec);
        },
      });

      // 2. Smooth reveal fade-ins for content sections
      const sections = [
        "#hero-section", "#social-proof", "#problem-section", 
        "#how-it-works", "#features-section", "#showcase-section", 
        "#analytics-section", "#customization-section", "#qr-section", 
        "#why-section", "#testimonials-section", "#pricing-section", 
        "#faq-section", "#final-cta"
      ];

      sections.forEach((secId) => {
        gsap.fromTo(secId, 
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: secId,
              start: "top 82%",
              toggleActions: "play none none none"
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

  const faqs = [
    {
      q: "Is hire.me a resume builder?",
      a: "No. hire.me is a professional identity platform that centralizes your resume, projects, social profiles, certifications, and professional information into one shareable profile card."
    },
    {
      q: "Can I update my resume?",
      a: "Yes. Upload a new version anytime in the console and your hire.me card automatically serves the latest version without changing your profile link."
    },
    {
      q: "Can recruiters contact me?",
      a: "Yes. Every hire.me card includes built-in contact buttons that download your vCard (.vcf) directly to their mobile address book or let them email you instantly."
    },
    {
      q: "Do I need a portfolio website?",
      a: "No. hire.me serves as your complete professional profile, hosting your bio, credentials, links, and detailed projects showreel under one permanent link."
    }
  ];

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
            backgroundImage: "url('/Gemini_Generated_Image_fl7uqwfl7uqwfl7u.png')",
            filter: "contrast(1.02) saturate(1.02) brightness(1.0) blur(0px)",
          }}
        />
        
        {/* Floating Liquid Glass Refraction Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="liquid-glass-blob w-72 h-72 top-[12%] left-[8%] opacity-[0.65]" />
          <div className="liquid-glass-blob w-[450px] h-[450px] bottom-[8%] right-[4%] opacity-[0.55]" style={{ animationDelay: "-6s", animationDuration: "36s" }} />
          <div className="liquid-glass-blob w-80 h-80 top-[48%] right-[22%] opacity-[0.45]" style={{ animationDelay: "-12s", animationDuration: "30s" }} />
        </div>

        {/* Cinematic readability gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-black/65 pointer-events-none" />
      </div>

      {/* Glassmorphic Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 ${
        isScrolled 
          ? "bg-neutral-950/60 backdrop-blur-xl border-b border-white/5 py-3.5 shadow-lg shadow-black/25" 
          : "bg-gradient-to-b from-black/55 to-transparent"
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-300 to-neutral-600 bg-clip-text text-transparent">
            hire.me
          </span>
          <span className="text-[9px] uppercase font-bold tracking-widest bg-white/10 px-2 py-0.5 rounded text-neutral-300">
            Profile Card
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-neutral-300">
          <a href="#features" className={`transition-colors ${activeSection === 1 ? "text-white" : "hover:text-white"}`}>Features</a>
          <a href="#how-it-works" className={`transition-colors ${activeSection === 2 ? "text-white" : "hover:text-white"}`}>How It Works</a>
          <a href="#analytics" className={`transition-colors ${activeSection === 3 ? "text-white" : "hover:text-white"}`}>Analytics</a>
          <a href="#customization" className={`transition-colors ${activeSection === 4 ? "text-white" : "hover:text-white"}`}>Templates</a>
          <a href="#pricing" className={`transition-colors ${activeSection === 5 ? "text-white" : "hover:text-white"}`}>Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register"
            className="px-4.5 py-2 text-xs font-bold rounded-full bg-white text-neutral-950 hover:bg-neutral-100 transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section 
        id="hero-section"
        className="relative z-10 min-h-screen flex items-center justify-start px-6 md:px-12 lg:px-24 pt-28 pb-16 max-w-7xl mx-auto w-full"
      >
        <div className="flex flex-col items-start text-left gap-6 w-full max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-neutral-700">
            <span className="w-6 h-[1px] bg-neutral-700" />
            <span>One Link. Everything You Need.</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight text-neutral-950">
            Your Entire<br />
            Professional<br />
            <span className="bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600 bg-clip-text text-transparent">
              Identity. One Link.
            </span>
          </h1>
          <p className="text-base md:text-lg text-neutral-800 leading-relaxed font-medium">
            Stop sending resumes, LinkedIn profiles, GitHub repositories, portfolio websites, certifications, and contact information separately. 
            <br /><br />
            Create a single professional profile that contains everything recruiters, founders, hiring managers, clients, and collaborators need to evaluate you.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 mt-2 w-full">
            <Link 
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-950 text-white font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-neutral-950/10 active:scale-95 text-center flex items-center justify-center"
            >
              Create My hire.me Card
            </Link>
            <a 
              href="#showcase-section"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border border-neutral-350 text-neutral-800 font-semibold text-sm hover:bg-neutral-100/50 transition-all active:scale-95 text-center"
            >
              View Demo Profile
            </a>
          </div>
          {/* glowing url preview */}
          <div className="mt-4 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-neutral-700">
              Core link: <strong className="text-neutral-950 hover:underline cursor-pointer">hire.me/krishna</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF SECTION */}
      <section 
        id="social-proof"
        className="relative z-10 py-24 px-6 md:px-24 bg-neutral-950/20 backdrop-blur-sm border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-12 text-center">
          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Built For Modern Professionals</h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Whether you're applying for jobs, networking at events, seeking freelance opportunities, or building your professional brand, hire.me helps you present yourself professionally with a single shareable link.
            </p>
          </div>
          <div className="fanned-card-container">
            {[
              { role: "Software Developers", img: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=300&h=400", desc: "Showcase repos & code stacks." },
              { role: "Students", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=300&h=400", desc: "Present projects & credentials." },
              { role: "Designers", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300&h=400", desc: "Showcase case studies & demos." },
              { role: "Product Managers", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=400", desc: "Highlight roadmaps & metrics." },
              { role: "Freelancers", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=400", desc: "Centralize clients & links." },
              { role: "Startup Founders", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=400", desc: "Share pitch decks & background." }
            ].map((audience) => (
              <div 
                key={audience.role}
                className="fanned-card group/card"
              >
                {/* Background Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={audience.img} 
                  alt={audience.role} 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 transition-all duration-500 group-hover/card:scale-105 group-hover/card:opacity-75" 
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
                
                {/* Card Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1.5 z-10 text-left">
                  <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0 mb-1 border border-white/10">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold leading-tight text-white">{audience.role}</span>
                  <span className="text-[10px] text-neutral-400 font-medium leading-normal opacity-0 max-h-0 overflow-hidden group-hover/card:opacity-100 group-hover/card:max-h-12 transition-all duration-300">
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
        className="relative z-10 py-24 px-6 md:px-24 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-3 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Scattered Information</h2>
            <p className="text-sm text-neutral-300">
              Applying for roles shouldn't require copy-pasting five different links and uploading static files over and over again.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-4">
            {/* Traditional Process */}
            <div className="p-6 md:p-8 rounded-3xl border border-rose-500/10 bg-rose-950/5 backdrop-blur-md flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-rose-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Traditional Process
              </h3>
              <div className="flex flex-col gap-2 font-semibold text-xs text-neutral-300">
                {["Apply for Job", "Attach Resume PDF", "Copy LinkedIn Link", "Copy GitHub Link", "Copy Portfolio Link", "Share Contact Info", "Repeat Again"].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-rose-500/10 bg-rose-950/10 flex items-center justify-center text-[10px] text-rose-400 shrink-0">{idx + 1}</span>
                    <span className="text-neutral-200">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* With hire.me */}
            <div className="p-6 md:p-8 rounded-3xl border border-emerald-500/15 bg-emerald-950/5 backdrop-blur-md flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> With hire.me
              </h3>
              <div className="flex flex-col gap-3 font-semibold text-xs text-neutral-300 py-4">
                {["Create Your hire.me Card", "Share One Single Link", "Done"].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center text-[10px] text-emerald-400 shrink-0">{idx + 1}</span>
                    <span className="text-neutral-100 text-sm font-bold">{step}</span>
                  </div>
                ))}
              </div>
              <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 text-[11px] text-neutral-300 leading-relaxed mt-2">
                hire.me eliminates repetitive sharing and creates a centralized professional identity that stays updated forever. No more outdated resumes, broken links, or switching platforms.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section 
        id="how-it-works"
        className="relative z-10 py-24 px-6 md:px-24 bg-neutral-950/20 backdrop-blur-sm border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-14">
          <div className="flex flex-col gap-3 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Build Your Presence in Minutes</h2>
            <p className="text-sm text-neutral-350">Get set up quickly and share your profile card globally.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { s: "Step 1", t: "Create Your Profile", d: "Add your professional details including your bio, headline, core skills, and locations." },
              { s: "Step 2", t: "Connect Everything", d: "Add LinkedIn, GitHub, portfolio websites, certifications, and casing projects." },
              { s: "Step 3", t: "Upload Your Resume", d: "Upload your resume PDF once. Update it anytime without altering your permanent link." },
              { s: "Step 4", t: "Share Everywhere", d: "Include your hire.me link in job submissions, email footers, and business cards." }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-3xl border border-white/5 bg-neutral-950/45 hover:border-white/10 transition-all flex flex-col gap-3 text-left"
              >
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 font-mono">{step.s}</span>
                <h3 className="text-base font-bold text-white mt-1">{step.t}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section 
        id="features"
        className="relative z-10 py-24 px-6 md:px-24 border-t border-white/5"
      >
        <div id="features-section" className="max-w-6xl mx-auto flex flex-col gap-14">
          <div className="flex flex-col gap-3 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Everything Recruiters Need</h2>
            <p className="text-sm text-neutral-350">One digital profile to showcase your entire credentials stack.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <User className="w-5 h-5" />, title: "Professional Profile", desc: "Beautiful public profile layouts designed to present your professional identity." },
              { icon: <FileText className="w-5 h-5" />, title: "Resume Hosting", desc: "Always serve the latest version of your resume PDF from one permanent link." },
              { icon: <Layers className="w-5 h-5" />, title: "Projects Showcase", desc: "Display your projects with technology badges, repo links, and demos." },
              { icon: <Briefcase className="w-5 h-5" />, title: "Skills Portfolio", desc: "Organize and category-group your technical skills clearly." },
              { icon: <Award className="w-5 h-5" />, title: "Certifications", desc: "List credentials and boots certificates to bolster career credibility." },
              { icon: <Globe className="w-5 h-5" />, title: "Professional Links", desc: "Integrate LinkedIn, GitHub, LeetCode, Medium, Dev.to, and Hashnode." },
              { icon: <Share2 className="w-5 h-5" />, title: "Contact Hub", desc: "Allow recruiters to download contact cards or email you instantly." },
              { icon: <Smartphone className="w-5 h-5" />, title: "Mobile Optimized", desc: "Completely responsive layout looking stunning on every size." }
            ].map((feat, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-3xl border border-white/5 bg-neutral-950/35 hover:border-white/10 transition-all flex flex-col gap-4 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-305">
                  {feat.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed mt-1">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROFILE SHOWCASE */}
      <section 
        id="showcase-section"
        className="relative z-10 py-24 px-6 md:px-24 bg-neutral-950/20 backdrop-blur-sm border-t border-white/5"
      >
        <div className="max-w-4xl mx-auto flex flex-col gap-12 text-center">
          <div className="flex flex-col gap-3 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Meet Your hire.me Card</h2>
            <p className="text-sm text-neutral-300">A modern professional profile designed to stand out. Interact with the live showcase tabs below.</p>
          </div>

          {/* Interactive Profile Mockup Frame */}
          <div className="w-full rounded-3xl border border-white/10 bg-neutral-950/75 backdrop-blur-2xl shadow-2xl overflow-hidden text-left flex flex-col">
            {/* Header bar */}
            <div className="p-4 bg-neutral-900/40 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300">hire.me/krishna</span>
              <div className="flex items-center gap-2">
                {["about", "skills", "projects", "contact"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveShowcaseTab(tab as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      activeShowcaseTab === tab 
                        ? "bg-white text-neutral-950" 
                        : "text-neutral-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Display Frame */}
            <div className="p-6 md:p-8 min-h-[300px] flex flex-col justify-between">
              {activeShowcaseTab === "about" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full border border-white/15 overflow-hidden bg-neutral-900 shrink-0">
                      <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150" alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Krishna Gopal</h4>
                      <p className="text-xs text-neutral-300">Senior Full Stack Architect @ San Francisco, CA</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed mt-2 max-w-2xl">
                    Passionate about building highly-optimized web architectures, interactive 3D/canvas animation systems, and scalable cloud structures. Specialized in Next.js, Node.js, TypeScript, Docker, and AWS.
                  </p>
                  <div className="flex items-center gap-2.5 mt-2.5 text-xs text-neutral-300">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> San Francisco, CA</span>
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Resume Uploaded</span>
                  </div>
                </div>
              )}

              {activeShowcaseTab === "skills" && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-neutral-300">Core Stack Competencies</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                    {[
                      { n: "React / Next.js", c: "Frontend" },
                      { n: "TypeScript", c: "Languages" },
                      { n: "Node.js", c: "Backend" },
                      { n: "AWS / Docker", c: "DevOps" }
                    ].map((sk, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-white/5 bg-white/5 flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-white">{sk.n}</span>
                        <span className="text-[9px] text-neutral-400 uppercase tracking-widest">{sk.c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeShowcaseTab === "projects" && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-neutral-300">Featured Case Studies</h4>
                  <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-white">hire.me SaaS Platform</span>
                      <p className="text-xs text-neutral-300 leading-normal max-w-md">Full-fledged SaaS portfolio identity aggregator for developers with dynamic themes and real-time analytics.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[10px] font-bold uppercase cursor-pointer">Repo</span>
                      <span className="px-2.5 py-1.5 rounded-lg bg-white text-neutral-950 text-[10px] font-bold uppercase cursor-pointer">Live</span>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === "contact" && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-neutral-300 font-mono">Download Profile Info</h4>
                  <p className="text-xs text-neutral-300">Save Krishna's contact details directly to your mobile address book.</p>
                  <div className="flex gap-3 mt-2">
                    <button className="h-10 px-6 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-100 active:scale-95 transition-all flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Save Contact Card (.vcf)
                    </button>
                    <button className="h-10 px-6 rounded-xl border border-white/10 bg-white/5 text-white font-bold text-xs hover:bg-white/10 active:scale-95 transition-all">
                      Email Directly
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom stats ribbon */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                <span>Theme: Developer (Static)</span>
                <span>Active Profile</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ANALYTICS SECTION */}
      <section 
        id="analytics"
        className="relative z-10 py-24 px-6 md:px-24 border-t border-white/5"
      >
        <div id="analytics-section" className="max-w-6xl mx-auto flex flex-col gap-14">
          <div className="flex flex-col gap-3 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Understand Your Reach</h2>
            <p className="text-sm text-neutral-350">Track clicks and understand how recruiters interact with your profile link.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Stats Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/45 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-widest text-neutral-400">
                  <span>Profile Views</span>
                  <Eye className="w-4 h-4 text-neutral-300" />
                </div>
                <span className="text-4xl font-extrabold text-white">1,492</span>
                <span className="text-[10px] text-emerald-400 font-semibold">+18% this week</span>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/45 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-widest text-neutral-400">
                  <span>Resume Downloads</span>
                  <Download className="w-4 h-4 text-neutral-300" />
                </div>
                <span className="text-4xl font-extrabold text-white">418</span>
                <span className="text-[10px] text-emerald-400 font-semibold">+12% this week</span>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/45 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-widest text-neutral-400">
                  <span>Link Clicks</span>
                  <MousePointer className="w-4 h-4 text-neutral-300" />
                </div>
                <span className="text-4xl font-extrabold text-white">793</span>
                <span className="text-[10px] text-neutral-300 font-semibold">GitHub, LinkedIn, Portfolio</span>
              </div>
            </div>

            {/* Right: Device insights */}
            <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/45 flex flex-col gap-4">
              <h4 className="text-xs uppercase font-extrabold tracking-widest text-neutral-300">Traffic Breakdown</h4>
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-300 flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5" /> Desktop</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                    <div className="h-full bg-white" style={{ width: "65%" }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-300 flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> Mobile</span>
                    <span>32%</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-500" style={{ width: "32%" }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-300 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Tablet</span>
                    <span>3%</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-700" style={{ width: "3%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMIZATION & THEME SELECTION */}
      <section 
        id="customization"
        className="relative z-10 py-24 px-6 md:px-24 bg-neutral-950/20 backdrop-blur-sm border-t border-white/5"
      >
        <div id="customization-section" className="max-w-6xl mx-auto flex flex-col gap-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Customizer Settings Column */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-left">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">Personalize Your Brand</h2>
              <p className="text-sm text-neutral-355 leading-relaxed">
                Make your hire.me card reflect your personality while maintaining a professional appearance. Choose from themes tailored for developers, minimalists, designers, or corporate managers.
              </p>
              
              {/* Interactive customizer widgets */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300">Select Template Theme</span>
                  <div className="grid grid-cols-2 gap-2">
                    {["modern", "minimal", "corporate", "developer"].map((th) => (
                      <button
                        key={th}
                        onClick={() => setCustomizerTheme(th as any)}
                        className={`h-10 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                          customizerTheme === th 
                            ? "bg-white text-neutral-950 border-white" 
                            : "border-white/5 bg-white/5 text-neutral-300 hover:text-white"
                        }`}
                      >
                        {th}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300">Brand Color Accent</span>
                  <div className="flex items-center gap-3">
                    {["#3b82f6", "#10b981", "#6366f1", "#f43f5e", "#ffffff"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setCustomizerColor(color)}
                        className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                        style={{ backgroundColor: color }}
                      >
                        {customizerColor === color && <Check className="w-3.5 h-3.5 text-neutral-950 font-bold" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Customizer Preview Column */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-md p-6 rounded-3xl border border-white/10 bg-neutral-950/65 backdrop-blur-xl shadow-2xl flex flex-col gap-4 text-left relative overflow-hidden transition-all duration-300">
                <div className="absolute top-4 right-4 bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[8px] uppercase tracking-widest text-neutral-300">
                  Live Preview
                </div>

                {customizerTheme === "modern" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-900 border" style={{ borderColor: customizerColor }}>
                        <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150" alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">Krishna Gopal</span>
                        <span className="text-[10px] font-semibold" style={{ color: customizerColor }}>{themeDetails.modern.name}</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 leading-normal">{themeDetails.modern.desc}</p>
                    <button className="h-9 rounded-lg text-xs font-bold text-neutral-950 active:scale-95 transition-all flex items-center justify-center gap-1.5" style={{ backgroundColor: customizerColor }}>
                      <FileText className="w-3.5 h-3.5" /> Download Resume
                    </button>
                  </div>
                )}

                {customizerTheme === "minimal" && (
                  <div className="flex flex-col gap-3 font-serif">
                    <h4 className="text-2xl font-light text-neutral-900 bg-white px-2 py-0.5 self-start rounded">Krishna Gopal</h4>
                    <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest" style={{ color: customizerColor }}>{themeDetails.minimal.name}</span>
                    <p className="text-xs text-neutral-300 leading-normal font-sans">{themeDetails.minimal.desc}</p>
                    <button className="h-9 rounded border border-neutral-200 text-xs font-bold font-sans hover:bg-neutral-900 hover:text-white transition-all">
                      Download PDF
                    </button>
                  </div>
                )}

                {customizerTheme === "corporate" && (
                  <div className="flex flex-col gap-4">
                    <div className="p-3.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{themeDetails.corporate.name}</span>
                        <span className="text-[9px] text-neutral-350 uppercase tracking-widest mt-0.5">Corporate Theme</span>
                      </div>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: customizerColor }} />
                    </div>
                    <p className="text-xs text-neutral-300 leading-normal">{themeDetails.corporate.desc}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                      <button className="h-9 rounded bg-neutral-900 text-white">Resume</button>
                      <button className="h-9 rounded border border-neutral-300 text-neutral-700 bg-white">vCard</button>
                    </div>
                  </div>
                )}

                {customizerTheme === "developer" && (
                  <div className="flex flex-col gap-3.5 font-mono text-emerald-400">
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 border-b border-white/5 pb-2">
                      <span>guest@hire:~/{customizerTheme}</span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: customizerColor }} />
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <span>&gt; cat theme_details.txt</span>
                      <span className="text-white mt-1 leading-normal text-[11px]">{themeDetails.developer.desc}</span>
                    </div>
                    <button className="h-8 rounded border border-emerald-500 text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center gap-1 hover:bg-emerald-500 hover:text-neutral-950 transition-colors">
                      $ cat resume.pdf
                    </button>
                  </div>
                )}
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
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Offline Networking Meets Digital</h2>
            <p className="text-sm text-neutral-300">Scan codes and exchange details instantly at meetups, events, or on printouts.</p>
          </div>

          <div className="p-6 rounded-3xl border border-white/5 bg-neutral-950/45 max-w-md flex flex-col items-center gap-5">
            <div className="p-4 rounded-2xl bg-white flex items-center justify-center border shadow-xl">
              {/* Simulated QR Code Layout */}
              <div className="w-36 h-36 border border-neutral-200 bg-neutral-150 flex items-center justify-center rounded">
                <svg className="w-full h-full text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 3h6v6H3zm12 0h6v6h-6zM3 15h6v6H3zm15 0h3v3h-3zm-3 3h3v3h-3zm3 0h3v-3h-3zm0-3v-3h-3v3zm-3 0h-3v3h3z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-1 max-w-xs">
              <span className="text-xs font-bold text-white">Scan to Load hire.me/krishna</span>
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
        className="relative z-10 py-24 px-6 md:px-24 bg-neutral-950/20 backdrop-blur-sm border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-14">
          <div className="flex flex-col gap-3 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">More Than A Resume</h2>
            <p className="text-sm text-neutral-300">Resumes get outdated. Links change. hire.me brings everything under one permanent link.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "Always Updated", d: "Never send another outdated PDF resume. Change your resume once in the console, and your live hire.me card serves the newest version automatically." },
              { t: "Permanent Address", d: "Attach one link to your job submissions, GitHub bio, and LinkedIn. Recruiters always land on your active credentials." },
              { t: "Recruiter Friendly", d: "Enable hiring managers to save your contact card (.vcf) directly to their phone, view dynamic QR codes, and download verified PDFs with one click." }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-3xl border border-white/5 bg-neutral-950/35 flex flex-col gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-300">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white mt-1">{item.t}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{item.d}</p>
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
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Professionals Love hire.me</h2>
            <p className="text-sm text-neutral-300">See how developers, managers, and designers land roles with their card links.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { n: "Krishna Gopal", r: "Software Architect", f: "Using hire.me simplified my applications. I just paste my single link and recruiters get my code, resume, and contact card instantly." },
              { n: "Sarah Chen", r: "UX Designer", f: "I love the minimal template theme! It lets my project showcase and case studies take center stage without clutter." },
              { n: "David Park", r: "Startup Founder", f: "Whenever developers apply with their hire.me card, I evaluate their entire profile in 30 seconds. It's a lifesaver for recruiters." }
            ].map((t, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-3xl border border-white/5 bg-neutral-950/45 flex flex-col justify-between gap-6"
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
        className="relative z-10 py-24 px-6 md:px-24 bg-neutral-950/20 backdrop-blur-sm border-t border-white/5"
      >
        <div id="pricing-section" className="max-w-4xl mx-auto flex flex-col gap-14 text-center">
          <div className="flex flex-col gap-3 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Start Free. Upgrade When You Grow.</h2>
            <p className="text-sm text-neutral-300">Setup is instant. Choose a plan matching your reach aspirations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left items-stretch max-w-2xl mx-auto w-full">
            {/* Free Plan */}
            <div className="p-6 md:p-8 rounded-3xl border border-white/5 bg-neutral-950/45 flex flex-col justify-between gap-8">
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
              <Link href="/register" className="h-11 rounded-xl border border-white/10 bg-white/5 text-white font-bold text-xs hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center">
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-6 md:p-8 rounded-3xl border border-white/15 bg-neutral-950/65 relative overflow-hidden flex flex-col justify-between gap-8 border-glow-neutral shadow-xl">
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
              <Link href="/register" className="h-11 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-100 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-white/5">
                Go Pro Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FAQ SECTION */}
      <section 
        id="faq"
        className="relative z-10 py-24 px-6 md:px-24 border-t border-white/5"
      >
        <div id="faq-section" className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-3 text-center max-w-xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-neutral-300">Got questions? We've got answers.</p>
          </div>

          <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="p-4.5 rounded-2xl border border-white/5 bg-neutral-950/45 cursor-pointer transition-all hover:border-white/10"
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-neutral-500 shrink-0" /> {faq.q}
                  </span>
                  {faqOpen === idx ? <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />}
                </div>
                {faqOpen === idx && (
                  <p className="text-xs text-neutral-300 leading-relaxed mt-3 pt-3 border-t border-white/5 pl-6">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. FINAL CALL TO ACTION */}
      <section 
        id="final-cta"
        className="relative z-10 py-24 px-6 md:px-24 border-t border-white/5"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl border border-white/15 bg-neutral-950/65 relative overflow-hidden flex flex-col items-center gap-6 shadow-2xl border-glow-neutral">
            <div className="absolute -top-20 -left-20 w-44 h-44 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-44 h-44 rounded-full bg-white/5 blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-neutral-300">
              <span>Under 5 Minutes Setup</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-2xl">
              Your Career Deserves<br />
              <span className="bg-gradient-to-r from-white via-neutral-150 to-neutral-300 bg-clip-text text-transparent">
                More Than A PDF
              </span>
            </h2>
            <p className="max-w-md text-sm text-neutral-350 leading-relaxed">
              Build a professional identity that grows with your career. Create a single profile that combines your resume, projects, skills, certifications, professional links, and contact information into one beautiful shareable destination.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full justify-center">
              <Link 
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-neutral-950 font-extrabold text-sm hover:scale-105 transition-all shadow-lg shadow-white/10 active:scale-95 text-center flex items-center justify-center"
              >
                Create My hire.me Card
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
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#analytics" className="hover:text-white transition-colors">Analytics</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
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

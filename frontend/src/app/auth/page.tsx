"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiMock } from "../../utils/apiMock";
import { ArrowLeft, AlertTriangle, Shield } from "lucide-react";

// Inline brand SVGs for authentic Google and GitHub logos
const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function AuthPage() {
  const router = useRouter();
  
  // Custom interactive cursor refs
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  
  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Simulated OAuth Modals
  const [showMockModal, setShowMockModal] = useState<"google" | "github" | null>(null);
  const [mockEmail, setMockEmail] = useState("");
  const [mockName, setMockName] = useState("");

  // Handles post-auth routing logic based on onboarding progress
  const handleAuthSuccess = (user: any) => {
    if (user.onboardingCompleted) {
      router.push("/dashboard");
    } else {
      router.push("/onboarding");
    }
  };

  // Triggers Simulated OAuth flows
  const triggerOAuth = (provider: "google" | "github") => {
    // Check if client keys are set in environmental vars. 
    // In local dev, we default to showing the mockup modal immediately.
    const hasGoogleKeys = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const hasGithubKeys = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

    if (provider === "google" && hasGoogleKeys) {
      // Real Google OAuth triggers here
      // Normally, Google One Tap / GIS SDK handles this. Let's use the fallback modal if not in production yet.
    } else if (provider === "github" && hasGithubKeys) {
      // Real GitHub OAuth redirects
      const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
      const redirectUri = encodeURIComponent(window.location.origin + "/auth/github/callback");
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
      return;
    }

    // Fallback Simulated OAuth overlay modal
    setMockEmail(provider === "google" ? "google_dev@hire.me" : "github_dev@hire.me");
    setMockName(provider === "google" ? "Google Developer" : "GitHub Developer");
    setShowMockModal(provider);
  };

  // Submits the simulated credentials modal details
  const submitMockOAuth = async () => {
    if (!mockEmail || !mockName) return;
    setLoading(true);
    setShowMockModal(null);
    setError("");

    try {
      const mockToken = `${showMockModal}_mock_token::${mockEmail}::${mockName}`;
      
      let res;
      if (showMockModal === "google") {
        res = await apiMock.loginGoogle(mockToken);
      } else {
        res = await apiMock.loginGithub(mockToken);
      }

      if (res.success && res.user) {
        handleAuthSuccess(res.user);
      } else {
        setError(res.error || "Simulated OAuth failed.");
      }
    } catch (err: any) {
      setError(err.message || "Simulated Auth failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#efeff1] px-4 py-12 md:py-16 overflow-hidden select-none">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-none">
        <img 
          src="/media__1781250813790.jpg" 
          alt="Background Art" 
          className="w-full h-full object-cover object-center filter blur-3xl scale-110 opacity-30 select-none pointer-events-none" 
        />
        {/* Soft overlay gradient to harmonize and ensure legibility */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/20" />
      </div>

      {/* Floating Back Button (Top Left) */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-neutral-200/50 text-neutral-800 hover:bg-neutral-50 active:scale-95 transition-all z-20 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
      </Link>

      {/* Floating Visit Site Badge (Bottom Left) */}
      <Link 
        href="/" 
        className="absolute bottom-6 left-6 hidden md:flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-neutral-200/50 text-xs font-bold text-neutral-800 hover:bg-white transition-all z-20 cursor-pointer"
      >
        <span className="text-sm font-semibold transform rotate-45 text-[#dc2626]">↗</span> Visit site
      </Link>

      {/* Main Container Card (Dribbble Showcase split layout) */}
      <div className="relative z-10 w-full max-w-4xl bg-white text-neutral-900 rounded-[36px] shadow-[0_35px_100px_-20px_rgba(0,0,0,0.12)] p-3.5 flex flex-col md:flex-row overflow-hidden min-h-[620px] animate-in fade-in zoom-in-95 duration-500">
        
        {/* LEFT PANEL: Samurai Artwork Image */}
        <div className="relative w-full md:w-[46%] h-72 md:h-auto rounded-[24px] overflow-hidden flex flex-col justify-between p-6 bg-[#f0f0f2] md:[clip-path:polygon(0_0,_100%_0,_92%_100%,_0_100%)] select-none pointer-events-none">
          {/* Cover Image */}
          <img 
            src="/media__1781250813790.jpg" 
            alt="Samurai Dojo" 
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none" 
          />

          {/* Top Row */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase tracking-widest text-[#dc2626] bg-white/80 border border-neutral-200/40 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
              hire.me
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 border border-neutral-200/40 text-neutral-800 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
              Explore
            </span>
          </div>

          {/* Bottom Row */}
          <div className="relative z-10 flex items-center justify-between w-full mt-auto">
            <div className="flex items-center gap-3 bg-white/80 border border-neutral-200/40 backdrop-blur-md p-2.5 rounded-2xl shadow-sm">
              <div className="w-8.5 h-8.5 rounded-full bg-[#dc2626] flex items-center justify-center font-bold text-sm text-white shadow-sm">S</div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-neutral-900">samurai.dev</span>
                <span className="text-[10px] text-neutral-500 font-semibold">Candidate Eval</span>
              </div>
            </div>
            {/* Nav Arrows */}
            <div className="flex gap-1.5 z-10">
              <div className="w-7.5 h-7.5 rounded-full bg-white/80 border border-neutral-200/40 flex items-center justify-center text-neutral-800 shadow-sm backdrop-blur-md">
                <span className="text-[10px] font-bold">←</span>
              </div>
              <div className="w-7.5 h-7.5 rounded-full bg-white/80 border border-neutral-200/40 flex items-center justify-center text-neutral-800 shadow-sm backdrop-blur-md">
                <span className="text-[10px] font-bold">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Auth Content Form */}
        <div className="relative flex-1 w-full md:w-[54%] flex flex-col justify-center px-6 py-8 md:px-12 md:py-10 bg-white">
          
          {/* Header branding */}
          <div className="mb-6 text-left">
            <span className="font-black text-xl tracking-tight uppercase text-neutral-950">
              hire<span className="text-[#dc2626]">.me</span>
            </span>
          </div>

          {/* Title and Subtitle */}
          <div className="flex flex-col gap-1.5 mb-8 text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950">
              Hi Developer
            </h2>
            <span className="text-xs text-neutral-500 uppercase font-extrabold tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse"></span>
              Enter the Dojo of Candidate Evaluation
            </span>
          </div>

          {/* Error Callout */}
          {error && (
            <div className="flex items-center gap-3 p-3.5 mb-6 text-xs rounded-xl border border-rose-200/60 bg-rose-50/50 text-[#dc2626] text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#dc2626]" />
              <span>{error}</span>
            </div>
          )}

          {/* OAuth Buttons Container */}
          <div className="flex flex-col gap-3 mb-4">
            <button
              onClick={() => triggerOAuth("google")}
              disabled={loading}
              className="flex items-center justify-center w-full h-11 text-xs font-bold uppercase tracking-wider rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 active:scale-98 transition-all disabled:opacity-50 text-neutral-800 shadow-sm cursor-pointer hover:border-neutral-400"
            >
              <GoogleIcon /> Continue with Google
            </button>
            
            <button
              onClick={() => triggerOAuth("github")}
              disabled={loading}
              className="flex items-center justify-center w-full h-11 text-xs font-bold uppercase tracking-wider rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 active:scale-98 transition-all disabled:opacity-50 text-neutral-800 shadow-sm cursor-pointer hover:border-neutral-400"
            >
              <GithubIcon /> Continue with GitHub
            </button>
          </div>

          {/* Social Link Indicators matching reference design */}
          <div className="flex justify-center gap-4 mt-8">
            <a href="#" className="w-7.5 h-7.5 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-450 hover:text-neutral-700 hover:border-neutral-300 transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="#" className="w-7.5 h-7.5 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-450 hover:text-neutral-700 hover:border-neutral-300 transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="#" className="w-7.5 h-7.5 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-450 hover:text-neutral-700 hover:border-neutral-300 transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
          </div>

          {/* Footer info */}
          <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-wider text-neutral-450 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-neutral-400" /> Secure OAuth authentication
          </p>
        </div>
      </div>

      {/* SIMULATED OAUTH MODAL OVERLAY */}
      {showMockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4 select-none animate-fade-in">
          <div className="w-full max-w-sm p-6 rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl flex flex-col gap-4 relative animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col gap-1.5 text-center">
              <h3 className="text-lg font-bold flex items-center justify-center gap-2 text-white">
                {showMockModal === "google" ? <GoogleIcon /> : <GithubIcon />}
                Simulated {showMockModal === "google" ? "Google" : "GitHub"} OAuth
              </h3>
              <p className="text-xs text-neutral-400">
                Provide mock developer details to simulate authentication.
              </p>
            </div>

            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-450">Email Address</label>
                <input
                  type="email"
                  value={mockEmail}
                  onChange={(e) => setMockEmail(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-white/10 bg-white/5 text-xs focus:outline-none text-white focus:border-[#dc2626] transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-450">Full Name</label>
                <input
                  type="text"
                  value={mockName}
                  onChange={(e) => setMockName(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-white/10 bg-white/5 text-xs focus:outline-none text-white focus:border-[#dc2626] transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShowMockModal(null)}
                className="flex-1 h-10 rounded-lg border border-white/5 bg-white/5 text-xs font-bold uppercase hover:bg-white/10 active:scale-95 transition-all cursor-pointer text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitMockOAuth}
                className="flex-1 h-10 rounded-lg bg-white text-neutral-950 text-xs font-bold uppercase hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer"
              >
                Authorize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom high-performance cursor elements */}
      <div ref={glowRef} className="custom-cursor-glow" />
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </div>
  );
}

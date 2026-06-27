"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiMock, Profile } from "../../utils/apiMock";
import { 
  FileText, ArrowRight, Palette, Layout, Settings, 
  Terminal, ShieldCheck, Sparkles, Check, Smartphone, Monitor, Share2, Copy, RefreshCw, PlusCircle
} from "lucide-react";

export default function TemplatesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        const user = await apiMock.getCurrentUser();
        setIsLoggedIn(!!user);
        setCurrentUser(user);
        if (user) {
          let profile = await apiMock.getMyProfile();
          if (!profile && user.username) {
            profile = await apiMock.getProfile(user.username);
          }
          if (!profile && user.onboardingCompleted) {
            // Fallback to local user data if backend fetch fails
            profile = {
              username: user.username || "user",
              fullName: user.name || "Alex Rivera",
              email: user.email || "alex@example.com",
              theme: "modern",
              accentColor: "#dc2626",
              bio: "Software Engineer passionate about building scalable applications.",
              skills: [{ name: "React", category: "Frontend" } as any],
              projects: [{ name: "Project Alpha", description: "A cool app", techStack: ["React"] } as any]
            } as Profile;
          }
          setMyProfile(profile);
        }
      } catch (err) {
        console.warn("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAuthAndProfile();

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

  const handleCopyLink = () => {
    if (myProfile) {
      const url = `https://evident.krishanagopal.sbs/${myProfile.username}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (myProfile && navigator.share) {
      navigator.share({
        title: `${myProfile.fullName || myProfile.name}'s Evident Profile`,
        url: `https://evident.krishanagopal.sbs/${myProfile.username}`
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="relative min-h-screen w-full text-white bg-transparent select-none">
      
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
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-black/40 backdrop-blur-md py-2 text-white" 
          : "bg-transparent py-4 text-white"
      }`}>
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-serif text-3xl tracking-normal text-white hover:text-neutral-200 transition-colors duration-300"
          >
            Evident
          </Link>

          {/* Centered Menu Links */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 text-[14px] font-extrabold uppercase tracking-widest text-white/90 transition-colors duration-300">
            <Link 
              href="/#pricing" 
              className="hover:text-white transition-colors duration-300"
            >
              Pricing
            </Link>
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
            {isLoggedIn ? (
              <>
                <button 
                  onClick={async () => {
                    await apiMock.logout();
                    setIsLoggedIn(false);
                    setMyProfile(null);
                  }}
                  className="hidden sm:block text-[14px] font-extrabold uppercase tracking-widest text-white/80 hover:text-white cursor-pointer transition-colors duration-300"
                >
                  Logout
                </button>
                <Link 
                  href="/dashboard"
                  className="h-7 px-4 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-all duration-300 hover:scale-105 active:scale-95 text-center flex items-center justify-center shadow-md font-bold"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="hidden sm:block text-[14px] font-extrabold uppercase tracking-widest text-white/80 hover:text-white transition-colors duration-300"
                >
                  Login
                </Link>
                <Link 
                  href="/signup"
                  className="h-7 px-4 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-all duration-300 hover:scale-105 active:scale-95 text-center flex items-center justify-center shadow-md font-bold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-24 min-h-[80vh] flex flex-col items-center justify-center">
        
        {/* Page Header */}
        <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-mono text-[#dc2626] font-bold mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse" />
            <span>Profile Preview</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            View Your Link
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : !myProfile ? (
          <div className="flex flex-col items-center gap-6 p-12 rounded-3xl border border-white/10 bg-neutral-950/60 backdrop-blur-xl shadow-2xl text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">No Profile Generated Yet</h2>
              <p className="text-sm text-neutral-400">You need to create a profile link first to view your generated form and sharable layout.</p>
            </div>
            <Link 
              href="/onboarding"
              className="mt-4 h-12 px-8 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
            >
              <PlusCircle className="w-4 h-4" /> Create a Link First
            </Link>
          </div>
        ) : (
          <div className="flex justify-center w-full max-w-5xl">
            <div className="w-full max-w-[360px] h-[580px] rounded-[2rem] border-8 border-neutral-900 bg-[#0a0a0a] overflow-y-auto relative shadow-2xl custom-scrollbar flex flex-col">
              
              <div className="sticky top-0 right-0 left-0 h-6 bg-neutral-900/80 backdrop-blur flex justify-center items-center z-20">
                <div className="w-1/3 h-1 bg-neutral-600 rounded-full" />
              </div>
              <div className="absolute top-8 right-3 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[8px] uppercase tracking-widest text-emerald-400 font-mono z-20 backdrop-blur-md">
                Live Preview
              </div>

              {/* Profile Data Layout */}
              <div className="flex flex-col pb-8">
                {/* Banner & Avatar */}
                <div className="h-28 w-full bg-neutral-800 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
                  <div className="absolute -bottom-8 left-6 w-20 h-20 rounded-full border-4 border-[#0a0a0a] overflow-hidden bg-neutral-900">
                    {myProfile.avatarUrl ? (
                      <img src={myProfile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-xl font-bold">{myProfile.fullName?.[0] || myProfile.name?.[0] || '?'}</div>
                    )}
                  </div>
                </div>
                
                <div className="px-6 pt-10 flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">{myProfile.fullName || myProfile.name} <Sparkles className="w-4 h-4" style={{ color: myProfile.accentColor || '#dc2626' }} /></h2>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">{myProfile.role || myProfile.headline || "Professional"}</p>
                  </div>

                  {/* Bio */}
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    {myProfile.bio || "No bio added yet."}
                  </p>

                  {/* Actions - REPLACED VIEW RESUME WITH SHARE AND COPY LINK */}
                  <div className="flex gap-2 w-full mt-2">
                    <button 
                      onClick={handleShare}
                      className="flex-1 h-10 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 shadow-lg" 
                      style={{ backgroundColor: myProfile.accentColor || '#dc2626' }}
                    >
                      <Share2 className="w-3.5 h-3.5" /> Shareable Link
                    </button>
                    <button 
                      onClick={handleCopyLink}
                      className="flex-1 h-10 rounded-xl border border-white/10 bg-white/5 text-[11px] font-bold text-white flex items-center justify-center gap-2 transition-colors hover:bg-white/10 active:scale-95"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} 
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>

                  {/* Skills */}
                  {myProfile.skills && myProfile.skills.length > 0 && (
                    <div className="flex flex-col gap-2 mt-4">
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Core Skills</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {myProfile.skills.map((skill: any, idx: number) => (
                          <span key={idx} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] text-neutral-300">
                            {skill.name || skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {myProfile.projects && myProfile.projects.length > 0 && (
                    <div className="flex flex-col gap-2 mt-4">
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Featured Projects</h3>
                      <div className="flex flex-col gap-3">
                        {myProfile.projects.map((project: any, idx: number) => (
                          <div key={idx} className="w-full p-3 rounded-2xl bg-neutral-900/50 border border-white/5 flex gap-3 items-center group transition-colors hover:border-white/20">
                            <div className="w-12 h-12 rounded-xl bg-neutral-800 shrink-0 overflow-hidden relative">
                               <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `linear-gradient(to bottom right, ${myProfile.accentColor || '#dc2626'}, transparent)` }} />
                               <Layout className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-white group-hover:text-white transition-colors" style={{ color: myProfile.accentColor || '#dc2626' }}>{project.name}</span>
                              <span className="text-[9px] text-neutral-400 line-clamp-1">{project.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

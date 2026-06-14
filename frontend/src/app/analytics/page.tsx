"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiMock } from "../../utils/apiMock";
import { 
  Eye, Download, MousePointer, Monitor, Smartphone, Globe, 
  ArrowRight, ExternalLink, TrendingUp, Calendar, MapPin, 
  Sparkles, Clock
} from "lucide-react";

export default function AnalyticsPage() {
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

  const mockActivities = [
    { id: 1, event: "Recruiter from Google", detail: "Downloaded Resume PDF", time: "2 mins ago", icon: <Download className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 2, event: "Hiring Manager from Stripe", detail: "Clicked GitHub Portfolio", time: "15 mins ago", icon: <ExternalLink className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 3, event: "Talent Acquisition from Netflix", detail: "Viewed Featured Project", time: "1 hour ago", icon: <Eye className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 4, event: "Founder from YC Startup", detail: "Saved Contact vCard", time: "3 hours ago", icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
  ];

  const geoVisits = [
    { city: "San Francisco, USA", visits: 245, pct: "35%" },
    { city: "London, UK", visits: 168, pct: "24%" },
    { city: "Bengaluru, India", visits: 112, pct: "16%" },
    { city: "Tokyo, Japan", visits: 84, pct: "12%" },
    { city: "Other Locations", visits: 91, pct: "13%" },
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
              className="transition-colors duration-300 text-black font-black"
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
              href="/register"
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
          <div className="inline-flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-mono text-emerald-400 font-bold mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-Time Profile Insights</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Understand Your Reach
          </h1>
          <p className="text-sm md:text-base text-neutral-350 max-w-2xl mx-auto leading-relaxed">
            Gain deep, actionable feedback on how recruiters, hiring managers, and collaborators discover your profile and engage with your portfolio assets.
          </p>
        </div>

        {/* Core Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md flex flex-col gap-3">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-400 font-mono">
              <span>Profile Views</span>
              <Eye className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-5xl font-extrabold text-white">1,492</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>+18.4% this week</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md flex flex-col gap-3">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-400 font-mono">
              <span>Resume Downloads</span>
              <Download className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-5xl font-extrabold text-white">418</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>+12.1% this week</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md flex flex-col gap-3">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-400 font-mono">
              <span>Assets Interaction Rate</span>
              <MousePointer className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-5xl font-extrabold text-white">53.1%</span>
            <span className="text-xs text-neutral-400 font-semibold">Average clicks per profile visitor</span>
          </div>
        </div>

        {/* Detailed Insights & Geolocation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Left Column: Device & Geolocation */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Geolocation Table */}
            <div className="p-6 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-4.5 h-4.5 text-neutral-400" /> Geolocation Breakdown
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/5 border border-white/5 px-2.5 py-1 rounded-full text-neutral-300">
                  Global Traffic
                </span>
              </div>
              
              <div className="flex flex-col gap-4">
                {geoVisits.map((loc, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-neutral-200 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500" /> {loc.city}
                      </span>
                      <span className="font-mono text-neutral-350">{loc.visits} visits ({loc.pct})</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                      <div className="h-full bg-white/80 rounded-full" style={{ width: loc.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Device breakdown */}
            <div className="p-6 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md flex flex-col gap-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Monitor className="w-4.5 h-4.5 text-neutral-400" /> Browser & Device Stats
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-300 flex items-center gap-1.5"><Monitor className="w-4 h-4" /> Desktop</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                    <div className="h-full bg-white" style={{ width: "65%" }} />
                  </div>
                  <span className="text-[10px] text-neutral-400">Chrome, Safari, Firefox</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-300 flex items-center gap-1.5"><Smartphone className="w-4 h-4" /> Mobile</span>
                    <span>32%</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-400" style={{ width: "32%" }} />
                  </div>
                  <span className="text-[10px] text-neutral-400">iOS, Android WebView</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-300 flex items-center gap-1.5"><Globe className="w-4 h-4" /> Tablet</span>
                    <span>3%</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-600" style={{ width: "3%" }} />
                  </div>
                  <span className="text-[10px] text-neutral-400">iPadOS, Android Tablet</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Recruiter Feed */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            <div className="p-6 rounded-3xl border border-white/5 bg-neutral-950/50 backdrop-blur-md flex flex-col gap-6 h-full justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="w-4.5 h-4.5 text-emerald-400" /> Recent Visits Feed
                  </h3>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {mockActivities.map((act) => (
                    <div key={act.id} className="p-3.5 rounded-2xl border border-white/5 bg-white/5 flex gap-3 text-left">
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        {act.icon}
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-xs font-bold text-white truncate">{act.event}</span>
                        <span className="text-[10px] text-neutral-300 truncate">{act.detail}</span>
                        <span className="text-[9px] text-neutral-400 font-medium mt-0.5">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-center text-xs text-neutral-400 font-medium">
                Simulated real-time updates feed.
              </div>
            </div>

          </div>

        </div>

        {/* Call to Action Banner (Upgrade to Pro) */}
        <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-neutral-950/60 via-neutral-900/60 to-black/60 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 max-w-lg">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest bg-white/15 text-white font-mono font-bold self-center md:self-start flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" /> Pro Analytics
            </span>
            <h3 className="text-2xl font-bold text-white">Unlock Recruiter Tracking</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Find out exactly who is looking at your page. See company names, referral search terms, and receive instant email alerts when recruiters download your resume PDF.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
            <Link 
              href="/register"
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

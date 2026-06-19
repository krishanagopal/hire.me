"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { apiMock } from "../../utils/apiMock";
import { Mail, Lock, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";

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

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const triggerOAuth = async (provider: "google" | "github") => {
    try {
      setLoading(true);
      setError("");
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      // Note: We don't setLoading(false) here because the page will redirect to the OAuth provider
    } catch (err: any) {
      setError(err.message || `Failed to authenticate with ${provider}.`);
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
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/20" />
      </div>

      {/* Floating Back Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-neutral-200/50 text-neutral-800 hover:bg-neutral-50 active:scale-95 transition-all z-20 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
      </Link>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white text-neutral-900 rounded-[36px] shadow-[0_35px_100px_-20px_rgba(0,0,0,0.12)] p-3.5 flex flex-col md:flex-row overflow-hidden min-h-[620px] animate-in fade-in zoom-in-95 duration-500">
        
        {/* LEFT PANEL: Samurai Artwork */}
        <div className="relative w-full md:w-[46%] h-72 md:h-auto rounded-[24px] overflow-hidden flex flex-col justify-between p-6 bg-[#f0f0f2] md:[clip-path:polygon(0_0,_100%_0,_92%_100%,_0_100%)] select-none pointer-events-none">
          <img 
            src="/media__1781250813790.jpg" 
            alt="Samurai Dojo" 
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none" 
          />
          <div className="relative z-10 flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase tracking-widest text-[#dc2626] bg-white/80 border border-neutral-200/40 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
              hire.me
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 border border-neutral-200/40 text-neutral-800 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
              Explore
            </span>
          </div>
          <div className="relative z-10 flex items-center justify-between w-full mt-auto">
            <div className="flex items-center gap-3 bg-white/80 border border-neutral-200/40 backdrop-blur-md p-2.5 rounded-2xl shadow-sm">
              <div className="w-8.5 h-8.5 rounded-full bg-[#dc2626] flex items-center justify-center font-bold text-sm text-white shadow-sm">S</div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-neutral-900">samurai.dev</span>
                <span className="text-[10px] text-neutral-500 font-semibold">Join Dojo</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Auth Content Form */}
        <div className="relative flex-1 w-full md:w-[54%] flex flex-col justify-center px-6 py-8 md:px-12 md:py-10 bg-white">
          
          <div className="mb-6 text-left">
            <span className="font-black text-xl tracking-tight uppercase text-neutral-950">
              hire<span className="text-[#dc2626]">.me</span>
            </span>
          </div>

          <div className="flex flex-col gap-1.5 mb-8 text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950">
              Create account
            </h2>
            <span className="text-xs text-neutral-500 uppercase font-extrabold tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse"></span>
              Begin your journey here
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-3.5 mb-6 text-xs rounded-xl border border-rose-200/60 bg-rose-50/50 text-[#dc2626] text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#dc2626]" />
              <span>{error}</span>
            </div>
          )}

          {/* OAuth Buttons */}
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

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="h-[1px] flex-1 bg-neutral-100" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">OAuth Providers Only</span>
            <div className="h-[1px] flex-1 bg-neutral-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Profile, resolveMediaUrl } from "../utils/apiMock";
import { ExternalLink, FileText, Film, X, Play, User, Globe, Link as LinkIcon, Share2 } from "lucide-react";

// Inline brand icon SVGs
const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

interface ThemeLayoutProps {
  profile: Profile;
  onSocialClick: (platform: string) => void;
  onDownloadResume: () => void;
  onSaveContact: () => void;
  onVideoPlay: (projectName: string) => void;
}

// Client-side Resume Downloader helper
export const triggerResumeDownload = (p: Profile) => {
  if (!p.resumeUrl) {
    alert("No resume has been uploaded yet.");
    return;
  }
  const link = document.createElement("a");
  link.href = resolveMediaUrl(p.resumeUrl);
  link.setAttribute("download", p.resumeFileName || `${p.username}_resume.pdf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const triggerResumeShare = async (p: Profile) => {
  if (!p.resumeUrl) {
    alert("No resume has been uploaded yet.");
    return;
  }
  const url = resolveMediaUrl(p.resumeUrl);
  const shareData = {
    title: `${p.fullName || p.username}'s Resume`,
    text: `Check out ${p.fullName || p.username}'s resume!`,
    url: url.startsWith("data:") ? window.location.href : (url.startsWith("http") ? url : `${window.location.origin}${url}`),
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert("Resume link copied to clipboard!");
    }
  } catch (err) {
    console.error("Error sharing resume:", err);
    try {
      await navigator.clipboard.writeText(shareData.url);
      alert("Resume link copied to clipboard!");
    } catch (clipboardErr) {
      alert("Failed to share or copy link.");
    }
  }
};

export const triggerVCardDownload = (p: Profile) => {
  // Not generating any card, but keep for compatibility
};

export default function ThemeLayouts({
  profile,
  onSocialClick,
  onDownloadResume,
  onSaveContact,
  onVideoPlay,
}: ThemeLayoutProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeLightboxVideo, setActiveLightboxVideo] = useState<string | null>(null);
  const [showResumeViewer, setShowResumeViewer] = useState(false);

  const projects = profile.projects || [];

  const getYoutubeEmbedUrl = (url: string) => {
    let videoId = "";
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        videoId = match[2];
      }
    } catch (e) {}
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  };

  const getYoutubeThumbnailUrl = (url: string) => {
    let videoId = "";
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        videoId = match[2];
      }
    } catch (e) {}
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const accentColor = profile.accentColor || "#ff922b"; // default orange

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#ffdca3] via-[#ff9c50] to-[#e8590c] text-neutral-800 font-sans flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Background floating spheres inspired by reference image */}
      <div className="absolute top-[8%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-white/20 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#ffdca3]/40 blur-[110px] pointer-events-none" />
      <div className="absolute top-[45%] right-[5%] w-[200px] h-[200px] rounded-full bg-[#ffa94d]/40 blur-[70px] pointer-events-none" />
      <div className="absolute bottom-[35%] left-[8%] w-[250px] h-[250px] rounded-full bg-white/35 blur-[80px] pointer-events-none" />

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full flex items-center justify-between px-6 md:px-12 py-5 bg-white/20 backdrop-blur-md border-b border-white/25">
        <Link href="/" className="font-extrabold text-xl tracking-tight text-white drop-shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
          Evident
        </Link>
        <div className="flex items-center gap-3">
          {profile.tier === "pro" && (
            <span className="text-[10px] uppercase font-bold tracking-widest bg-white/10 px-2.5 py-1 rounded text-white border border-white/25 select-none">
              Pro Member
            </span>
          )}
          {profile.resumeUrl && (
            <button
              onClick={() => triggerResumeShare(profile)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 active:scale-95 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" /> Share Resume
            </button>
          )}
        </div>
      </header>

      {/* Main Content Card Container (Professional application form layout) */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-24 md:py-28 relative z-10">
        <div className="w-full p-8 md:p-12 rounded-[32px] border border-white/40 bg-white/95 backdrop-blur-xl shadow-[0_24px_70px_rgba(232,89,12,0.15)] flex flex-col gap-12">
          
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Candidate Portfolio Application</h2>
            <p className="text-xs text-neutral-500 font-semibold mt-1 uppercase tracking-wider">Filled profile state preview</p>
          </div>

          {/* Stepper / Progress Checklist Navigation (Always filled/completed in public view) */}
          <div className="flex justify-center items-center gap-2 md:gap-8 border-b border-neutral-150 pb-8 select-none">
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border-2 bg-emerald-500 text-white border-emerald-500 shadow-md">✓</div>
              <span className="text-[10px] md:text-xs mt-2 font-bold uppercase tracking-wider text-emerald-600">Basic Details</span>
            </div>
            <div className="w-8 md:w-16 h-[2px] bg-emerald-400 mb-6" />
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border-2 bg-emerald-500 text-white border-emerald-500 shadow-md">✓</div>
              <span className="text-[10px] md:text-xs mt-2 font-bold uppercase tracking-wider text-emerald-600">Contact Details</span>
            </div>
            <div className="w-8 md:w-16 h-[2px] bg-emerald-400 mb-6" />
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border-2 bg-emerald-500 text-white border-emerald-500 shadow-md">✓</div>
              <span className="text-[10px] md:text-xs mt-2 font-bold uppercase tracking-wider text-emerald-600">Verification</span>
            </div>
          </div>

          {/* SECTION 1: BASIC DETAILS */}
          <section className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-neutral-100 pb-10">
            <div className="flex-grow w-full flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#ff922b]" /> Basic Details
                </h3>
                <p className="text-xs text-neutral-400 mt-1">Personal information of candidate application profile.</p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Full Name</label>
                  <div className="w-full h-11 px-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex items-center text-sm font-semibold text-neutral-850 select-all">
                    {profile.fullName}
                  </div>
                </div>

                {/* Headline */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Headline</label>
                  <div className="w-full h-11 px-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex items-center text-sm font-semibold text-neutral-850 select-all">
                    {profile.headline || "Software Developer"}
                  </div>
                </div>

                {/* Short Bio */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Vision & Mission (Short Bio)</label>
                  <div className="w-full p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm font-semibold text-neutral-850 select-all min-h-[80px] leading-relaxed">
                    {profile.bio || "No summary provided."}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Photo Avatar (Mockup alignment) */}
            <div className="w-full md:w-44 flex flex-col items-center justify-center pt-8 shrink-0">
              <div className="w-24 h-24 rounded-full border border-neutral-200 bg-white flex items-center justify-center overflow-hidden shadow-md">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resolveMediaUrl(profile.avatarUrl)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-neutral-300" />
                )}
              </div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-3">Profile Photo</span>
            </div>
          </section>

          {/* SECTION 2: CONTACT DETAILS (Showcase Projects) */}
          <section className="flex flex-col gap-6 border-b border-neutral-100 pb-10">
            <div>
              <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <Play className="w-5 h-5 text-[#ff922b]" /> Showcase Projects ({projects.length})
              </h3>
              <p className="text-xs text-neutral-400 mt-1">Walkthrough projects and attachments submitted by the candidate.</p>
            </div>

            <div className="flex flex-col gap-6">
              {projects.map((proj, idx) => (
                <div key={idx} className="bg-neutral-50/70 border border-neutral-200/60 rounded-2xl p-6 md:p-8 flex flex-col gap-5 shadow-inner">
                  <div className="flex justify-between items-center border-b border-neutral-200/40 pb-3">
                    <span className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider">Project Showcase Details</span>
                    {proj.isFeatured && (
                      <span className="text-[9px] uppercase tracking-widest bg-[#ff922b]/10 text-[#ff922b] px-1.5 py-0.5 rounded border border-[#ff922b]/20">Primary Project</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Project Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Project Name</label>
                      <div className="w-full h-11 px-4 rounded-xl border border-neutral-250 bg-white flex items-center text-sm font-semibold text-neutral-850 select-all">
                        {proj.name}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Tech Stack</label>
                      <div className="w-full h-11 px-4 rounded-xl border border-neutral-250 bg-white flex items-center text-sm font-semibold text-neutral-850 select-all">
                        {proj.techStack ? proj.techStack.join(", ") : "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Project Description</label>
                    <div className="w-full p-4 rounded-xl border border-neutral-250 bg-white text-sm font-semibold text-neutral-850 select-all min-h-[70px] leading-relaxed">
                      {proj.description}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Github URL */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">GitHub Repository URL</label>
                      <div className="w-full h-11 px-4 rounded-xl border border-neutral-250 bg-white flex items-center text-sm font-semibold text-[#ff922b] select-all truncate">
                        {proj.githubUrl ? (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5 truncate">
                            {proj.githubUrl} <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        ) : "N/A"}
                      </div>
                    </div>

                    {/* Live Site URL */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Live Site URL</label>
                      <div className="w-full h-11 px-4 rounded-xl border border-neutral-250 bg-white flex items-center text-sm font-semibold text-[#ff922b] select-all truncate">
                        {proj.liveUrl ? (
                          <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5 truncate">
                            {proj.liveUrl} <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        ) : "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Attachments & Previews row (video 50px*30px & screenshots) */}
                  <div className="flex flex-col gap-2 border-t border-neutral-200/50 pt-4 mt-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Attachments & Previews</label>
                    <div className="flex flex-wrap items-center gap-3">
                      
                      {/* Compact Video Preview: 200px * 120px */}
                      {proj.demoVideoUrl && (
                        <div 
                          onClick={() => setActiveLightboxVideo(resolveMediaUrl(proj.demoVideoUrl) || null)}
                          className="w-[200px] h-[120px] rounded-xl border border-neutral-300 overflow-hidden bg-black shrink-0 relative cursor-pointer shadow-md hover:border-[#ff922b]/50 group"
                          title="Click to play demo video"
                        >
                          {proj.demoVideoUrl.startsWith("data:video/") || proj.demoVideoUrl.includes(".mp4") || proj.demoVideoUrl.includes("/media/") ? (
                            <video src={resolveMediaUrl(proj.demoVideoUrl)} className="w-full h-full object-cover pointer-events-none" preload="none" />
                          ) : (
                            getYoutubeThumbnailUrl(proj.demoVideoUrl) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={getYoutubeThumbnailUrl(proj.demoVideoUrl) || ""} alt="YT preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                                <Play className="w-8 h-8 text-white fill-white drop-shadow-md" />
                              </div>
                            )
                          )}
                          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                            <Play className="w-8 h-8 text-white fill-white drop-shadow-md" />
                          </div>
                        </div>
                      )}

                      {/* Compact Screenshots Previews */}
                      {proj.screenshots && proj.screenshots.map((src: string, sIdx: number) => (
                        <div 
                          key={sIdx}
                          onClick={() => setLightboxImage(resolveMediaUrl(src))}
                          className="w-[200px] h-[120px] rounded-xl border border-neutral-300 overflow-hidden bg-neutral-100 shrink-0 relative cursor-pointer shadow-md hover:border-[#ff922b]/50 transition-all"
                          title="Click to enlarge screenshot"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={resolveMediaUrl(src)} alt={`Screenshot ${sIdx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}

                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: VERIFICATION (Resume & Social Links) */}
          <section className="flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#ff922b]" /> Verification & Resume
              </h3>
              <p className="text-xs text-neutral-400 mt-1">Social links verify channels and uploaded resume attachments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Sub-column: Social Links */}
              <div className="flex flex-col gap-4">
                {/* LinkedIn */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-450 flex items-center gap-1">
                    <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" /> LinkedIn Profile
                  </label>
                  <div className="w-full h-11 px-4 rounded-xl border border-neutral-350 bg-neutral-50/50 flex items-center text-sm font-semibold text-neutral-850 select-all truncate">
                    {profile.socialLinks?.linkedin ? (
                      <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:underline truncate">
                        {profile.socialLinks.linkedin}
                      </a>
                    ) : "N/A"}
                  </div>
                </div>

                {/* GitHub */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-450 flex items-center gap-1">
                    <Github className="w-3.5 h-3.5 text-neutral-800" /> GitHub Profile
                  </label>
                  <div className="w-full h-11 px-4 rounded-xl border border-neutral-350 bg-neutral-50/50 flex items-center text-sm font-semibold text-neutral-850 select-all truncate">
                    {profile.socialLinks?.github ? (
                      <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="hover:underline truncate">
                        {profile.socialLinks.github}
                      </a>
                    ) : "N/A"}
                  </div>
                </div>

                {/* Twitter */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-450 flex items-center gap-1">
                    <Twitter className="w-3.5 h-3.5 text-sky-400" /> Twitter / X Profile
                  </label>
                  <div className="w-full h-11 px-4 rounded-xl border border-neutral-350 bg-neutral-50/50 flex items-center text-sm font-semibold text-neutral-850 select-all truncate">
                    {profile.socialLinks?.twitter ? (
                      <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:underline truncate">
                        {profile.socialLinks.twitter}
                      </a>
                    ) : "N/A"}
                  </div>
                </div>
              </div>

              {/* Right Sub-column: PDF Resume Preview & Permanent link */}
              <div className="flex flex-col gap-6">
                
                {/* Resume preview element */}
                <div className="flex flex-col gap-2 p-5 bg-[#ff922b]/5 border border-[#ff922b]/15 rounded-2xl">
                  <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700">Resume Document Attachment</label>
                  
                  <div className="flex items-center gap-3 mt-1.5">
                    {profile.resumeUrl ? (
                      <>
                        {/* Compact Resume Preview: 200px * 120px */}
                        <div 
                          onClick={() => setShowResumeViewer(true)}
                          className="w-[200px] h-[120px] rounded-xl border border-neutral-350 bg-white hover:bg-neutral-50 flex flex-col justify-between shrink-0 cursor-pointer shadow-md hover:border-[#ff922b]/50 group transition-all relative overflow-hidden"
                        >
                          <iframe 
                            src={`${resolveMediaUrl(profile.resumeUrl)}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`} 
                            className="absolute top-0 left-[-5px] w-[600px] h-[848px] border-0 pointer-events-none select-none" 
                            style={{ 
                              transform: "scale(0.35) translateZ(0)", 
                              transformOrigin: "top left", 
                              backfaceVisibility: "hidden", 
                              willChange: "transform",
                              imageRendering: "-webkit-optimize-contrast"
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                            <span className="bg-[#ff922b] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                              View Resume
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col truncate">
                          <span className="text-xs text-neutral-800 font-extrabold truncate">{profile.resumeFileName || "resume.pdf"}</span>
                          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider cursor-pointer hover:underline" onClick={onDownloadResume}>Download PDF</span>
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-neutral-450">No resume document uploaded.</span>
                    )}
                  </div>
                </div>

                {/* Permanent showcase URL info */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Showcase Link URL</label>
                  <div className="w-full h-11 px-4 rounded-xl border border-neutral-300 bg-white/70 flex items-center text-sm font-mono text-[#ff922b] select-all truncate">
                    <Globe className="w-4 h-4 text-neutral-400 shrink-0 mr-2" />
                    <span>http://localhost:3000/{profile.username}</span>
                  </div>
                </div>

              </div>

            </div>
          </section>

        </div>
      </main>

      {/* Lightbox Video Player Modal */}
      {activeLightboxVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-pointer animate-fade-in" 
          onClick={() => setActiveLightboxVideo(null)}
        >
          <div 
            className="relative max-w-4xl w-full aspect-video bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-50 p-2 text-white bg-black/60 hover:bg-black/80 rounded-xl transition-all cursor-pointer"
              onClick={() => setActiveLightboxVideo(null)}
            >
              <X className="w-5 h-5" />
            </button>
            
            {activeLightboxVideo.startsWith("https://www.youtube.com") || activeLightboxVideo.includes("youtube.com") || activeLightboxVideo.includes("youtu.be") ? (
              getYoutubeEmbedUrl(activeLightboxVideo) ? (
                <iframe
                  src={getYoutubeEmbedUrl(activeLightboxVideo) || ""}
                  title="Project Video Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <span className="text-white text-sm font-semibold">Invalid YouTube Video Link</span>
              )
            ) : (
              <video
                src={activeLightboxVideo}
                controls
                autoPlay
                className="w-full h-full object-contain bg-black"
              />
            )}
          </div>
        </div>
      )}

      {/* Lightbox Full Image Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-pointer" onClick={() => setLightboxImage(null)}>
          <div className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center gap-4" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 px-4 py-2 text-white hover:bg-white/10 font-bold text-xs uppercase bg-white/5 border border-white/10 rounded-xl transition-all cursor-pointer"
              onClick={() => setLightboxImage(null)}
            >
              Close
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxImage} alt="Screenshot Preview" className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/15 shadow-2xl" />
          </div>
        </div>
      )}

      {/* Scrollable PDF Resume Viewer Modal */}
      {showResumeViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-pointer" onClick={() => setShowResumeViewer(false)}>
          <div 
            className="relative max-w-4xl w-full h-[85vh] bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col cursor-default animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-950/40">
              <span className="text-sm font-extrabold uppercase tracking-wider text-neutral-300">Resume Viewer</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => triggerResumeShare(profile)}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share Resume
                </button>
                <button
                  onClick={onDownloadResume}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-950 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  style={{ backgroundColor: accentColor }}
                >
                  <FileText className="w-3.5 h-3.5" /> Download PDF
                </button>
                <button 
                  className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                  onClick={() => setShowResumeViewer(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body with Embed/Iframe */}
            <div className="flex-grow w-full h-full relative bg-neutral-950">
              {/* Fallback load screen */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 bg-neutral-950 text-neutral-400 -z-10">
                <FileText className="w-10 h-10 text-neutral-600 animate-pulse" />
                <span className="text-xs font-bold tracking-widest uppercase">Loading Resume PDF Preview...</span>
                <button
                  onClick={onDownloadResume}
                  className="mt-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Download PDF Instead
                </button>
              </div>
              
              <iframe 
                src={resolveMediaUrl(profile.resumeUrl)} 
                title={`${profile.fullName}'s Resume`} 
                className="w-full h-full border-0 relative z-10"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-8 text-center relative z-10 bg-white/10 backdrop-blur-md border-t border-white/20">
        <span className="text-xs text-white drop-shadow-sm font-semibold">
          Showcase link generated via <span className="font-extrabold text-white">Evident</span>
        </span>
      </footer>
    </div>
  );
}

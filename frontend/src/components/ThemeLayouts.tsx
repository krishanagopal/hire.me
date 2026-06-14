"use client";

import React, { useState } from "react";
import { Profile } from "../utils/apiMock";
import { ExternalLink, FileText, Film } from "lucide-react";

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
  link.href = p.resumeUrl;
  link.setAttribute("download", p.resumeFileName || `${p.username}_resume.pdf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Dummy helper just in case external imports require it
export const triggerVCardDownload = (p: Profile) => {
  // Not generating any card, but let's keep it for compatibility
};

export default function ThemeLayouts({
  profile,
  onSocialClick,
  onDownloadResume,
  onSaveContact,
  onVideoPlay,
}: ThemeLayoutProps) {
  const [playVideo, setPlayVideo] = useState(false);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const projects = profile.projects || [];
  const currentProject = projects.length > 0 && activeProjectIdx < projects.length ? projects[activeProjectIdx] : null;

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

  const handlePlay = () => {
    setPlayVideo(true);
    if (currentProject) {
      onVideoPlay(currentProject.name);
    }
  };

  const handleProjectSwitch = (idx: number) => {
    setActiveProjectIdx(idx);
    setPlayVideo(false);
  };

  const embedUrl = currentProject && currentProject.demoVideoUrl ? getYoutubeEmbedUrl(currentProject.demoVideoUrl) : null;
  const accentColor = profile.accentColor || "#3b82f6"; // default blue

  return (
    <div className="min-h-screen w-full bg-[#030304] text-white font-sans flex flex-col justify-between relative overflow-hidden">
      {/* Background Liquid Glows */}
      <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full flex items-center justify-between px-6 md:px-12 py-5 bg-neutral-950/20 backdrop-blur-md border-b border-white/5">
        <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-300 to-neutral-600 bg-clip-text text-transparent">
          hire.me
        </span>
        <div className="flex items-center gap-3">
          {profile.tier === "pro" && (
            <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-500/10 px-2.5 py-1 rounded text-blue-400 border border-blue-500/20 select-none">
              Pro Member
            </span>
          )}
          {profile.resumeUrl && (
            <button
              onClick={onDownloadResume}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-950 hover:brightness-110 active:scale-95 transition-all"
              style={{ backgroundColor: accentColor }}
            >
              <FileText className="w-4 h-4" /> Download Resume
            </button>
          )}
        </div>
      </header>

      {/* Main Content Showcase */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 md:py-16 flex flex-col gap-12 relative z-10">
        
        {/* Profile Info Header */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-white">
              {profile.fullName}
            </h1>
            <p className="text-lg md:text-xl font-medium tracking-wide" style={{ color: accentColor }}>
              {profile.headline || "Professional Showcase"}
            </p>
          </div>
          {profile.bio && (
            <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Project Switcher Tabs */}
        {projects.length > 1 && (
          <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
            {projects.map((proj, idx) => (
              <button
                key={proj._id || proj.id || idx}
                onClick={() => handleProjectSwitch(idx)}
                className={`px-4.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-all ${
                  activeProjectIdx === idx
                    ? "bg-white text-neutral-950 border-white shadow-xl shadow-white/5"
                    : "border-white/5 bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                {proj.name}
              </button>
            ))}
          </div>
        )}

        {/* Video Player & Project Showcase */}
        {currentProject ? (
          <div className="flex flex-col gap-6">
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-neutral-950 border border-white/10 shadow-2xl shadow-indigo-500/5 animate-fade-in">
              {playVideo && currentProject.demoVideoUrl ? (
                embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={`${currentProject.name} Demo Video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    src={currentProject.demoVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                  />
                )
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-950/80">
                  {currentProject.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={currentProject.thumbnailUrl} alt={currentProject.name} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                  ) : null}
                  <button
                    onClick={handlePlay}
                    className="z-10 p-5 rounded-full bg-white/15 hover:bg-white/25 border hover:scale-105 active:scale-95 transition-all text-white flex items-center justify-center"
                    style={{ borderColor: accentColor }}
                  >
                    <Film className="w-8 h-8 text-white" />
                  </button>
                  <span className="z-10 text-xs font-bold uppercase tracking-widest text-neutral-400">Play Project Demo Video</span>
                </div>
              )}
            </div>

            {/* Project Details */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 p-2">
              <div className="flex flex-col gap-2">
                <span className="text-xl font-bold text-white">{currentProject.name}</span>
                {currentProject.description && (
                  <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">{currentProject.description}</p>
                )}
                {currentProject.techStack && currentProject.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentProject.techStack.map((tech, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-neutral-350">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Action Links */}
              <div className="flex gap-3 shrink-0">
                {currentProject.githubUrl && (
                  <a
                    href={currentProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => onSocialClick("github")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
                  >
                    <Github className="w-4 h-4" /> Code Repository
                  </a>
                )}
                {currentProject.liveUrl && (
                  <a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => onSocialClick("portfolio")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-neutral-950 font-bold hover:brightness-110 active:scale-95 transition-all text-xs font-bold uppercase tracking-wider"
                    style={{ backgroundColor: accentColor }}
                  >
                    <ExternalLink className="w-4 h-4" /> Live Site
                  </a>
                )}
              </div>
            </div>

            {/* Project Screenshots Grid */}
            {currentProject.screenshots && currentProject.screenshots.length > 0 && (
              <div className="flex flex-col gap-3.5 border-t border-white/5 pt-6 mt-2">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Project Screenshots</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentProject.screenshots.map((src, i) => (
                    <div 
                      key={i} 
                      className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-950 border border-white/5 cursor-pointer hover:border-white/10 transition-all group"
                      onClick={() => setLightboxImage(src)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 bg-neutral-950/20">
            <span className="text-sm text-neutral-400">No project showcase has been set up yet.</span>
          </div>
        )}

        {/* Social Connection Channels */}
        {profile.socialLinks && (
          <div className="flex flex-col gap-4 border-t border-white/5 pt-10">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-500 text-center md:text-left">
              Connect Channels
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onSocialClick("linkedin")}
                  className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all text-sm font-semibold"
                >
                  <Linkedin className="w-5 h-5 text-blue-400" /> LinkedIn
                </a>
              )}
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onSocialClick("github")}
                  className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all text-sm font-semibold"
                >
                  <Github className="w-5 h-5 text-neutral-350" /> GitHub
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onSocialClick("twitter")}
                  className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all text-sm font-semibold"
                >
                  <Twitter className="w-5 h-5 text-sky-400" /> Twitter/X
                </a>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Lightbox Full Image Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 cursor-pointer" onClick={() => setLightboxImage(null)}>
          <div className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center gap-4" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 px-4 py-2 text-white hover:bg-white/10 font-bold text-xs uppercase bg-white/5 border border-white/10 rounded-xl transition-all"
              onClick={() => setLightboxImage(null)}
            >
              Close
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxImage} alt="Screenshot Preview" className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/15 shadow-2xl" />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-8 text-center border-t border-white/5 relative z-10 bg-[#030304]/80 backdrop-blur-md">
        <span className="text-xs text-neutral-500 font-medium tracking-wide">
          Showcase link generated via <span className="font-bold text-neutral-400">hire.me</span>
        </span>
      </footer>
    </div>
  );
}

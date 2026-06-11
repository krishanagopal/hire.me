"use client";

import React from "react";
import { Profile } from "../utils/apiMock";
import { 
  Globe, Phone, MapPin, Mail, 
  ExternalLink, FileText, Download, UserPlus, Award
} from "lucide-react";

// Inline brand icon SVGs to prevent lucide deprecation errors
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
}

// Client-side vCard Generator
export const triggerVCardDownload = (p: Profile) => {
  const vcardContent = `BEGIN:VCARD
VERSION:3.0
N:${p.name};;;
FN:${p.name}
TEL;TYPE=CELL:${p.phone}
EMAIL;TYPE=PREF,INTERNET:${p.email}
URL:${typeof window !== "undefined" ? window.location.origin : ""}/${p.username}
TITLE:${p.headline}
NOTE:hire.me Public Identity: ${typeof window !== "undefined" ? window.location.origin : ""}/${p.username}
END:VCARD`;

  const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${p.username}_contact.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Client-side Resume Downloader
export const triggerResumeDownload = (p: Profile) => {
  if (!p.resumeUrl) {
    alert("No resume has been uploaded by the user yet.");
    return;
  }
  const link = document.createElement("a");
  link.href = p.resumeUrl;
  link.setAttribute("download", p.resumeFileName || `${p.username}_resume.pdf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function ThemeLayouts({
  profile,
  onSocialClick,
  onDownloadResume,
  onSaveContact,
}: ThemeLayoutProps) {
  // Select which theme to render
  switch (profile.theme) {
    case "minimal":
      return <MinimalTheme profile={profile} onSocialClick={onSocialClick} onDownloadResume={onDownloadResume} onSaveContact={onSaveContact} />;
    case "corporate":
      return <CorporateTheme profile={profile} onSocialClick={onSocialClick} onDownloadResume={onDownloadResume} onSaveContact={onSaveContact} />;
    case "developer":
      return <DeveloperTheme profile={profile} onSocialClick={onSocialClick} onDownloadResume={onDownloadResume} onSaveContact={onSaveContact} />;
    case "dark":
      return <DarkTheme profile={profile} onSocialClick={onSocialClick} onDownloadResume={onDownloadResume} onSaveContact={onSaveContact} />;
    case "modern":
    default:
      return <ModernTheme profile={profile} onSocialClick={onSocialClick} onDownloadResume={onDownloadResume} onSaveContact={onSaveContact} />;
  }
}

// ----------------------------------------------------
// 1. MODERN GLOW THEME (Sleek card grids, warm highlights)
// ----------------------------------------------------
function ModernTheme({ profile, onSocialClick, onDownloadResume, onSaveContact }: ThemeLayoutProps) {
  return (
    <div className="min-h-screen bg-[#060608] text-neutral-100 flex flex-col font-sans">
      
      {/* Banner */}
      <div 
        className="w-full h-48 md:h-64 bg-neutral-900 bg-cover bg-center"
        style={{ backgroundImage: `url(${profile.bannerUrl})` }}
      />

      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 -mt-20 flex-1 pb-16 flex flex-col gap-8">
        
        {/* Profile Header Card */}
        <div className="p-6 md:p-8 rounded-3xl border border-white/5 bg-neutral-950/70 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div 
              className="w-24 h-24 rounded-full border-2 overflow-hidden shrink-0 bg-neutral-900"
              style={{ borderColor: profile.accentColor }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {profile.avatarUrl && <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{profile.name}</h1>
              <span className="text-sm font-semibold mt-0.5" style={{ color: profile.accentColor }}>{profile.headline}</span>
              <span className="text-xs text-neutral-400 mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {profile.resumeUrl && (
              <button 
                onClick={onDownloadResume}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-neutral-950 hover:opacity-90 transition-all active:scale-95"
                style={{ backgroundColor: profile.accentColor }}
              >
                <FileText className="w-4 h-4" /> Download Resume
              </button>
            )}
            <button 
              onClick={onSaveContact}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" /> Save Contact
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Left: About & Socials */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col gap-4">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">About Me</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">{profile.bio}</p>
            </div>

            {/* Social Links */}
            <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col gap-4">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">Connect</h3>
              <div className="flex flex-wrap gap-2.5">
                {profile.socialLinks.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" onClick={() => onSocialClick("github")} className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" onClick={() => onSocialClick("linkedin")} className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {profile.socialLinks.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" onClick={() => onSocialClick("twitter")} className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {profile.socialLinks.portfolio && (
                  <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" onClick={() => onSocialClick("portfolio")} className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: Skills, Projects, Certifications */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Skills */}
            <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col gap-4">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-full border border-white/5 bg-white/5 text-xs text-neutral-300">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 px-1">Featured Projects</h3>
              <div className="grid grid-cols-1 gap-4">
                {profile.projects.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-base font-extrabold">{p.name}</span>
                      <p className="text-xs text-neutral-400 leading-relaxed max-w-lg">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {p.techStack.map((t, idx) => (
                          <span key={idx} className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex sm:flex-col justify-end gap-2.5 shrink-0">
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-[11px] font-bold uppercase tracking-wider text-neutral-300 hover:text-white">
                          <Github className="w-3.5 h-3.5" /> Repository
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider text-neutral-950 hover:opacity-90" style={{ backgroundColor: profile.accentColor }}>
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {profile.certifications.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">Certifications</h3>
                <div className="flex flex-col gap-3">
                  {profile.certifications.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5 text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold">{c.name}</span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">{c.issuer} • {c.issueDate}</span>
                      </div>
                      {c.credentialUrl && (
                        <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. MINIMAL THEME (Flat borders, white canvas look, serif accents)
// ----------------------------------------------------
function MinimalTheme({ profile, onSocialClick, onDownloadResume, onSaveContact }: ThemeLayoutProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-serif">
      <div className="w-full max-w-3xl mx-auto px-6 py-16 flex-1 flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-stone-200 pb-8 gap-6">
          <div className="flex flex-col">
            <h1 className="text-4xl font-light tracking-tight">{profile.name}</h1>
            <span className="text-xs font-semibold uppercase tracking-widest mt-1.5 font-sans" style={{ color: profile.accentColor }}>{profile.headline}</span>
            <span className="text-xs text-stone-500 mt-2 font-sans flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
          </div>
          <div className="flex items-center gap-3 font-sans shrink-0">
            {profile.resumeUrl && (
              <button 
                onClick={onDownloadResume}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:opacity-90 transition-all"
                style={{ backgroundColor: profile.accentColor }}
              >
                Resume
              </button>
            )}
            <button 
              onClick={onSaveContact}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-all"
            >
              Contact
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs uppercase tracking-widest text-stone-400 font-sans font-bold">Summary</h3>
          <p className="text-lg font-light leading-relaxed text-stone-700">{profile.bio}</p>
        </div>

        {/* Skills */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs uppercase tracking-widest text-stone-400 font-sans font-bold">Skills</h3>
          <div className="flex flex-wrap gap-2 font-sans">
            {profile.skills.map((s, idx) => (
              <span key={idx} className="px-3 py-1 border border-stone-200 bg-white text-xs text-stone-600 rounded">
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xs uppercase tracking-widest text-stone-400 font-sans font-bold">Projects</h3>
          <div className="flex flex-col gap-6 divide-y divide-stone-100">
            {profile.projects.map((p, idx) => (
              <div key={p.id} className={`flex flex-col gap-2 ${idx > 0 ? "pt-6" : ""}`}>
                <span className="text-xl font-light hover:underline cursor-pointer">{p.name}</span>
                <p className="text-sm text-stone-600 leading-relaxed">{p.description}</p>
                <div className="flex justify-between items-center mt-2 font-sans">
                  <div className="flex gap-2">
                    {p.techStack.map((t, i) => (
                      <span key={i} className="text-[10px] text-stone-400 uppercase tracking-wider">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-stone-800 hover:underline">Repo</a>}
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-xs font-bold hover:underline" style={{ color: profile.accentColor }}>Demo</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        {profile.certifications.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase tracking-widest text-stone-400 font-sans font-bold">Certifications</h3>
            <div className="flex flex-col gap-3 font-sans">
              {profile.certifications.map((c) => (
                <div key={c.id} className="flex justify-between items-center text-xs text-stone-600 border-b border-stone-100 pb-2">
                  <span>{c.name} — <span className="text-stone-400">{c.issuer}</span></span>
                  <span className="text-stone-400 font-mono">{c.issueDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-stone-200 pt-8 mt-12 flex justify-between items-center font-sans text-xs text-stone-400">
          <span>hire.me/{profile.username}</span>
          <div className="flex gap-4">
            {profile.socialLinks.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-stone-900">GitHub</a>}
            {profile.socialLinks.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-stone-900">LinkedIn</a>}
          </div>
        </footer>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. CORPORATE THEME (Solid grids, traditional card boards)
// ----------------------------------------------------
function CorporateTheme({ profile, onSocialClick, onDownloadResume, onSaveContact }: ThemeLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-neutral-800 flex flex-col font-sans">
      
      {/* Header bar */}
      <header className="bg-white border-b border-neutral-200 py-6 px-6 md:px-12 sticky top-0 z-20">
        <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded border border-neutral-200 overflow-hidden bg-neutral-100">
              {profile.avatarUrl && <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-neutral-900">{profile.name}</h1>
              <span className="text-xs text-neutral-500 font-medium">{profile.headline}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {profile.resumeUrl && (
              <button 
                onClick={onDownloadResume}
                className="px-4 py-2 rounded text-xs font-bold text-white hover:opacity-90 transition-all active:scale-95"
                style={{ backgroundColor: profile.accentColor }}
              >
                Download Resume
              </button>
            )}
            <button 
              onClick={onSaveContact}
              className="px-4 py-2 rounded text-xs font-bold border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 transition-all active:scale-95"
            >
              Add Contact
            </button>
          </div>
        </div>
      </header>

      {/* Main body content */}
      <main className="w-full max-w-4xl mx-auto px-4 md:px-8 py-10 flex-grow flex flex-col gap-6">
        
        {/* Bio Card */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm flex flex-col gap-3">
          <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400">Professional Summary</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">{profile.bio}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 border-t border-neutral-100 pt-3 mt-1">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-neutral-400" /> {profile.location}</span>
            {profile.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4 text-neutral-400" /> {profile.phone}</span>
            }
            <span className="flex items-center gap-1"><Mail className="w-4 h-4 text-neutral-400" /> {profile.email}</span>
          </div>
        </div>

        {/* Skills Card */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm flex flex-col gap-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400">Core Competencies</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, idx) => (
              <span key={idx} className="px-3 py-1 bg-neutral-100 text-xs font-semibold rounded text-neutral-600">
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Projects list */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400 px-1">Case Studies / Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.projects.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-base font-bold text-neutral-900">{p.name}</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">{p.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-[11px] font-bold font-mono text-neutral-400">
                  <div className="flex gap-2">
                    {p.techStack.slice(0, 3).map((t, i) => (
                      <span key={i} className="uppercase">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-2.5">
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-neutral-700 hover:underline">Repo</a>}
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: profile.accentColor }}>Demo</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

// ----------------------------------------------------
// 4. DEVELOPER THEME (Monospace fonts, terminal box styles)
// ----------------------------------------------------
function DeveloperTheme({ profile, onSocialClick, onDownloadResume, onSaveContact }: ThemeLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-emerald-400 flex flex-col font-mono selection:bg-emerald-500 selection:text-neutral-950">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-12 flex-1 pb-24 flex flex-col gap-8">
        
        {/* Terminal Header */}
        <div className="p-4 rounded-t-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs text-neutral-500">guest@hire:~/{profile.username}</span>
          <div className="w-6" />
        </div>

        {/* Terminal Board */}
        <div className="p-6 md:p-8 rounded-b-xl border-x border-b border-neutral-800 bg-neutral-950 flex flex-col gap-8">
          
          {/* User Meta */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-neutral-500 font-bold">&gt; INITIALIZING PROFILE</span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{profile.name}</h1>
              <span className="text-xs text-emerald-300 font-semibold">{profile.headline}</span>
              <span className="text-xs text-neutral-400 mt-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              {profile.resumeUrl && (
                <button 
                  onClick={onDownloadResume}
                  className="px-4 py-2 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-neutral-950 transition-all text-xs font-bold"
                >
                  $ cat resume.pdf
                </button>
              )}
              <button 
                onClick={onSaveContact}
                className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:border-white hover:text-white transition-all text-xs font-bold"
              >
                $ export contact
              </button>
            </div>
          </div>

          {/* Console Bio */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-500">&gt; cat bio.txt</span>
            <p className="text-sm text-neutral-300 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Skills Console */}
          <div className="flex flex-col gap-3">
            <span className="text-neutral-500">&gt; show --skills</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
              {profile.skills.map((s, idx) => (
                <div key={idx} className="p-2 border border-neutral-800 bg-neutral-900/50 rounded flex flex-col">
                  <span className="text-white font-bold">{s.name}</span>
                  <span className="text-[10px] text-neutral-500 uppercase mt-0.5">{s.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Console */}
          <div className="flex flex-col gap-4">
            <span className="text-neutral-500">&gt; ls featured-projects/</span>
            <div className="grid grid-cols-1 gap-4">
              {profile.projects.map((p) => (
                <div key={p.id} className="p-5 border border-neutral-800 bg-neutral-900/10 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-white">{p.name}</span>
                    <div className="flex gap-3 text-xs">
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline">git</a>}
                      {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline">url</a>}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{p.description}</p>
                  <div className="text-[10px] text-neutral-500">
                    STACK: {p.techStack.join(" | ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. DARK CYBERPUNK THEME (Navy gradients, glass cards, neon)
// ----------------------------------------------------
function DarkTheme({ profile, onSocialClick, onDownloadResume, onSaveContact }: ThemeLayoutProps) {
  return (
    <div className="min-h-screen bg-[#070714] text-white flex flex-col font-sans">
      
      {/* Banner */}
      <div 
        className="w-full h-48 md:h-64 bg-neutral-950 bg-cover bg-center"
        style={{ backgroundImage: `url(${profile.bannerUrl})` }}
      />

      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 -mt-20 flex-1 pb-24 flex flex-col gap-8">
        
        {/* Header Glass Card */}
        <div className="p-6 md:p-8 rounded-3xl border border-indigo-500/15 bg-neutral-950/50 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-indigo-500/10 blur-[40px] pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-fuchsia-500/10 blur-[40px] pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-24 h-24 rounded-full border border-fuchsia-500/30 overflow-hidden shrink-0 bg-neutral-900 shadow-lg shadow-fuchsia-500/10">
              {profile.avatarUrl && <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-fuchsia-400 bg-clip-text text-transparent">{profile.name}</h1>
              <span className="text-sm font-semibold mt-0.5 text-fuchsia-400">{profile.headline}</span>
              <span className="text-xs text-neutral-400 mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 relative z-10">
            {profile.resumeUrl && (
              <button 
                onClick={onDownloadResume}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:brightness-110 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                <FileText className="w-4 h-4" /> Download Resume
              </button>
            )}
            <button 
              onClick={onSaveContact}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" /> Save Contact
            </button>
          </div>
        </div>

        {/* Content Grids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Left panel: Bio & links */}
          <div className="md:col-span-1 flex flex-col gap-6">
            
            {/* Bio */}
            <div className="p-6 rounded-2xl border border-indigo-500/10 bg-neutral-950/40 backdrop-blur-xl flex flex-col gap-4">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-fuchsia-400">Transmission</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">{profile.bio}</p>
            </div>

            {/* Social Links */}
            <div className="p-6 rounded-2xl border border-indigo-500/10 bg-neutral-950/40 backdrop-blur-xl flex flex-col gap-4">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-fuchsia-400">Console Links</h3>
              <div className="flex flex-wrap gap-2.5">
                {profile.socialLinks.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" onClick={() => onSocialClick("github")} className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-indigo-500/10 text-neutral-300 hover:text-white transition-all">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" onClick={() => onSocialClick("linkedin")} className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-indigo-500/10 text-neutral-300 hover:text-white transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {profile.socialLinks.portfolio && (
                  <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-indigo-500/10 text-neutral-300 hover:text-white transition-all">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Right Panel: Skills & Projects */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Skills */}
            <div className="p-6 rounded-2xl border border-indigo-500/10 bg-neutral-950/40 backdrop-blur-xl flex flex-col gap-4">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-fuchsia-400">Core Systems</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-full border border-indigo-500/10 bg-indigo-950/20 text-xs text-indigo-300">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-fuchsia-400 px-1">Active Modules</h3>
              <div className="grid grid-cols-1 gap-4">
                {profile.projects.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl border border-indigo-500/10 bg-neutral-950/40 backdrop-blur-xl flex flex-col sm:flex-row justify-between gap-4 relative overflow-hidden">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-base font-extrabold text-white">{p.name}</span>
                      <p className="text-xs text-neutral-400 leading-relaxed max-w-lg">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {p.techStack.map((t, idx) => (
                          <span key={idx} className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex sm:flex-col justify-end gap-2.5 shrink-0 relative z-10">
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-[11px] font-bold uppercase tracking-wider text-neutral-300 hover:text-white">
                          <Github className="w-3.5 h-3.5" /> Repository
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:brightness-110 transition-all">
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

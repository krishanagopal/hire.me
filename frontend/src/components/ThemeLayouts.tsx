"use client";

import React, { useState } from "react";
import { Profile, Project, Experience, Education, Certification } from "../utils/apiMock";
import { 
  Globe, Phone, MapPin, Mail, 
  ExternalLink, FileText, Download, UserPlus, Award,
  Briefcase, BookOpen, Film
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
  onVideoPlay: (projectName: string) => void;
}

// Client-side vCard Generator
export const triggerVCardDownload = (p: Profile) => {
  const vcardContent = `BEGIN:VCARD
VERSION:3.0
N:${p.fullName};;;
FN:${p.fullName}
TEL;TYPE=CELL:${p.phone || ""}
EMAIL;TYPE=PREF,INTERNET:${p.email}
URL:${typeof window !== "undefined" ? window.location.origin : ""}/${p.username}
TITLE:${p.headline || p.role || ""}
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

// Reusable custom ProjectCard with featured badge & click-to-play video demo player
function ProjectCard({ 
  project, 
  accentColor, 
  theme, 
  onGithubClick, 
  onLiveClick, 
  onVideoPlay 
}: { 
  project: Project; 
  accentColor: string; 
  theme: string; 
  onGithubClick: () => void; 
  onLiveClick: () => void; 
  onVideoPlay: () => void;
}) {
  const [playVideo, setPlayVideo] = useState(false);

  const handlePlay = () => {
    setPlayVideo(true);
    onVideoPlay();
  };

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

  let cardClass = "";
  if (theme === "minimal") {
    cardClass = "p-5 border border-stone-200 bg-white text-stone-900";
  } else if (theme === "corporate") {
    cardClass = "p-5 bg-white border border-neutral-200 shadow-sm text-neutral-800";
  } else if (theme === "developer") {
    cardClass = "p-5 border border-neutral-800 bg-neutral-900/10 text-emerald-400 font-mono";
  } else if (theme === "dark") {
    cardClass = "p-5 rounded-2xl border border-indigo-500/10 bg-neutral-950/40 backdrop-blur-xl relative overflow-hidden";
  } else {
    cardClass = "p-5 rounded-2xl border border-white/5 bg-neutral-950/40 backdrop-blur-md relative overflow-hidden";
  }

  const embedUrl = project.demoVideoUrl ? getYoutubeEmbedUrl(project.demoVideoUrl) : null;

  return (
    <div className={`${cardClass} flex flex-col gap-4 ${project.isFeatured ? 'ring-2 ring-amber-500/50 shadow-lg' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white">{project.name}</span>
            {project.isFeatured && (
              <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-amber-500 text-neutral-950">
                Featured Card
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">{project.description}</p>
        </div>
        
        <div className="flex gap-2">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noreferrer" 
              onClick={onGithubClick}
              className="p-2 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
              title="Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noreferrer" 
              onClick={onLiveClick}
              className="p-2 rounded-lg text-neutral-950 font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center"
              style={{ backgroundColor: accentColor }}
              title="Live Demo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {project.demoVideoUrl && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-white/5">
          {playVideo ? (
            embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${project.name} Demo Video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <video
                src={project.demoVideoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-950/85">
              {project.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.thumbnailUrl} alt={project.name} className="absolute inset-0 w-full h-full object-cover opacity-25" />
              ) : null}
              <button
                onClick={handlePlay}
                className="z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 hover:scale-105 active:scale-95 transition-all text-white flex items-center justify-center"
              >
                <Film className="w-5 h-5 text-white" />
              </button>
              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 z-10 font-sans">
                Play Demo Evaluation Video
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mt-0.5">
        {project.techStack.map((t, idx) => (
          <span key={idx} className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// Custom Availability Status Badge Helper
function AvailabilityBadge({ status }: { status?: string }) {
  if (!status) return null;
  let bg = "bg-neutral-800 text-neutral-400 border border-neutral-700/50";
  if (status === "Open To Work") bg = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  else if (status === "Actively Interviewing") bg = "bg-sky-500/10 text-sky-400 border border-sky-500/20";
  else if (status === "Freelancing") bg = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  
  return (
    <span className={`px-2.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest ${bg}`}>
      {status}
    </span>
  );
}

export default function ThemeLayouts({
  profile,
  onSocialClick,
  onDownloadResume,
  onSaveContact,
  onVideoPlay,
}: ThemeLayoutProps) {
  // Sort projects so the featured project is at the top
  const sortedProjects = profile.projects ? [...profile.projects].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)) : [];

  const props = { 
    profile, 
    sortedProjects,
    onSocialClick, 
    onDownloadResume, 
    onSaveContact, 
    onVideoPlay 
  };

  switch (profile.theme) {
    case "minimal":
      return <MinimalTheme {...props} />;
    case "corporate":
      return <CorporateTheme {...props} />;
    case "developer":
      return <DeveloperTheme {...props} />;
    case "dark":
      return <DarkTheme {...props} />;
    case "modern":
    default:
      return <ModernTheme {...props} />;
  }
}

// ----------------------------------------------------
// 1. MODERN GLOW THEME
// ----------------------------------------------------
function ModernTheme({ 
  profile, 
  sortedProjects, 
  onSocialClick, 
  onDownloadResume, 
  onSaveContact, 
  onVideoPlay 
}: ThemeLayoutProps & { sortedProjects: Project[] }) {
  return (
    <div className="min-h-screen bg-[#060608] text-neutral-100 flex flex-col font-sans">
      <div 
        className="w-full h-48 md:h-64 bg-neutral-900 bg-cover bg-center"
        style={{ backgroundImage: `url(${profile.bannerUrl || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1200&h=300"})` }}
      />

      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 -mt-20 flex-grow pb-24 flex flex-col gap-8">
        
        {/* Profile Card */}
        <div className="p-6 md:p-8 rounded-3xl border border-white/5 bg-neutral-950/70 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div 
              className="w-24 h-24 rounded-full border-2 overflow-hidden shrink-0 bg-neutral-900"
              style={{ borderColor: profile.accentColor }}
            >
              {profile.avatarUrl && <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{profile.fullName}</h1>
                <AvailabilityBadge status={profile.availabilityStatus} />
              </div>
              <span className="text-sm font-semibold text-neutral-300">{profile.role || profile.headline}</span>
              <span className="text-xs text-neutral-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {profile.resumeUrl && (
              <button 
                onClick={onDownloadResume}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-neutral-950 hover:opacity-90 transition-all active:scale-95"
                style={{ backgroundColor: profile.accentColor }}
              >
                <FileText className="w-4 h-4" /> Resume
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
          
          {/* Left Panel */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col gap-4">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">About Me</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">{profile.bio}</p>
            </div>

            {/* Social Links */}
            {profile.socialLinks && (
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">Connect</h3>
                <div className="flex flex-wrap gap-2.5">
                  {profile.socialLinks.github && (
                    <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" onClick={() => onSocialClick("github")} className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {profile.socialLinks.linkedin && (
                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" onClick={() => onSocialClick("linkedin")} className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {profile.socialLinks.twitter && (
                    <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" onClick={() => onSocialClick("twitter")} className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {profile.socialLinks.portfolio && (
                    <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" onClick={() => onSocialClick("portfolio")} className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all">
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-full border border-white/5 bg-white/5 text-xs text-neutral-300">
                      {s.name} <span className="text-[9px] text-neutral-500 uppercase ml-1">({s.category})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {sortedProjects.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 px-1">Projects & Case Studies</h3>
                <div className="grid grid-cols-1 gap-4">
                  {sortedProjects.map((p) => (
                    <ProjectCard 
                      key={p._id || p.id} 
                      project={p} 
                      accentColor={profile.accentColor || "#3b82f6"} 
                      theme="modern" 
                      onGithubClick={() => onSocialClick("github")} 
                      onLiveClick={() => onSocialClick("portfolio")}
                      onVideoPlay={() => onVideoPlay(p.name)} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {profile.experiences && profile.experiences.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col gap-5">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Work History</h3>
                <div className="flex flex-col gap-6 border-l border-white/5 pl-4 ml-2">
                  {profile.experiences.map((exp) => (
                    <div key={exp._id} className="relative flex flex-col gap-1">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-neutral-800 border border-white/10" style={{ backgroundColor: exp.current ? profile.accentColor : undefined }} />
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <span className="text-sm font-bold text-white">{exp.title}</span>
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <span className="text-xs text-neutral-400">{exp.company} • {exp.location}</span>
                      <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.educations && profile.educations.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col gap-5">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Education</h3>
                <div className="flex flex-col gap-5">
                  {profile.educations.map((edu) => (
                    <div key={edu._id} className="flex flex-col gap-1 border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-sm font-bold text-white">{edu.school}</span>
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">{edu.startDate} - {edu.endDate}</span>
                      </div>
                      <span className="text-xs text-neutral-400">{edu.degree} in {edu.fieldOfStudy}</span>
                      {edu.description && <p className="text-xs text-neutral-300 mt-1">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 flex items-center gap-2"><Award className="w-4 h-4" /> Certifications</h3>
                <div className="flex flex-col gap-3">
                  {profile.certifications.map((c) => (
                    <div key={c._id || c.id} className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5 text-xs">
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
// 2. MINIMAL THEME
// ----------------------------------------------------
function MinimalTheme({ 
  profile, 
  sortedProjects, 
  onSocialClick, 
  onDownloadResume, 
  onSaveContact, 
  onVideoPlay 
}: ThemeLayoutProps & { sortedProjects: Project[] }) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-serif">
      <div className="w-full max-w-3xl mx-auto px-6 py-16 flex-grow flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-stone-200 pb-8 gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-4xl font-light tracking-tight">{profile.fullName}</h1>
              <AvailabilityBadge status={profile.availabilityStatus} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest font-sans" style={{ color: profile.accentColor }}>{profile.role || profile.headline}</span>
            <span className="text-xs text-stone-500 flex items-center gap-1 font-sans"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
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
          <p className="text-lg font-light leading-relaxed text-stone-750">{profile.bio}</p>
        </div>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-widest text-stone-400 font-sans font-bold">Competencies</h3>
            <div className="flex flex-wrap gap-2 font-sans">
              {profile.skills.map((s, idx) => (
                <span key={idx} className="px-3 py-1 border border-stone-200 bg-white text-xs text-stone-600 rounded">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {sortedProjects.length > 0 && (
          <div className="flex flex-col gap-6">
            <h3 className="text-xs uppercase tracking-widest text-stone-400 font-sans font-bold">Projects</h3>
            <div className="flex flex-col gap-6 divide-y divide-stone-100">
              {sortedProjects.map((p, idx) => (
                <div key={p._id || p.id} className={`${idx > 0 ? "pt-6" : ""}`}>
                  <ProjectCard 
                    project={p} 
                    accentColor={profile.accentColor || "#3b82f6"} 
                    theme="minimal" 
                    onGithubClick={() => onSocialClick("github")} 
                    onLiveClick={() => onSocialClick("portfolio")}
                    onVideoPlay={() => onVideoPlay(p.name)} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {profile.experiences && profile.experiences.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase tracking-widest text-stone-400 font-sans font-bold">Experience</h3>
            <div className="flex flex-col gap-6 divide-y divide-stone-100">
              {profile.experiences.map((exp, idx) => (
                <div key={exp._id} className={`flex flex-col gap-1.5 ${idx > 0 ? "pt-6" : ""}`}>
                  <div className="flex flex-wrap justify-between items-center font-sans gap-2">
                    <span className="text-base font-bold text-stone-900">{exp.title} at {exp.company}</span>
                    <span className="text-xs text-stone-500 uppercase font-mono">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <span className="text-xs text-stone-400 font-sans italic">{exp.location}</span>
                  <p className="text-sm text-stone-600 leading-relaxed font-light mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.educations && profile.educations.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase tracking-widest text-stone-400 font-sans font-bold">Education</h3>
            <div className="flex flex-col gap-5">
              {profile.educations.map((edu) => (
                <div key={edu._id} className="flex flex-col gap-1 border-b border-stone-100 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center font-sans gap-2">
                    <span className="text-sm font-bold text-stone-900">{edu.school}</span>
                    <span className="text-xs text-stone-450 font-mono">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <span className="text-xs text-stone-500 font-sans">{edu.degree} in {edu.fieldOfStudy}</span>
                  {edu.description && <p className="text-xs text-stone-600 font-sans font-light mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {profile.certifications && profile.certifications.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase tracking-widest text-stone-400 font-sans font-bold">Certifications</h3>
            <div className="flex flex-col gap-3 font-sans">
              {profile.certifications.map((c) => (
                <div key={c._id || c.id} className="flex justify-between items-center text-xs text-stone-600 border-b border-stone-100 pb-2">
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
          {profile.socialLinks && (
            <div className="flex gap-4">
              {profile.socialLinks.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-stone-900">GitHub</a>}
              {profile.socialLinks.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-stone-900">LinkedIn</a>}
            </div>
          )}
        </footer>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. CORPORATE THEME
// ----------------------------------------------------
function CorporateTheme({ 
  profile, 
  sortedProjects, 
  onSocialClick, 
  onDownloadResume, 
  onSaveContact, 
  onVideoPlay 
}: ThemeLayoutProps & { sortedProjects: Project[] }) {
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-neutral-800 flex flex-col font-sans">
      <header className="bg-white border-b border-neutral-200 py-6 px-6 md:px-12 sticky top-0 z-20">
        <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded border border-neutral-200 overflow-hidden bg-neutral-100 shrink-0">
              {profile.avatarUrl && <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-neutral-900">{profile.fullName}</h1>
                <AvailabilityBadge status={profile.availabilityStatus} />
              </div>
              <span className="text-xs text-neutral-500 font-medium">{profile.role || profile.headline}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {profile.resumeUrl && (
              <button 
                onClick={onDownloadResume}
                className="px-4 py-2 rounded text-xs font-bold text-white hover:opacity-90 transition-all active:scale-95"
                style={{ backgroundColor: profile.accentColor }}
              >
                Resume
              </button>
            )}
            <button 
              onClick={onSaveContact}
              className="px-4 py-2 rounded text-xs font-bold border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 transition-all active:scale-95"
            >
              Save Contact
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 md:px-8 py-10 flex-grow flex flex-col gap-6">
        
        {/* Bio */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm flex flex-col gap-3">
          <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-450">Professional Summary</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">{profile.bio}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-550 border-t border-neutral-100 pt-3 mt-1">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-neutral-400" /> {profile.location}</span>
            {profile.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4 text-neutral-400" /> {profile.phone}</span>}
            <span className="flex items-center gap-1"><Mail className="w-4 h-4 text-neutral-400" /> {profile.email}</span>
          </div>
        </div>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-450">Key Competencies</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, idx) => (
                <span key={idx} className="px-3 py-1 bg-neutral-100 text-xs font-semibold rounded text-neutral-600">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {sortedProjects.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400 px-1">Evaluation Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedProjects.map((p) => (
                <ProjectCard 
                  key={p._id || p.id} 
                  project={p} 
                  accentColor={profile.accentColor || "#3b82f6"} 
                  theme="corporate" 
                  onGithubClick={() => onSocialClick("github")} 
                  onLiveClick={() => onSocialClick("portfolio")}
                  onVideoPlay={() => onVideoPlay(p.name)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {profile.experiences && profile.experiences.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm flex flex-col gap-5">
            <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400">Work Experience</h3>
            <div className="flex flex-col gap-6">
              {profile.experiences.map((exp) => (
                <div key={exp._id} className="flex flex-col gap-1.5 border-b border-neutral-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900">{exp.title}</span>
                    <span className="text-xs text-neutral-400 font-semibold">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <span className="text-xs text-neutral-500 font-medium">{exp.company} • {exp.location}</span>
                  <p className="text-xs text-neutral-600 leading-relaxed mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.educations && profile.educations.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm flex flex-col gap-5">
            <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400">Education</h3>
            <div className="flex flex-col gap-5">
              {profile.educations.map((edu) => (
                <div key={edu._id} className="flex flex-col gap-1 border-b border-neutral-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900">{edu.school}</span>
                    <span className="text-xs text-neutral-400 font-medium">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <span className="text-xs text-neutral-500">{edu.degree} in {edu.fieldOfStudy}</span>
                  {edu.description && <p className="text-xs text-neutral-650 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// ----------------------------------------------------
// 4. DEVELOPER THEME
// ----------------------------------------------------
function DeveloperTheme({ 
  profile, 
  sortedProjects, 
  onSocialClick, 
  onDownloadResume, 
  onSaveContact, 
  onVideoPlay 
}: ThemeLayoutProps & { sortedProjects: Project[] }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-emerald-400 flex flex-col font-mono selection:bg-emerald-500 selection:text-neutral-950">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-12 flex-grow pb-24 flex flex-col gap-8">
        
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
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-neutral-500 font-bold">&gt; INITIALIZING EVALUATION PROFILE</span>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">{profile.fullName}</h1>
                <AvailabilityBadge status={profile.availabilityStatus} />
              </div>
              <span className="text-xs text-emerald-300 font-semibold">{profile.role || profile.headline}</span>
              <span className="text-xs text-neutral-400 flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
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

          <div className="flex flex-col gap-2">
            <span className="text-neutral-500">&gt; cat bio.txt</span>
            <p className="text-sm text-neutral-300 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-neutral-500">&gt; show --skills</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs font-mono">
                {profile.skills.map((s, idx) => (
                  <div key={idx} className="p-2.5 border border-neutral-800 bg-neutral-900/50 rounded flex flex-col gap-0.5">
                    <span className="text-white font-bold">{s.name}</span>
                    <span className="text-[9px] text-neutral-500 uppercase">{s.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {sortedProjects.length > 0 && (
            <div className="flex flex-col gap-4">
              <span className="text-neutral-500">&gt; ls featured-projects/</span>
              <div className="grid grid-cols-1 gap-4">
                {sortedProjects.map((p) => (
                  <ProjectCard 
                    key={p._id || p.id} 
                    project={p} 
                    accentColor={profile.accentColor || "#10b981"} 
                    theme="developer" 
                    onGithubClick={() => onSocialClick("github")} 
                    onLiveClick={() => onSocialClick("portfolio")}
                    onVideoPlay={() => onVideoPlay(p.name)} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {profile.experiences && profile.experiences.length > 0 && (
            <div className="flex flex-col gap-4">
              <span className="text-neutral-500">&gt; cat work_history.json</span>
              <div className="flex flex-col gap-5 border-l border-neutral-800 pl-4 ml-1">
                {profile.experiences.map((exp) => (
                  <div key={exp._id} className="flex flex-col gap-1 relative">
                    <span className="absolute -left-[22px] top-1 text-emerald-500">*</span>
                    <span className="text-sm font-bold text-white">{exp.title} @ {exp.company}</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">{exp.startDate} - {exp.endDate}</span>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. DARK CYBERPUNK THEME
// ----------------------------------------------------
function DarkTheme({ 
  profile, 
  sortedProjects, 
  onSocialClick, 
  onDownloadResume, 
  onSaveContact, 
  onVideoPlay 
}: ThemeLayoutProps & { sortedProjects: Project[] }) {
  return (
    <div className="min-h-screen bg-[#070714] text-white flex flex-col font-sans">
      <div 
        className="w-full h-48 md:h-64 bg-neutral-950 bg-cover bg-center"
        style={{ backgroundImage: `url(${profile.bannerUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=300"})` }}
      />

      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 -mt-20 flex-grow pb-24 flex flex-col gap-8">
        
        {/* Header Glass Card */}
        <div className="p-6 md:p-8 rounded-3xl border border-indigo-500/15 bg-neutral-950/50 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-indigo-500/10 blur-[40px] pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-fuchsia-500/10 blur-[40px] pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-24 h-24 rounded-full border border-fuchsia-500/30 overflow-hidden shrink-0 bg-neutral-900 shadow-lg shadow-fuchsia-500/10">
              {profile.avatarUrl && <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-fuchsia-400 bg-clip-text text-transparent">{profile.fullName}</h1>
                <AvailabilityBadge status={profile.availabilityStatus} />
              </div>
              <span className="text-sm font-semibold text-fuchsia-400">{profile.role || profile.headline}</span>
              <span className="text-xs text-neutral-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 relative z-10">
            {profile.resumeUrl && (
              <button 
                onClick={onDownloadResume}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:brightness-110 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                <FileText className="w-4 h-4" /> Resume
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
          
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="p-6 rounded-2xl border border-indigo-500/10 bg-neutral-950/40 backdrop-blur-xl flex flex-col gap-4">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-fuchsia-400">Evaluation Bio</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">{profile.bio}</p>
            </div>

            {profile.socialLinks && (
              <div className="p-6 rounded-2xl border border-indigo-500/10 bg-neutral-950/40 backdrop-blur-xl flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-fuchsia-400">Links</h3>
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
            )}
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="p-6 rounded-2xl border border-indigo-500/10 bg-neutral-950/40 backdrop-blur-xl flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-fuchsia-400">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-full border border-indigo-500/10 bg-indigo-950/20 text-xs text-indigo-300">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {sortedProjects.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-fuchsia-400 px-1">Case Projects</h3>
                <div className="grid grid-cols-1 gap-4">
                  {sortedProjects.map((p) => (
                    <ProjectCard 
                      key={p._id || p.id} 
                      project={p} 
                      accentColor={profile.accentColor || "#6366f1"} 
                      theme="dark" 
                      onGithubClick={() => onSocialClick("github")} 
                      onLiveClick={() => onSocialClick("portfolio")}
                      onVideoPlay={() => onVideoPlay(p.name)} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Experiences */}
            {profile.experiences && profile.experiences.length > 0 && (
              <div className="p-6 rounded-2xl border border-indigo-500/10 bg-neutral-950/40 backdrop-blur-xl flex flex-col gap-5">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-fuchsia-400 flex items-center gap-2"><Briefcase className="w-4 h-4 text-fuchsia-400" /> Professional Experience</h3>
                <div className="flex flex-col gap-6 border-l border-indigo-500/10 pl-4 ml-1">
                  {profile.experiences.map((exp) => (
                    <div key={exp._id} className="relative flex flex-col gap-1">
                      <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50" />
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <span className="text-sm font-bold text-white">{exp.title}</span>
                        <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <span className="text-xs text-neutral-400">{exp.company} • {exp.location}</span>
                      <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">{exp.description}</p>
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

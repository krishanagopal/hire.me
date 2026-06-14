"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import { apiMock, Profile } from "../../utils/apiMock";
import { triggerResumeDownload } from "../../components/ThemeLayouts";
import { 
  User, Eye, Download, MousePointer, 
  Settings, QrCode, FileText, 
  ExternalLink, LogOut, RefreshCw, Check, Upload, AlertTriangle,
  Play, Link as LinkIcon, Palette, Plus, Trash2, X, Zap
} from "lucide-react";

// Inline brand icon SVGs
const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"analytics" | "edit" | "share">("analytics");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Edit form states
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [accentColor, setAccentColor] = useState("#3b82f6");

  // Multi-project states
  const [localProjects, setLocalProjects] = useState<any[]>([]);
  const [activeProjEditIdx, setActiveProjEditIdx] = useState<number>(0);

  // Upgrade Modal states
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");

  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  
  // Analytics data
  const [stats, setStats] = useState({
    views: 0,
    downloads: 0,
    clicks: 0,
    devices: { mobile: 0, desktop: 0, tablet: 0 },
    clicksBreakdown: {} as Record<string, number>
  });

  // Load profile details
  useEffect(() => {
    const user = apiMock.getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setCurrentUser(user);

    const loadData = async () => {
      const myProfile = await apiMock.getMyProfile();
      if (!myProfile) {
        router.push("/onboarding");
        return;
      }
      setProfile(myProfile);

      // Populate form states
      setName(myProfile.fullName || "");
      setHeadline(myProfile.headline || "");
      setBio(myProfile.bio || "");
      setAccentColor(myProfile.accentColor || "#3b82f6");

      // Load multi-projects
      setLocalProjects(myProfile.projects || []);

      if (myProfile.socialLinks) {
        setLinkedin(myProfile.socialLinks.linkedin || "");
        setGithub(myProfile.socialLinks.github || "");
        setTwitter(myProfile.socialLinks.twitter || "");
      }

      setResumeFileName(myProfile.resumeFileName || "");
      setResumeUrl(myProfile.resumeUrl || "");

      // Load analytics summary
      const analytics = await apiMock.getAnalyticsSummary();
      setStats(analytics);
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    apiMock.logout();
    router.push("/login");
  };

  // PDF uploader
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setResumeUrl(base64);
      setResumeFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Screenshot uploader with Pro check
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>, projectIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!profile) return;
    const currentProjScreenshots = localProjects[projectIdx]?.screenshots || [];
    const isPro = profile.tier === "pro";

    if (!isPro && currentProjScreenshots.length >= 4) {
      setUpgradeMessage("You have reached the Free tier limit of 4 screenshots per project.");
      setShowUpgradeModal(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const updatedProjects = [...localProjects];
      const proj = updatedProjects[projectIdx];
      if (proj) {
        proj.screenshots = [...(proj.screenshots || []), base64];
        setLocalProjects(updatedProjects);
      }
    };
    reader.readAsDataURL(file);
  };

  // Delete Screenshot uploader
  const handleDeleteScreenshot = (projectIdx: number, screenshotIdx: number) => {
    const updatedProjects = [...localProjects];
    const proj = updatedProjects[projectIdx];
    if (proj && proj.screenshots) {
      proj.screenshots = proj.screenshots.filter((_: string, i: number) => i !== screenshotIdx);
      setLocalProjects(updatedProjects);
    }
  };

  // Project fields updates
  const handleProjFieldChange = (projectIdx: number, field: string, value: any) => {
    const updatedProjects = [...localProjects];
    if (updatedProjects[projectIdx]) {
      updatedProjects[projectIdx][field] = value;
      setLocalProjects(updatedProjects);
    }
  };

  // Add project uploader with Pro check
  const handleAddProject = () => {
    if (!profile) return;
    const isPro = profile.tier === "pro";

    if (!isPro && localProjects.length >= 3) {
      setUpgradeMessage("You have reached the Free tier limit of 3 project demo videos.");
      setShowUpgradeModal(true);
      return;
    }

    setLocalProjects([
      ...localProjects,
      {
        name: `New Project ${localProjects.length + 1}`,
        description: "",
        techStack: [],
        githubUrl: "",
        liveUrl: "",
        demoVideoUrl: "",
        screenshots: [],
        isFeatured: false
      }
    ]);
    setActiveProjEditIdx(localProjects.length);
  };

  const handleRemoveProject = (idx: number) => {
    setLocalProjects(localProjects.filter((_: any, i: number) => i !== idx));
    setActiveProjEditIdx(0);
  };

  // Pro Upgrade Trigger Action
  const handleUpgradeToPro = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const res = await apiMock.updateMyProfile({ tier: "pro" });
      if (res.success && res.profile) {
        setProfile(res.profile);
        setShowUpgradeModal(false);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 }
        });
        setSuccessMsg("Welcome to Pro! All project and screenshot limits are now unlocked.");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(res.error || "Failed to upgrade profile.");
      }
    } catch (err) {
      setErrorMsg("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  // Profile update handler
  const handleSaveShowcase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    if (!name.trim()) {
      setErrorMsg("Name is required.");
      setLoading(false);
      return;
    }

    // Double check limits on save
    const isPro = profile.tier === "pro";
    if (!isPro) {
      if (localProjects.length > 3) {
        setUpgradeMessage("You have reached the Free tier limit of 3 project demo videos.");
        setShowUpgradeModal(true);
        setLoading(false);
        return;
      }
      for (const p of localProjects) {
        if (p.screenshots && p.screenshots.length > 4) {
          setUpgradeMessage("One of your projects exceeds the Free limit of 4 screenshots.");
          setShowUpgradeModal(true);
          setLoading(false);
          return;
        }
      }
    }

    const projectsList = localProjects.map(p => ({
      name: p.name,
      description: p.description || "",
      techStack: typeof p.techStack === "string" ? p.techStack.split(",").map((t: any) => t.trim()).filter(Boolean) : (p.techStack || []),
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
      demoVideoUrl: p.demoVideoUrl || "",
      screenshots: p.screenshots || [],
      isFeatured: p.isFeatured || false,
    }));

    const updates: Partial<Profile> = {
      fullName: name,
      headline,
      bio,
      accentColor,
      socialLinks: {
        linkedin: linkedin || undefined,
        github: github || undefined,
        twitter: twitter || undefined,
      },
      projects: projectsList,
      resumeUrl: resumeUrl || undefined,
      resumeFileName: resumeFileName || undefined,
    };

    try {
      const res = await apiMock.updateMyProfile(updates);
      if (res.success && res.profile) {
        setProfile(res.profile);
        setLocalProjects(res.profile.projects || []);
        setSuccessMsg("Showcase changes saved successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(res.error || "Failed to update profile.");
      }
    } catch (err) {
      setErrorMsg("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const accentColors = [
    { name: "Blue", hex: "#3b82f6" },
    { name: "Amber", hex: "#f59e0b" },
    { name: "Emerald", hex: "#10b981" },
    { name: "Indigo", hex: "#6366f1" },
    { name: "Rose", hex: "#f43f5e" },
    { name: "Orange", hex: "#f97316" },
    { name: "Violet", hex: "#8b5cf6" },
  ];

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#030304] flex items-center justify-center text-neutral-400 select-none">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-sm font-semibold tracking-widest uppercase">Loading Console...</span>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/${profile.username}` : `/${profile.username}`;
  const isPro = profile.tier === "pro";

  return (
    <div className="min-h-screen bg-[#030304] text-white flex flex-col select-none relative">
      
      {/* Dashboard Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-12 py-4 bg-neutral-950/45 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-neutral-300 to-neutral-600 bg-clip-text text-transparent">
            hire.me
          </span>
          <span className="text-[9px] uppercase font-bold tracking-widest bg-blue-500/10 px-2 py-0.5 rounded text-blue-400">
            Console
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isPro ? (
              <span className="text-[9px] uppercase font-bold tracking-widest bg-blue-500/10 px-2.5 py-1 rounded text-blue-450 border border-blue-500/20">
                PRO Member
              </span>
            ) : (
              <button
                onClick={() => {
                  setUpgradeMessage("Unlock unlimited project video showreels and screenshot uploads!");
                  setShowUpgradeModal(true);
                }}
                className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-widest bg-amber-500 text-neutral-950 px-2.5 py-1 rounded hover:scale-105 transition-all"
              >
                <Zap className="w-3 h-3 fill-neutral-950" /> Upgrade
              </button>
            )}
          </div>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            Preview Showcase Link <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-rose-450 transition-colors"
          >
            Logout <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Console Layout */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-2.5">
          <div className="p-4 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col min-w-0">
            <span className="text-xs font-bold truncate">{profile.fullName}</span>
            <span className="text-[10px] text-neutral-450 truncate">hire.me/{profile.username}</span>
          </div>

          <nav className="flex flex-row md:flex-col gap-2 p-1.5 rounded-2xl border border-white/5 bg-neutral-950/10 backdrop-blur-md w-full">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex-grow md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "analytics" ? "bg-white text-neutral-950" : "text-neutral-450 hover:text-white"}`}
            >
              <Eye className="w-4 h-4" /> Showcase Stats
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex-grow md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "edit" ? "bg-white text-neutral-950" : "text-neutral-450 hover:text-white"}`}
            >
              <Settings className="w-4 h-4" /> Edit Showcase
            </button>
            <button
              onClick={() => setActiveTab("share")}
              className={`flex-grow md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "share" ? "bg-white text-neutral-950" : "text-neutral-450 hover:text-white"}`}
            >
              <QrCode className="w-4 h-4" /> Share Link
            </button>
          </nav>
        </div>

        {/* Console Content Window */}
        <div className="md:col-span-3 flex flex-col gap-6">
          
          {successMsg && (
            <div className="flex items-center gap-3 p-3.5 text-xs rounded-xl border border-emerald-500/20 bg-emerald-950/15 text-emerald-300">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-3 p-3.5 text-xs rounded-xl border border-rose-500/20 bg-rose-950/15 text-rose-355">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="flex flex-col gap-6">
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/30 backdrop-blur-md flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-450">
                    <span>Showcase Views</span>
                    <Eye className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-3xl font-black">{stats.views}</span>
                </div>
                <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/30 backdrop-blur-md flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-450">
                    <span>Resume Downloads</span>
                    <Download className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-3xl font-black">{stats.downloads}</span>
                </div>
                <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/30 backdrop-blur-md flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-450">
                    <span>Channel Clicks</span>
                    <MousePointer className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-3xl font-black">{stats.clicks}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col gap-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-455">Channel Click Breakdown</h3>
                  <div className="flex flex-col gap-3.5 max-h-[160px] overflow-y-auto">
                    {Object.entries(stats.clicksBreakdown).map(([platform, count]) => (
                      <div key={platform} className="flex justify-between items-center text-xs">
                        <span className="font-semibold capitalize text-neutral-300">{platform}</span>
                        <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-[10px]">{count} clicks</span>
                      </div>
                    ))}
                    {Object.keys(stats.clicksBreakdown).length === 0 && (
                      <span className="text-xs text-neutral-500 italic mt-6 text-center">No platform clicks recorded yet.</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: EDIT SHOWCASE */}
          {activeTab === "edit" && (
            <form onSubmit={handleSaveShowcase} className="flex flex-col gap-6">
              
              {/* Profile Info Form */}
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-blue-500/50"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Headline</label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Bio Description</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="p-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                  />
                </div>
              </div>

              {/* Multi Project Showreels Section */}
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 flex items-center gap-2">
                    <Play className="w-4 h-4" /> Projects & Videos ({localProjects.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="flex items-center gap-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project Video
                  </button>
                </div>

                {localProjects.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-500 italic border border-dashed border-white/5 rounded-xl">
                    No project showreels added yet. Add one above!
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Project Accordions */}
                    <div className="flex flex-wrap gap-2">
                      {localProjects.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveProjEditIdx(idx)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                            activeProjEditIdx === idx 
                              ? "bg-white text-neutral-950" 
                              : "bg-white/5 hover:bg-white/10 text-neutral-300"
                          }`}
                        >
                          <span className="truncate max-w-[120px]">{p.name || `Project ${idx + 1}`}</span>
                          <span className="text-[9px] uppercase opacity-60">({(p.screenshots || []).length} img)</span>
                        </button>
                      ))}
                    </div>

                    {/* Active Project Form */}
                    {localProjects[activeProjEditIdx] && (
                      <div className="p-5 rounded-2xl border border-white/10 bg-neutral-950/40 flex flex-col gap-4 animate-fade-in relative">
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(activeProjEditIdx)}
                          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                          title="Remove Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Project Name</label>
                            <input
                              type="text"
                              value={localProjects[activeProjEditIdx].name}
                              onChange={(e) => handleProjFieldChange(activeProjEditIdx, "name", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-blue-500/50"
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Demo Video URL</label>
                            <input
                              type="url"
                              value={localProjects[activeProjEditIdx].demoVideoUrl || ""}
                              onChange={(e) => handleProjFieldChange(activeProjEditIdx, "demoVideoUrl", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-blue-500/50"
                              placeholder="YouTube link or direct MP4 URL"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Short Description</label>
                          <input
                            type="text"
                            value={localProjects[activeProjEditIdx].description || ""}
                            onChange={(e) => handleProjFieldChange(activeProjEditIdx, "description", e.target.value)}
                            className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-blue-500/50"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">GitHub Repo URL</label>
                            <input
                              type="url"
                              value={localProjects[activeProjEditIdx].githubUrl || ""}
                              onChange={(e) => handleProjFieldChange(activeProjEditIdx, "githubUrl", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-blue-500/50"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Live Site URL</label>
                            <input
                              type="url"
                              value={localProjects[activeProjEditIdx].liveUrl || ""}
                              onChange={(e) => handleProjFieldChange(activeProjEditIdx, "liveUrl", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-blue-500/50"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Tech Stack (comma-separated)</label>
                          <input
                            type="text"
                            placeholder="React, Next.js, Express"
                            value={
                              localProjects[activeProjEditIdx].techStackStr !== undefined
                                ? localProjects[activeProjEditIdx].techStackStr
                                : localProjects[activeProjEditIdx].techStack?.join(", ") || ""
                            }
                            onChange={(e) => {
                              handleProjFieldChange(activeProjEditIdx, "techStackStr", e.target.value);
                              handleProjFieldChange(
                                activeProjEditIdx,
                                "techStack",
                                e.target.value.split(",").map(t => t.trim())
                              );
                            }}
                            className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-blue-500/50"
                          />
                        </div>

                        {/* Screenshots Upload Manager */}
                        <div className="flex flex-col gap-3 border-t border-white/5 pt-4 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Screenshots ({(localProjects[activeProjEditIdx].screenshots || []).length}/4)</span>
                            {(localProjects[activeProjEditIdx].screenshots || []).length < 4 || isPro ? (
                              <label className="flex items-center gap-1 text-[10px] font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg hover:bg-white/10 cursor-pointer transition-all">
                                <Upload className="w-3 h-3" /> Upload Screen
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => handleScreenshotUpload(e, activeProjEditIdx)} 
                                />
                              </label>
                            ) : (
                              <span className="text-[9px] uppercase font-semibold text-neutral-500">Max limit reached (Upgrade for more)</span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-1">
                            {(localProjects[activeProjEditIdx].screenshots || []).map((src: string, imgIdx: number) => (
                              <div key={imgIdx} className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-white/5 group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteScreenshot(activeProjEditIdx, imgIdx)}
                                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600/90 text-white rounded-md transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Social channels links */}
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" /> Connect Channels
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-blue-400" /> LinkedIn Profile Link
                    </label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-neutral-300" /> GitHub Profile Link
                    </label>
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <Twitter className="w-3.5 h-3.5 text-sky-400" /> Twitter / X Profile Link
                    </label>
                    <input
                      type="url"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Resume File Upload */}
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Resume PDF
                </h3>
                <div className="flex items-center gap-4 p-2.5 rounded-xl border border-white/5 bg-neutral-950/20">
                  <div className="flex-1 min-w-0">
                    {resumeFileName ? (
                      <span className="text-xs font-semibold text-neutral-350 truncate block">{resumeFileName}</span>
                    ) : (
                      <span className="text-xs text-neutral-500 italic block">No resume uploaded yet.</span>
                    )}
                  </div>
                  <label className="flex items-center gap-1.5 text-xs font-bold bg-white/5 border border-white/10 px-3.5 py-2 rounded-lg hover:bg-white/10 cursor-pointer shrink-0 transition-all">
                    <Upload className="w-3.5 h-3.5" /> Upload Resume PDF
                    <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                  </label>
                </div>
              </div>

              {/* Theme Customizations (Accent only) */}
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Brand Accent Color
                </h3>
                <div className="flex items-center gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setAccentColor(color.hex)}
                      className="relative w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {accentColor === color.hex && (
                        <Check className="w-4 h-4 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-blue-500/15"
              >
                {loading ? "Saving changes..." : "Save Showcase Changes"}
              </button>

            </form>
          )}

          {/* TAB 3: SHARE LINK */}
          {activeTab === "share" && (
            <div className="flex flex-col gap-6">
              
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col items-center gap-6 text-center">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold tracking-tight">Your Showcase Link</h3>
                  <p className="text-xs text-neutral-400 max-w-sm">
                    Recruiters can visit this link or scan the code to watch your project demo video and download your resume.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-neutral-200">
                  <QRCodeSVG 
                    value={shareUrl}
                    size={180}
                    bgColor={"#ffffff"}
                    fgColor={"#030304"}
                    level={"H"}
                    includeMargin={false}
                  />
                </div>

                <div className="w-full max-w-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-neutral-900/40 text-xs text-left">
                    <div className="flex flex-col min-w-0 font-sans">
                      <span className="font-bold">Permanent Link</span>
                      <span className="font-mono text-neutral-400 mt-0.5 truncate">{shareUrl}</span>
                    </div>
                    <a
                      href={shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {profile.resumeUrl && (
                    <button
                      onClick={() => triggerResumeDownload(profile)}
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 active:scale-95 transition-all border border-neutral-300"
                    >
                      Test Resume Download (.pdf)
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Upgrade Subscription Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative max-w-md w-full p-8 rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl flex flex-col items-center text-center gap-6">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
              <Zap className="w-6 h-6 fill-amber-500" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold tracking-tight text-white">Upgrade to hire.me Pro</h3>
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider text-amber-500">{upgradeMessage}</p>
              <p className="text-xs text-neutral-300 leading-normal max-w-sm mt-1">
                Unlock unlimited project videos, unlimited screenshots, priority analytics metrics, and custom branding accent highlights.
              </p>
            </div>

            <div className="text-2xl font-black text-white">$5 <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest">/ month</span></div>

            <button
              onClick={handleUpgradeToPro}
              disabled={loading}
              className="w-full h-11 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-white/5"
            >
              {loading ? "Upgrading Account..." : "Upgrade to Pro Now"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

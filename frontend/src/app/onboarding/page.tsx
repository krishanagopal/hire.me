"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { apiMock, Profile, resolveMediaUrl } from "../../utils/apiMock";
import { 
  User, Link as LinkIcon, FileText, Globe, CheckCircle, 
  Upload, X, Play, Image as ImageIcon, Trash2, Camera, ShieldCheck
} from "lucide-react";

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

function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimParam = searchParams.get("claim");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("basic-details");

  // Lightbox & Preview states
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeLightboxVideo, setActiveLightboxVideo] = useState<string | null>(null);
  const [showResumeViewer, setShowResumeViewer] = useState(false);

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

  // Step 1: Basic Info
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Step 2: Project Details (Supports up to 3 projects)
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [isEditingProject, setIsEditingProject] = useState(true); // Open by default
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Temporary form states for the project being edited
  const [tempProjName, setTempProjName] = useState("");
  const [tempProjDesc, setTempProjDesc] = useState("");
  const [tempProjStack, setTempProjStack] = useState("");
  const [tempProjVideoType, setTempProjVideoType] = useState<"link" | "upload">("link");
  const [tempProjVideoUrl, setTempProjVideoUrl] = useState("");
  const [tempProjVideoFileName, setTempProjVideoFileName] = useState("");
  const [tempProjGit, setTempProjGit] = useState("");
  const [tempProjLive, setTempProjLive] = useState("");
  const [tempScreenshots, setTempScreenshots] = useState<string[]>([]);
  const [tempProjectError, setTempProjectError] = useState("");

  // Step 3: Resume & Socials
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  // Authenticate user on mount
  useEffect(() => {
    const checkAuth = async () => {
      const user = await apiMock.getCurrentUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setCurrentUser(user);
      setName((user as any).fullName || (user as any).name || "");
      if (user.username) {
        setUsername(user.username);
      } else if (claimParam) {
        setUsername(claimParam);
      }
    };
    checkAuth();
  }, [router, claimParam]);

  // Check username availability
  useEffect(() => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    const check = async () => {
      const isAvailable = await apiMock.checkUsernameAvailable(username);
      setUsernameAvailable(isAvailable);
    };
    const timer = setTimeout(check, 300);
    return () => clearTimeout(timer);
  }, [username]);

  // Watch Scroll Position to Update Active Section Highlight in Stepper
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["basic-details", "project-details", "resume-socials"];
      const scrollPosition = window.scrollY + 280;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Profile Avatar Upload Handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Screenshot upload handlers
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (tempScreenshots.length >= 4) {
      setTempProjectError("Free tier limit: Maximum of 4 screenshots allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setTempScreenshots([...tempScreenshots, base64]);
      setTempProjectError("");
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteScreenshot = (idx: number) => {
    setTempScreenshots(tempScreenshots.filter((_, i) => i !== idx));
  };

  // Convert files to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Smooth Scroll Trigger
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  // Stepper state updates dynamically
  const isStepComplete = (stepNum: number) => {
    if (stepNum === 1) return !!name.trim();
    if (stepNum === 2) return projectsList.length > 0;
    if (stepNum === 3) return !!username.trim() && usernameAvailable === true;
    return false;
  };

  // Project List Helpers
  const handleAddProjectClick = () => {
    setTempProjName("");
    setTempProjDesc("");
    setTempProjStack("");
    setTempProjVideoType("link");
    setTempProjVideoUrl("");
    setTempProjVideoFileName("");
    setTempProjGit("");
    setTempProjLive("");
    setTempScreenshots([]);
    setTempProjectError("");
    setEditingIndex(null);
    setIsEditingProject(true);
  };

  const handleEditProject = (idx: number) => {
    const proj = projectsList[idx];
    setTempProjName(proj.name);
    setTempProjDesc(proj.description || "");
    setTempProjStack(proj.techStack ? proj.techStack.join(", ") : "");
    
    // Check if the saved demo video is a base64 upload
    const isUploaded = proj.demoVideoUrl && (proj.demoVideoUrl.startsWith("data:video/") || proj.demoVideoUrl.includes("/media/"));
    setTempProjVideoType(isUploaded ? "upload" : "link");
    setTempProjVideoUrl(proj.demoVideoUrl || "");
    setTempProjVideoFileName(isUploaded ? "Uploaded Video File" : "");
    
    setTempProjGit(proj.githubUrl || "");
    setTempProjLive(proj.liveUrl || "");
    setTempScreenshots(proj.screenshots || []);
    setTempProjectError("");
    setEditingIndex(idx);
    setIsEditingProject(true);
  };

  const handleDeleteProject = (idx: number) => {
    const updated = projectsList.filter((_, i) => i !== idx);
    setProjectsList(updated);
    if (updated.length === 0) {
      setTempProjName("");
      setTempProjDesc("");
      setTempProjStack("");
      setTempProjVideoType("link");
      setTempProjVideoUrl("");
      setTempProjVideoFileName("");
      setTempProjGit("");
      setTempProjLive("");
      setTempScreenshots([]);
      setTempProjectError("");
      setEditingIndex(null);
      setIsEditingProject(true);
    }
  };

  const handleSaveProject = () => {
    if (!tempProjName.trim()) {
      setTempProjectError("Project Name is required.");
      return;
    }
    if (!tempProjDesc.trim()) {
      setTempProjectError("Project Description is required.");
      return;
    }
    if (!tempProjVideoUrl) {
      setTempProjectError(
        tempProjVideoType === "upload" 
          ? "Please upload a demo video file." 
          : "Demo Video URL is required."
      );
      return;
    }

    const newProject = {
      name: tempProjName,
      description: tempProjDesc,
      techStack: tempProjStack ? tempProjStack.split(",").map(t => t.trim()).filter(Boolean) : [],
      githubUrl: tempProjGit || undefined,
      liveUrl: tempProjLive || undefined,
      demoVideoUrl: tempProjVideoUrl || undefined,
      screenshots: tempScreenshots || [],
      isFeatured: editingIndex === 0 || (editingIndex === null && projectsList.length === 0)
    };

    if (editingIndex === null) {
      setProjectsList([...projectsList, newProject]);
    } else {
      const updated = [...projectsList];
      updated[editingIndex] = newProject;
      setProjectsList(updated);
    }

    setIsEditingProject(false);
    setEditingIndex(null);
  };

  const handleCancelProject = () => {
    setIsEditingProject(false);
    setEditingIndex(null);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 15MB
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 15) {
      setTempProjectError("Video file exceeds 15MB. Please upload a smaller video or use a YouTube link.");
      e.target.value = ""; // Clear file selector
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setTempProjVideoUrl(base64);
      setTempProjVideoFileName(file.name);
      setTempProjectError("");
    };
    reader.readAsDataURL(file);
  };

  // Form Submit (Complete Onboarding)
  const handleComplete = async () => {
    if (!name.trim()) {
      setError("Full Name is required in Basic Details section.");
      scrollToSection("basic-details");
      return;
    }
    if (projectsList.length === 0) {
      setError("Please add at least one showcase project in the Contact Details section.");
      scrollToSection("project-details");
      return;
    }
    if (!username.trim() || !usernameAvailable) {
      setError("Please choose a valid, unique username in the Claim Link section.");
      scrollToSection("resume-socials");
      return;
    }

    setLoading(true);
    setError("");

    const profileData: Partial<Profile> = {
      username,
      fullName: name,
      headline: headline || "Software Developer",
      bio: bio || "Developer Showcase",
      theme: "modern",
      accentColor: "#ff922b",
      avatarUrl: avatarUrl || undefined,
      socialLinks: {
        linkedin: linkedin || undefined,
        github: github || undefined,
        twitter: twitter || undefined,
      },
      projects: projectsList,
      resumeUrl: resumeUrl || undefined,
      resumeFileName: resumeFileName || undefined,
      skills: [],
      experiences: [],
      educations: [],
      certifications: [],
    };

    try {
      // 1. Claim username first
      const claimRes = await apiMock.claimUsername(username);
      if (!claimRes.success) {
        setError(claimRes.error || "Failed to claim username.");
        setLoading(false);
        return;
      }

      // 2. Save complete profile details
      const res = await apiMock.updateMyProfile(profileData);
      if (res.success) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setError(res.error || "Failed to create profile.");
      }
    } catch (err) {
      setError("Failed to save profile details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-[#ffdca3] via-[#ff9c50] to-[#e8590c] text-neutral-800 px-4 py-20 overflow-hidden font-sans">
      
      {/* Decorative floating spheres */}
      <div className="absolute top-[8%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-white/20 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#ffdca3]/40 blur-[110px] pointer-events-none" />
      <div className="absolute top-[45%] right-[5%] w-[200px] h-[200px] rounded-full bg-[#ffa94d]/40 blur-[70px] pointer-events-none" />
      <div className="absolute bottom-[35%] left-[8%] w-[250px] h-[250px] rounded-full bg-white/35 blur-[80px] pointer-events-none" />

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-white/20 backdrop-blur-md border-b border-white/25">
        <Link href="/" className="font-extrabold text-xl tracking-tight text-white drop-shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
          hire.me
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs text-white/95 font-bold uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
            Setup Showcase Link
          </span>
          <button 
            onClick={async () => {
              await apiMock.logout();
              router.push("/login");
            }}
            className="text-xs text-white font-bold uppercase tracking-wider hover:text-neutral-200 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-4xl mt-12 z-10 flex flex-col gap-6">
        
        {/* Error banner */}
        {error && (
          <div className="text-sm text-red-700 font-semibold p-4 bg-red-50 border border-red-200 rounded-2xl shadow-sm transition-all duration-300 animate-pulse">
            {error}
          </div>
        )}

        {/* Form white card container */}
        <div className="w-full p-8 md:p-12 rounded-[32px] border border-white/40 bg-white/95 backdrop-blur-xl shadow-[0_24px_70px_rgba(232,89,12,0.15)] flex flex-col">
          
          <h2 className="text-3xl font-black text-center text-neutral-900 tracking-tight mb-2">Sign up</h2>
          <p className="text-sm text-neutral-500 text-center font-medium mb-8">Enter your profile details to generate your live resume page</p>

          {/* Stepper / Progress Checklist Navigation */}
          <div className="flex justify-center items-center gap-2 md:gap-8 mb-12 border-b border-neutral-150 pb-8 select-none">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center cursor-pointer group" onClick={() => scrollToSection("basic-details")}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                activeSection === "basic-details"
                  ? "bg-[#ff922b] text-white border-[#ff922b] shadow-md shadow-[#ff922b]/25"
                  : isStepComplete(1)
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white text-neutral-400 border-neutral-300 group-hover:border-[#ff922b]/40"
              }`}>
                {isStepComplete(1) ? "✓" : "1"}
              </div>
              <span className={`text-[10px] md:text-xs mt-2 font-bold uppercase tracking-wider transition-colors duration-300 ${
                activeSection === "basic-details" ? "text-[#ff922b]" : "text-neutral-400"
              }`}>Basic Details</span>
            </div>

            <div className="w-8 md:w-16 h-[2px] bg-neutral-350 mb-6" />

            {/* Step 2 */}
            <div className="flex flex-col items-center cursor-pointer group" onClick={() => scrollToSection("project-details")}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                activeSection === "project-details"
                  ? "bg-[#ff922b] text-white border-[#ff922b] shadow-md shadow-[#ff922b]/25"
                  : isStepComplete(2)
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white text-neutral-400 border-neutral-300 group-hover:border-[#ff922b]/40"
              }`}>
                {isStepComplete(2) ? "✓" : "2"}
              </div>
              <span className={`text-[10px] md:text-xs mt-2 font-bold uppercase tracking-wider transition-colors duration-300 ${
                activeSection === "project-details" ? "text-[#ff922b]" : "text-neutral-400"
              }`}>Contact Details</span>
            </div>

            <div className="w-8 md:w-16 h-[2px] bg-neutral-350 mb-6" />

            {/* Step 3 */}
            <div className="flex flex-col items-center cursor-pointer group" onClick={() => scrollToSection("resume-socials")}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                activeSection === "resume-socials"
                  ? "bg-[#ff922b] text-white border-[#ff922b] shadow-md shadow-[#ff922b]/25"
                  : isStepComplete(3)
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white text-neutral-400 border-neutral-300 group-hover:border-[#ff922b]/40"
              }`}>
                {isStepComplete(3) ? "✓" : "3"}
              </div>
              <span className={`text-[10px] md:text-xs mt-2 font-bold uppercase tracking-wider transition-colors duration-300 ${
                activeSection === "resume-socials" ? "text-[#ff922b]" : "text-neutral-400"
              }`}>Verification</span>
            </div>

          </div>

          {/* FORM SECTIONS */}
          <div className="flex flex-col gap-14">

            {/* SECTION 1: BASIC DETAILS */}
            <section id="basic-details" className="scroll-mt-28 transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-neutral-100 pb-10">
                
                {/* Form fields column */}
                <div className="flex-grow w-full flex flex-col gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#ff922b]" /> Basic Details
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">Introduce yourself to hiring managers and recruiters visiting your link.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-neutral-350 bg-neutral-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff922b]/20 focus:border-[#ff922b] placeholder:text-neutral-400 transition-all"
                        required
                      />
                    </div>

                    {/* Headline */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700">Headline</label>
                      <input
                        type="text"
                        placeholder="MERN Stack Developer | React Native Architect"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-neutral-350 bg-neutral-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff922b]/20 focus:border-[#ff922b] placeholder:text-neutral-400 transition-all"
                      />
                    </div>

                    {/* Bio */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700">Vision & Mission (Short Bio)</label>
                      <textarea
                        rows={4}
                        placeholder="Write a brief professional summary about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-4 rounded-xl border border-neutral-350 bg-neutral-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff922b]/20 focus:border-[#ff922b] placeholder:text-neutral-400 resize-none transition-all"
                      />
                    </div>

                  </div>
                </div>

                {/* Avatar Photo Upload column */}
                <div className="w-full md:w-44 flex flex-col items-center justify-center pt-8 shrink-0">
                  <label className="relative cursor-pointer group">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#ff922b] bg-[#ff922b]/5 flex flex-col items-center justify-center gap-1 overflow-hidden transition-all group-hover:bg-[#ff922b]/10 group-hover:scale-102">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={resolveMediaUrl(avatarUrl)} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera className="w-5 h-5 text-[#ff922b]" />
                          <span className="text-[9px] font-extrabold uppercase text-[#ff922b] tracking-wider text-center">Add Photo</span>
                        </>
                      )}
                    </div>
                    
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setAvatarUrl("");
                        }}
                        className="absolute -top-1 -right-1 p-1 bg-red-100 border border-red-200 text-red-500 hover:text-red-700 rounded-full shadow-sm hover:scale-110 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </label>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-3">Profile Photo</span>
                </div>

              </div>
            </section>

            {/* SECTION 2: SHOWCASE PROJECTS */}
            <section id="project-details" className="scroll-mt-28 transition-all duration-300">
              <div className="flex flex-col gap-6 border-b border-neutral-100 pb-10">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <Play className="w-5 h-5 text-[#ff922b]" /> Showcase Projects ({projectsList.length}/3)
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">Feature up to 3 of your best projects with descriptions, code repositories, and demo videos.</p>
                  </div>
                  
                  {!isEditingProject && projectsList.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddProjectClick}
                      className="text-xs font-bold text-[#ff922b] hover:text-[#e8590c] hover:underline transition-all cursor-pointer"
                    >
                      + Add Another Project
                    </button>
                  )}
                </div>

                {/* Project List View */}
                {!isEditingProject && projectsList.length > 0 && (
                  <div className="flex flex-col gap-6">
                    {projectsList.map((proj, idx) => (
                      <div key={idx} className="bg-neutral-50/70 border border-neutral-200/60 rounded-2xl p-6 md:p-8 flex flex-col gap-5 shadow-inner">
                        <div className="flex justify-between items-center border-b border-neutral-200/40 pb-3">
                          <span className="text-xs font-extrabold text-neutral-850 uppercase tracking-wider">Project Showcase Details</span>
                          <div className="flex items-center gap-2">
                            {proj.isFeatured && (
                              <span className="text-[9px] uppercase tracking-widest bg-[#ff922b]/10 text-[#ff922b] px-1.5 py-0.5 rounded border border-[#ff922b]/20">Primary Project</span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleEditProject(idx)}
                              className="px-2.5 py-1 text-[11px] font-bold text-neutral-600 hover:text-[#ff922b] bg-white border border-neutral-250 hover:border-[#ff922b]/50 rounded-lg transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(idx)}
                              className="px-2.5 py-1 text-[11px] font-bold text-red-650 hover:bg-red-50 bg-white border border-red-200 rounded-lg transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
                          {/* Project Name */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-450">Project Name</label>
                            <div className="w-full h-11 px-4 rounded-xl border border-neutral-250 bg-white flex items-center text-sm font-semibold text-neutral-850 select-all">
                              {proj.name}
                            </div>
                          </div>

                          {/* Tech Stack */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-450">Tech Stack</label>
                            <div className="w-full h-11 px-4 rounded-xl border border-neutral-250 bg-white flex items-center text-sm font-semibold text-neutral-850 select-all">
                              {proj.techStack ? proj.techStack.join(", ") : "N/A"}
                            </div>
                          </div>
                        </div>

                        {/* Project Description */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-450">Project Description</label>
                          <div className="w-full p-4 rounded-xl border border-neutral-250 bg-white text-sm font-semibold text-neutral-850 select-all min-h-[70px] leading-relaxed">
                            {proj.description}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Github URL */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-450">GitHub Repository URL</label>
                            <div className="w-full h-11 px-4 rounded-xl border border-neutral-250 bg-white flex items-center text-sm font-semibold text-[#ff922b] select-all truncate">
                              {proj.githubUrl ? (
                                <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5 truncate">
                                  {proj.githubUrl}
                                </a>
                              ) : "N/A"}
                            </div>
                          </div>

                          {/* Live Site URL */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-450">Live Site URL</label>
                            <div className="w-full h-11 px-4 rounded-xl border border-neutral-250 bg-white flex items-center text-sm font-semibold text-[#ff922b] select-all truncate">
                              {proj.liveUrl ? (
                                <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5 truncate">
                                  {proj.liveUrl}
                                </a>
                              ) : "N/A"}
                            </div>
                          </div>
                        </div>

                        {/* Attachments & Previews row (video 200px*120px & screenshots) */}
                        <div className="flex flex-col gap-2 border-t border-neutral-200/50 pt-4 mt-2">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-450">Attachments & Previews</label>
                          <div className="flex flex-wrap items-center gap-3">
                            
                            {/* Compact Video Preview: 200px * 120px */}
                            {proj.demoVideoUrl && (
                              <div 
                                onClick={() => setActiveLightboxVideo(resolveMediaUrl(proj.demoVideoUrl) || null)}
                                className="w-[200px] h-[120px] rounded-xl border border-neutral-300 overflow-hidden bg-black shrink-0 relative cursor-pointer shadow-md hover:border-[#ff922b]/50 group"
                                title="Click to play demo video"
                              >
                                {proj.demoVideoUrl.startsWith("data:video/") || proj.demoVideoUrl.includes(".mp4") || proj.demoVideoUrl.includes("/media/") ? (
                                  <video src={resolveMediaUrl(proj.demoVideoUrl)} className="w-full h-full object-cover pointer-events-none" preload="metadata" />
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

                            {/* Compact Screenshots Previews: 200px * 120px */}
                            {proj.screenshots && proj.screenshots.map((src: string, sIdx: number) => (
                              <div 
                                key={sIdx}
                                onClick={() => setLightboxImage(resolveMediaUrl(src))}
                                className="w-[200px] h-[120px] rounded-xl border border-neutral-300 overflow-hidden bg-neutral-100 shrink-0 relative cursor-pointer shadow-md hover:border-[#ff922b]/50"
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
                )}

                {/* Project Edit/Add Form Block */}
                {isEditingProject && (
                  <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-2xl p-6 md:p-8 flex flex-col gap-5 shadow-inner">
                    
                    <div className="flex justify-between items-center border-b border-neutral-200/40 pb-3">
                      <span className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider">
                        {editingIndex !== null ? "Edit Project Details" : `Add Project Showcase (${projectsList.length + 1} of 3)`}
                      </span>
                      {projectsList.length > 0 && (
                        <button type="button" onClick={handleCancelProject} className="text-neutral-400 hover:text-neutral-600">
                          <X className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>

                    {tempProjectError && (
                      <div className="text-xs text-red-600 font-semibold p-2.5 bg-red-50 border border-red-200 rounded-lg">
                        {tempProjectError}
                      </div>
                    )}

                    {/* Two-column: Project Name & Demo video URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700">Project Name *</label>
                        <input
                          type="text"
                          placeholder="E.g., DevConnector Social Network"
                          value={tempProjName}
                          onChange={(e) => setTempProjName(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl border border-neutral-350 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff922b]/20 focus:border-[#ff922b] placeholder:text-neutral-400 transition-all"
                        />
                      </div>
                      
                      {/* Demo Video Switcher & Form Field */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700">Demo Video *</label>
                          <div className="flex bg-neutral-200/60 p-0.5 rounded-lg text-[9px] font-bold">
                            <button
                              type="button"
                              onClick={() => {
                                setTempProjVideoType("link");
                                setTempProjVideoUrl("");
                                setTempProjVideoFileName("");
                              }}
                              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                                tempProjVideoType === "link" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-800"
                              }`}
                            >
                              Video Link
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTempProjVideoType("upload");
                                setTempProjVideoUrl("");
                                setTempProjVideoFileName("");
                              }}
                              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                                tempProjVideoType === "upload" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-800"
                              }`}
                            >
                              Upload File
                            </button>
                          </div>
                        </div>

                        {tempProjVideoType === "link" ? (
                          <input
                            type="url"
                            placeholder="E.g., YouTube link or direct MP4 link"
                            value={tempProjVideoUrl}
                            onChange={(e) => setTempProjVideoUrl(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-neutral-350 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff922b]/20 focus:border-[#ff922b] placeholder:text-neutral-400 transition-all"
                          />
                        ) : (
                          <div className="flex flex-col gap-2">
                            <div className="border border-dashed border-neutral-350 hover:border-[#ff922b]/50 bg-white p-4 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors relative cursor-pointer text-center">
                              <Upload className="w-5 h-5 text-[#ff922b]" />
                              <div className="flex flex-col items-center">
                                <span className="text-xs font-bold text-neutral-700">Click to upload demo video</span>
                                <span className="text-[9px] text-neutral-400 font-semibold">Supports MP4, WebM (Max 15MB)</span>
                              </div>
                              <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                id="video-file-upload-input"
                                onChange={handleVideoUpload}
                              />
                              <label htmlFor="video-file-upload-input" className="absolute inset-0 cursor-pointer" />
                            </div>

                            {tempProjVideoFileName && (
                              <div className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-250 bg-white text-xs text-neutral-700 font-semibold">
                                <div className="flex items-center gap-2 truncate">
                                  <Play className="w-4 h-4 text-[#ff922b] shrink-0" />
                                  <span className="truncate font-medium">{tempProjVideoFileName}</span>
                                </div>
                                <button 
                                  onClick={() => { setTempProjVideoUrl(""); setTempProjVideoFileName(""); }}
                                  className="text-neutral-400 hover:text-neutral-600"
                                >
                                  <X className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Project Description */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700">Project Description *</label>
                      <textarea
                        rows={3}
                        placeholder="Describe your project, features, and key challenges solved..."
                        value={tempProjDesc}
                        onChange={(e) => setTempProjDesc(e.target.value)}
                        className="w-full p-4 rounded-xl border border-neutral-350 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff922b]/20 focus:border-[#ff922b] placeholder:text-neutral-400 resize-none transition-all"
                      />
                    </div>

                    {/* Two-column: GitHub Repo & Live Site URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700">GitHub Repository URL</label>
                        <input
                          type="url"
                          placeholder="https://github.com/..."
                          value={tempProjGit}
                          onChange={(e) => setTempProjGit(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl border border-neutral-350 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff922b]/20 focus:border-[#ff922b] placeholder:text-neutral-400 transition-all"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700">Live Site URL</label>
                        <input
                          type="url"
                          placeholder="https://mysite.com"
                          value={tempProjLive}
                          onChange={(e) => setTempProjLive(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl border border-neutral-350 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff922b]/20 focus:border-[#ff922b] placeholder:text-neutral-400 transition-all"
                        />
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700">Tech Stack (comma-separated)</label>
                      <input
                        type="text"
                        placeholder="React, Express, TailwindCSS, MongoDB"
                        value={tempProjStack}
                        onChange={(e) => setTempProjStack(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-neutral-350 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff922b]/20 focus:border-[#ff922b] placeholder:text-neutral-400 transition-all"
                      />
                    </div>

                    {/* Screenshots gallery */}
                    <div className="flex flex-col gap-2.5 border-t border-neutral-200/50 pt-5 mt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#ff922b]" /> Project Screenshots ({tempScreenshots.length}/4)
                        </label>
                        <span className="text-[10px] text-neutral-400 font-semibold">Attach up to 4 screenshots</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {tempScreenshots.map((src, i) => (
                          <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-neutral-300 group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleDeleteScreenshot(i)}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 hover:text-red-400 transition-opacity"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        
                        {tempScreenshots.length < 4 && (
                          <label className="relative aspect-video rounded-xl border-2 border-dashed border-neutral-300 hover:border-[#ff922b]/50 bg-white hover:bg-neutral-50 flex flex-col items-center justify-center cursor-pointer transition-all gap-1 text-neutral-450 hover:text-neutral-605">
                            <Upload className="w-5 h-5 text-[#ff922b]" />
                            <span className="text-[9px] font-extrabold uppercase tracking-widest">Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="screenshot-upload-input"
                              onChange={handleScreenshotUpload}
                            />
                            <label htmlFor="screenshot-upload-input" className="absolute inset-0 cursor-pointer" />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Save and Cancel project buttons */}
                    <div className="flex justify-end gap-3 border-t border-neutral-200/40 pt-4 mt-2">
                      {projectsList.length > 0 && (
                        <button
                          type="button"
                          onClick={handleCancelProject}
                          className="px-4 py-2 text-xs font-bold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleSaveProject}
                        className="px-5 py-2 text-xs font-extrabold text-white bg-[#ff922b] hover:bg-[#e8590c] rounded-xl transition-all shadow-md shadow-[#ff922b]/25 active:scale-95 cursor-pointer"
                      >
                        Save Project
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </section>

            {/* SECTION 3: RESUME, SOCIALS & USERNAME */}
            <section id="resume-socials" className="scroll-mt-28 transition-all duration-300">
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#ff922b]" /> Resume & Links
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">Upload your resume, add social links, and claim your permanent showcase URL.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left sub-column: Resume upload & Social links */}
                  <div className="flex flex-col gap-6">
                    
                    {/* Resume Upload Box */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#ff922b]" /> Resume Link (PDF)
                      </label>
                      
                      <div className="border-2 border-dashed border-neutral-305 bg-neutral-50/50 hover:bg-[#ff922b]/5 p-6 rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-colors relative cursor-pointer text-center">
                        <Upload className="w-7 h-7 text-[#ff922b]" />
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs font-bold text-neutral-700">Click or drag PDF resume here</span>
                          <span className="text-[9px] text-neutral-400 font-semibold">Only PDF format supported (Max 5MB)</span>
                        </div>
                        <input
                          type="file"
                          accept=".pdf"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleFileUpload}
                        />
                      </div>

                      {resumeFileName && (
                        <div className="flex items-center gap-3 mt-1.5 p-4 border border-[#ff922b]/15 bg-[#ff922b]/5 rounded-2xl">
                          {/* Compact Resume Preview: 200px * 120px */}
                          <div 
                            onClick={() => setShowResumeViewer(true)}
                            className="w-[200px] h-[120px] rounded-xl border border-neutral-350 bg-white hover:bg-neutral-50 flex flex-col justify-between shrink-0 cursor-pointer shadow-md hover:border-[#ff922b]/50 group transition-all relative overflow-hidden"
                          >
                            <iframe 
                              src={`${resolveMediaUrl(resumeUrl)}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`} 
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
                          
                          <div className="flex flex-col truncate flex-grow">
                            <span className="text-xs text-neutral-800 font-extrabold truncate">{resumeFileName}</span>
                            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider cursor-pointer hover:underline" onClick={() => {
                              const link = document.createElement("a");
                              link.href = resolveMediaUrl(resumeUrl);
                              link.setAttribute("download", resumeFileName);
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}>Download PDF</span>
                          </div>

                          <button 
                            type="button"
                            onClick={() => { setResumeFileName(""); setResumeUrl(""); }}
                            className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 bg-white border border-red-200 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Delete Resume"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Connect Channels */}
                    <div className="flex flex-col gap-4 mt-2">
                      <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-750 flex items-center gap-1.5">
                        <LinkIcon className="w-4 h-4 text-[#ff922b]" /> Connect Channels
                      </label>

                      {/* LinkedIn */}
                      <div className="flex flex-col gap-1">
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-neutral-400">
                            <Linkedin className="w-4 h-4 text-[#0077b5]" />
                          </span>
                          <input
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            className="w-full h-10 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff922b]/20 focus:border-[#ff922b] placeholder:text-neutral-400 transition-all"
                          />
                        </div>
                      </div>

                      {/* GitHub */}
                      <div className="flex flex-col gap-1">
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-neutral-400">
                            <Github className="w-4 h-4 text-neutral-800" />
                          </span>
                          <input
                            type="url"
                            placeholder="https://github.com/username"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                            className="w-full h-10 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff922b]/20 focus:border-[#ff922b] placeholder:text-neutral-400 transition-all"
                          />
                        </div>
                      </div>

                      {/* Twitter */}
                      <div className="flex flex-col gap-1">
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-neutral-400">
                            <Twitter className="w-4 h-4 text-sky-400" />
                          </span>
                          <input
                            type="url"
                            placeholder="https://twitter.com/username"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                            className="w-full h-10 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff922b]/20 focus:border-[#ff922b] placeholder:text-neutral-400 transition-all"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Right sub-column: Choose Link */}
                  <div className="flex flex-col gap-5 bg-[#ff922b]/5 border border-[#ff922b]/15 p-6 rounded-2xl shadow-sm">
                    <div>
                      <h4 className="text-md font-bold text-neutral-900 flex items-center gap-1.5">
                        <Globe className="w-4.5 h-4.5 text-[#ff922b]" /> Choose Link Username
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Pick a unique name. This forms your permanent portfolio link.</p>
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700">Permanent Username</label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-xs text-neutral-450 font-bold select-none">hire.me/</span>
                          <input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                            className="w-full h-11 pl-[4.2rem] pr-20 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff922b]/20 focus:border-[#ff922b] font-bold text-neutral-850 placeholder:text-neutral-400"
                            required
                          />
                          {username.length >= 3 && usernameAvailable !== null && (
                            <span className={`absolute right-3.5 text-[11px] font-bold ${usernameAvailable ? "text-emerald-600" : "text-red-500"}`}>
                              {usernameAvailable ? "Available" : "Taken"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Visual link preview widget */}
                      <div className="p-4 rounded-xl border border-neutral-200/80 bg-white/70 flex flex-col gap-2 mt-2">
                        <span className="text-[10px] font-extrabold text-[#ff922b] uppercase tracking-wider">Your Showcase URL Preview</span>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-600 truncate bg-neutral-50 p-2.5 rounded-lg border border-neutral-150">
                          <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className="truncate">http://localhost:3000/{username || "username"}</span>
                        </div>
                        
                        <div className="mt-2 text-[10px] text-neutral-400 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>Includes SSL certificate, page analytics, and responsive portfolio theme layout.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-14 pt-8 border-t border-neutral-100 flex flex-col items-center">
            <button
              onClick={handleComplete}
              disabled={loading || !usernameAvailable || !name.trim() || projectsList.length === 0}
              className="w-full md:w-80 py-4 px-6 rounded-2xl bg-[#ff922b] hover:bg-[#e8590c] text-white font-extrabold tracking-wider uppercase shadow-lg shadow-[#ff922b]/25 active:scale-[0.98] hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:hover:bg-[#ff922b] disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Link...</span>
                </>
              ) : (
                <>
                  <span>Generate Link</span>
                </>
              )}
            </button>
            <span className="text-[10px] text-neutral-450 font-semibold tracking-wider uppercase mt-3">Already a Member? <span className="text-[#ff922b] hover:underline cursor-pointer" onClick={() => router.push("/login")}>Sign In</span></span>
          </div>

        </div>

      </div>

      <footer className="w-full py-12 text-center relative z-10">
        <span className="text-xs text-white/80 font-semibold tracking-wide drop-shadow-sm">
          Showcase link generated via <span className="font-extrabold text-white">hire.me</span>
        </span>
      </footer>

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
              <span className="text-sm font-extrabold uppercase tracking-wider text-neutral-305">Resume Viewer</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = resolveMediaUrl(resumeUrl);
                    link.setAttribute("download", resumeFileName || "resume.pdf");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-955 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer bg-[#ff922b]"
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
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 bg-neutral-955 text-neutral-405 -z-10">
                <FileText className="w-10 h-10 text-neutral-600 animate-pulse" />
                <span className="text-xs font-bold tracking-widest uppercase">Loading Resume PDF Preview...</span>
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = resolveMediaUrl(resumeUrl);
                    link.setAttribute("download", resumeFileName || "resume.pdf");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="mt-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Download PDF Instead
                </button>
              </div>
              
              <iframe 
                src={resolveMediaUrl(resumeUrl)} 
                title="Resume Preview" 
                className="w-full h-full border-0 relative z-10"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function Onboarding() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#ffdca3] via-[#ff9c50] to-[#e8590c] flex items-center justify-center text-white select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-widest uppercase text-white/85">Loading Setup...</span>
        </div>
      </div>
    }>
      <OnboardingForm />
    </Suspense>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { apiMock, Skill, Project, Certification, Profile } from "../../utils/apiMock";
import { 
  User, Link as LinkIcon, FileText, Briefcase, Award, CheckCircle, 
  ArrowRight, ArrowLeft, Upload, Plus, X, Globe, Phone, MapPin
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


export default function Onboarding() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Basic Info
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  // Step 2: Professional Links
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [leetcode, setLeetcode] = useState("");

  // Step 3: Resume
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  // Step 4: Skills
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<Skill["category"]>("Frontend");

  // Step 5: Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [projName, setProjName] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projStack, setProjStack] = useState("");
  const [projGit, setProjGit] = useState("");
  const [projLive, setProjLive] = useState("");
  const [projThumb, setProjThumb] = useState("");

  // Step 6: Certifications
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certUrl, setCertUrl] = useState("");

  // Step 7: Username selection
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  // Authenticate user on mount
  useEffect(() => {
    const user = apiMock.getCurrentUser();
    if (!user) {
      router.push("/login");
    } else {
      setCurrentUser(user);
      setName(user.name || "");
    }
  }, [router]);

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

  // Convert files to base64 for local storage storage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "banner" | "resume") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (type === "avatar") setAvatarUrl(base64);
      else if (type === "banner") setBannerUrl(base64);
      else if (type === "resume") {
        setResumeUrl(base64);
        setResumeFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  // Skill Add/Remove
  const addSkill = () => {
    if (!newSkillName.trim()) return;
    if (skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;
    setSkills([...skills, { name: newSkillName.trim(), category: newSkillCategory }]);
    setNewSkillName("");
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Project Add/Remove
  const addProject = () => {
    if (!projName.trim() || !projDesc.trim()) return;
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name: projName.trim(),
      description: projDesc.trim(),
      techStack: projStack.split(",").map(t => t.trim()).filter(Boolean),
      githubUrl: projGit.trim() || undefined,
      liveUrl: projLive.trim() || undefined,
      thumbnailUrl: projThumb.trim() || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=300&h=180",
    };
    setProjects([...projects, newProj]);
    setProjName("");
    setProjDesc("");
    setProjStack("");
    setProjGit("");
    setProjLive("");
    setProjThumb("");
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Certification Add/Remove
  const addCertification = () => {
    if (!certName.trim() || !certIssuer.trim()) return;
    const newCert: Certification = {
      id: `cert_${Date.now()}`,
      name: certName.trim(),
      issuer: certIssuer.trim(),
      issueDate: certDate.trim() || "N/A",
      credentialUrl: certUrl.trim() || undefined,
    };
    setCertifications([...certifications, newCert]);
    setCertName("");
    setCertIssuer("");
    setCertDate("");
    setCertUrl("");
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(c => c.id !== id));
  };

  // Form Submit (Complete Onboarding)
  const handleComplete = async () => {
    if (!username || !usernameAvailable) {
      setError("Please select a valid, unique username.");
      return;
    }
    setLoading(true);
    setError("");

    const profileData: Partial<Profile> = {
      username,
      name,
      headline: headline || "Professional",
      location: location || "Remote",
      phone,
      bio: bio || "Professional profile card.",
      avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150",
      bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1200&h=300",
      theme: "modern",
      accentColor: "#3b82f6", // Default blue
      socialLinks: {
        linkedin: linkedin || undefined,
        github: github || undefined,
        portfolio: portfolio || undefined,
        twitter: twitter || undefined,
        leetcode: leetcode || undefined,
      },
      skills,
      projects,
      certifications,
      resumeUrl: resumeUrl || undefined,
      resumeFileName: resumeFileName || undefined,
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
        // Trigger completion confetti
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

  const nextStep = () => setStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Motion variants for slide animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    })
  };

  const getStepDirection = (currStep: number) => {
    // Basic direction tracker (always forward for now)
    return 1;
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start bg-[#030304] text-white px-4 py-24 select-none">
      
      {/* Background glow effects */}
      <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-neutral-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] rounded-full bg-neutral-600/5 blur-[120px] pointer-events-none" />

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-neutral-950/20 backdrop-blur-md border-b border-white/5">
        <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-300 to-neutral-600 bg-clip-text text-transparent">
          hire.me
        </span>
        <span className="text-xs text-neutral-400 font-semibold">
          Onboarding Setup
        </span>
      </header>

      {/* Progress Tracker Wrapper */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between items-center text-xs text-neutral-400 font-bold uppercase tracking-wider mb-2">
          <span>Progress</span>
          <span>Step {step} of 7</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-white via-neutral-300 to-neutral-600 transition-all duration-300 ease-out"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Form Frame */}
      <div className="w-full max-w-xl min-h-[460px] p-6 md:p-8 rounded-3xl border border-white/5 bg-neutral-950/45 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
        
        {/* Step-by-step forms */}
        <div className="flex-1 mb-8 overflow-hidden">
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" /> Basic Information
                </h3>
                <p className="text-xs text-neutral-400">Introduce yourself to hiring managers and recruiters.</p>
              </div>

              {/* Photo Uploads */}
              <div className="flex gap-4 items-center p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 shrink-0 bg-neutral-900 flex items-center justify-center">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-neutral-600" />
                  )}
                  <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Upload className="w-4 h-4 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "avatar")} />
                  </label>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold">Profile Photo</span>
                  <span className="text-[10px] text-neutral-400">Upload a professional headshot.</span>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-neutral-400/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Headline</label>
                  <input
                    type="text"
                    placeholder="MERN Stack Developer | React Architect"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-neutral-400/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Location</label>
                    <input
                      type="text"
                      placeholder="Boston, MA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-neutral-400/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Phone</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-neutral-400/50"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Short Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Write a concise professional summary about your career goals and core stack..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="p-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-neutral-400/50 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-orange-400" /> Professional Links
                </h3>
                <p className="text-xs text-neutral-400">Link your profiles so recruiters can verify your codebase and history.</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5 text-blue-400" /> LinkedIn URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-neutral-400/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5"><Github className="w-3.5 h-3.5 text-neutral-300" /> GitHub URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-neutral-400/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-emerald-400" /> Portfolio Website</label>
                  <input
                    type="url"
                    placeholder="https://myportfolio.com"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-neutral-400/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5"><Twitter className="w-3.5 h-3.5 text-sky-400" /> Twitter/X</label>
                  <input
                    type="url"
                    placeholder="https://twitter.com/username"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-neutral-400/50"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" /> Resume Upload
                </h3>
                <p className="text-xs text-neutral-400">Upload your latest PDF resume. Recruiters can view or download it directly.</p>
              </div>

              {/* Drag and Drop Container */}
              <div className="border border-dashed border-white/10 hover:border-indigo-400/40 bg-white/5 p-8 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors relative cursor-pointer">
                <Upload className="w-8 h-8 text-neutral-400" />
                <div className="flex flex-col items-center text-center gap-1">
                  <span className="text-xs font-semibold text-white">Click or drag your PDF resume here</span>
                  <span className="text-[10px] text-neutral-500">Only PDF formats supported (Max size 5MB)</span>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleFileUpload(e, "resume")}
                />
              </div>

              {resumeFileName && (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/15 bg-indigo-950/10 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate font-medium text-indigo-200">{resumeFileName}</span>
                  </div>
                  <button 
                    onClick={() => { setResumeFileName(""); setResumeUrl(""); }}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-teal-400" /> Skills Section
                </h3>
                <p className="text-xs text-neutral-400">Categorize your core tech stacks and libraries.</p>
              </div>

              {/* Skill Input Form */}
              <div className="flex gap-2 items-end">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Skill Name</label>
                  <input
                    type="text"
                    placeholder="React, Docker, AWS"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-neutral-400/50"
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Category</label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value as Skill["category"])}
                    className="h-10 px-3.5 rounded-xl border border-white/10 bg-white/5 text-xs text-neutral-300 focus:outline-none focus:border-neutral-400/50"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Cloud">Cloud</option>
                    <option value="Tools">Tools</option>
                    <option value="Languages">Languages</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={addSkill}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white text-neutral-950 hover:bg-neutral-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Skill Badges List */}
              <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto p-1.5">
                {skills.map((s, idx) => (
                  <div 
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 text-xs"
                  >
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-[9px] text-neutral-400 uppercase tracking-widest">({s.category})</span>
                    <button onClick={() => removeSkill(idx)} className="text-neutral-500 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {skills.length === 0 && (
                  <span className="text-xs text-neutral-500 italic">No skills added yet.</span>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" /> Featured Projects
                </h3>
                <p className="text-xs text-neutral-400">Add highlight projects to showcase in your portfolio section.</p>
              </div>

              {/* Add Project Form Drawer */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-white/5 bg-white/5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Project Name</label>
                    <input
                      type="text"
                      placeholder="MERN E-Commerce"
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="React, Node, Mongo"
                      value={projStack}
                      onChange={(e) => setProjStack(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Short Description</label>
                  <input
                    type="text"
                    placeholder="Fully responsive shopping application with integrated payment portals."
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">GitHub Repository URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={projGit}
                      onChange={(e) => setProjGit(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Live Demo URL</label>
                    <input
                      type="url"
                      placeholder="https://mydemo.com"
                      value={projLive}
                      onChange={(e) => setProjLive(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addProject}
                  className="h-9 w-full rounded-lg bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 active:scale-98 transition-all"
                >
                  Add Project to List
                </button>
              </div>

              {/* Added Projects List */}
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                {projects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/5 text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold">{p.name}</span>
                      <span className="text-[10px] text-neutral-400">{p.techStack.join(", ")}</span>
                    </div>
                    <button onClick={() => removeProject(p.id || "")} className="text-neutral-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" /> Certifications
                </h3>
                <p className="text-xs text-neutral-400">Optional: Add relevant certifications, bootcamps, or course details.</p>
              </div>

              {/* Add Cert Form */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-white/5 bg-white/5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Certification Name</label>
                    <input
                      type="text"
                      placeholder="Solutions Architect"
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Issuer Agency</label>
                    <input
                      type="text"
                      placeholder="AWS, Vercel"
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Issue Date</label>
                    <input
                      type="text"
                      placeholder="June 2025"
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Credential URL</label>
                    <input
                      type="url"
                      placeholder="https://verify.com/cert"
                      value={certUrl}
                      onChange={(e) => setCertUrl(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addCertification}
                  className="h-9 w-full rounded-lg bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 active:scale-98 transition-all"
                >
                  Add Certification
                </button>
              </div>

              {/* Added Certifications List */}
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                {certifications.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/5 text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold">{c.name}</span>
                      <span className="text-[10px] text-neutral-400">{c.issuer}</span>
                    </div>
                    <button onClick={() => removeCertification(c.id || "")} className="text-neutral-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" /> Choose Username
                </h3>
                <p className="text-xs text-neutral-400">This will be your permanent shareable URL link.</p>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Select Username</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs text-neutral-500 font-medium">hire.me/</span>
                    <input
                      type="text"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                      className="w-full h-11 pl-20 pr-12 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-neutral-400/50 font-semibold"
                      required
                    />
                    {usernameAvailable !== null && (
                      <span className={`absolute right-3.5 text-xs font-semibold ${usernameAvailable ? "text-emerald-500" : "text-rose-500"}`}>
                        {usernameAvailable ? "Available" : "Taken"}
                      </span>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="text-xs text-rose-400 p-2.5 bg-rose-950/10 border border-rose-500/10 rounded-xl">
                    {error}
                  </div>
                )}

                <div className="p-4 rounded-2xl border border-white/5 bg-white/5 flex flex-col gap-2 mt-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Example Links Generated</h4>
                  <div className="flex flex-col gap-1 text-[11px] font-mono text-neutral-400">
                    <span>- http://localhost:3001/{username || "username"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Controls */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <button
            onClick={prevStep}
            disabled={step === 1 || loading}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {step < 7 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white bg-white/10 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/20 active:scale-95 transition-all"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading || !usernameAvailable}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-white px-5 py-2.5 rounded-xl hover:bg-neutral-200 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Creating Profile..." : "Create Profile"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

"use client";

// TypeScript interfaces for hire.me SaaS data models
export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
  leetcode?: string;
  personal?: string;
}

export interface Skill {
  name: string;
  category: "Frontend" | "Backend" | "Database" | "Cloud" | "Tools" | "Languages";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnailUrl?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface Profile {
  username: string;
  name: string;
  headline: string;
  location: string;
  phone: string;
  email: string;
  bio: string;
  avatarUrl?: string;
  bannerUrl?: string;
  theme: "modern" | "minimal" | "corporate" | "developer" | "dark";
  accentColor: string;
  socialLinks: SocialLinks;
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  resumeUrl?: string;
  resumeFileName?: string;
  viewsCount: number;
  downloadsCount: number;
  clicksCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface AnalyticsEvent {
  id: string;
  username: string;
  eventType: "view" | "resume_download" | "link_click";
  eventMetadata?: string; // e.g., "github" or "linkedin"
  deviceType: "desktop" | "mobile" | "tablet";
  timestamp: string;
}

// SSR Safe LocalStorage Utility Wrapper
const isClient = typeof window !== "undefined";

const getStorage = <T>(key: string): T | null => {
  if (!isClient) return null;
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : null;
};

const setStorage = (key: string, val: any): void => {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(val));
};

// Initial Seed Data - Preloaded for instant profile rendering
const SEED_USERS: User[] = [
  {
    id: "user_krishna",
    name: "Krishna Gopal",
    email: "krishna@example.com",
    passwordHash: "mock_hash_123",
  }
];

const SEED_PROFILES: Record<string, Profile> = {
  krishna: {
    username: "krishna",
    name: "Krishna Gopal",
    headline: "Senior Full Stack Architect",
    location: "San Francisco, CA",
    phone: "+1 (555) 019-2834",
    email: "krishna@example.com",
    bio: "Passionate about building highly-optimized web architectures, interactive 3D/canvas animation systems, and scalable cloud structures. Specialized in Next.js, Node.js, TypeScript, Docker, and AWS.",
    theme: "developer",
    accentColor: "#f59e0b", // Warm amber
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200",
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=300",
    resumeUrl: "mock_resume_base64_placeholder",
    resumeFileName: "Krishna_Gopal_Resume.pdf",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      portfolio: "https://portfolio.com",
      twitter: "https://twitter.com",
      leetcode: "https://leetcode.com",
    },
    skills: [
      { name: "React", category: "Frontend" },
      { name: "Next.js", category: "Frontend" },
      { name: "TypeScript", category: "Languages" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "GSAP", category: "Tools" },
      { name: "Node.js", category: "Backend" },
      { name: "Express.js", category: "Backend" },
      { name: "GraphQL", category: "Backend" },
      { name: "MongoDB", category: "Database" },
      { name: "PostgreSQL", category: "Database" },
      { name: "Docker", category: "Tools" },
      { name: "AWS", category: "Cloud" },
    ],
    projects: [
      {
        id: "proj1",
        name: "hire.me SaaS Platform",
        description: "Full-fledged SaaS portfolio identity aggregator for developers with dynamic themes, real-time analytics, and vCard extraction.",
        techStack: ["Next.js", "Tailwind CSS", "GSAP ScrollTrigger", "Framer Motion"],
        githubUrl: "https://github.com",
        liveUrl: "http://localhost:3001",
        thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500&h=300",
      },
      {
        id: "proj2",
        name: "Retro Canvas Cinematic Slider",
        description: "High-performance scroll-driven day-to-night environment scrubber drawing loaded frames sequentially on canvas with smooth linear blending filters.",
        techStack: ["HTML5 Canvas", "React Hooks", "GSAP", "Tailwind CSS"],
        githubUrl: "https://github.com",
        liveUrl: "http://localhost:3001",
        thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=500&h=300",
      }
    ],
    certifications: [
      {
        id: "cert1",
        name: "AWS Certified Solutions Architect - Professional",
        issuer: "Amazon Web Services (AWS)",
        issueDate: "June 2025",
        credentialUrl: "https://aws.amazon.com",
      },
      {
        id: "cert2",
        name: "Next.js core Architect Certificate",
        issuer: "Vercel",
        issueDate: "March 2026",
        credentialUrl: "https://nextjs.org",
      }
    ],
    viewsCount: 342,
    downloadsCount: 87,
    clicksCount: 156,
  }
};

const SEED_ANALYTICS: AnalyticsEvent[] = [
  { id: "e1", username: "krishna", eventType: "view", deviceType: "desktop", timestamp: "2026-06-09T10:00:00Z" },
  { id: "e2", username: "krishna", eventType: "view", deviceType: "mobile", timestamp: "2026-06-09T11:00:00Z" },
  { id: "e3", username: "krishna", eventType: "resume_download", deviceType: "desktop", timestamp: "2026-06-09T11:15:00Z" },
  { id: "e4", username: "krishna", eventType: "link_click", eventMetadata: "github", deviceType: "desktop", timestamp: "2026-06-09T12:00:00Z" },
  { id: "e5", username: "krishna", eventType: "link_click", eventMetadata: "linkedin", deviceType: "mobile", timestamp: "2026-06-09T13:00:00Z" },
];

// Database Initialization Helper
export const initializeMockDb = () => {
  if (!isClient) return;
  if (!localStorage.getItem("tc_users")) {
    setStorage("tc_users", SEED_USERS);
  }
  if (!localStorage.getItem("tc_profiles")) {
    setStorage("tc_profiles", SEED_PROFILES);
  }
  if (!localStorage.getItem("tc_analytics")) {
    setStorage("tc_analytics", SEED_ANALYTICS);
  }
};

// API MOCK WRAPPERS
export const apiMock = {
  // Authentication Actions
  register: async (name: string, email: string, passwordHash: string): Promise<{ success: boolean; user?: Omit<User, "passwordHash">; error?: string }> => {
    initializeMockDb();
    const users = getStorage<User[]>("tc_users") || [];
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Email already exists." };
    }
    const newUser: User = {
      id: `user_${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      passwordHash,
    };
    users.push(newUser);
    setStorage("tc_users", users);
    
    // Log user in automatically
    setStorage("tc_logged_user", { id: newUser.id, name: newUser.name, email: newUser.email });
    return { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } };
  },

  login: async (email: string, passwordHash: string): Promise<{ success: boolean; user?: Omit<User, "passwordHash">; error?: string }> => {
    initializeMockDb();
    const users = getStorage<User[]>("tc_users") || [];
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash);
    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }
    const loggedUser = { id: user.id, name: user.name, email: user.email };
    setStorage("tc_logged_user", loggedUser);
    return { success: true, user: loggedUser };
  },

  getCurrentUser: (): Omit<User, "passwordHash"> | null => {
    return getStorage<Omit<User, "passwordHash">>("tc_logged_user");
  },

  logout: (): void => {
    if (!isClient) return;
    localStorage.removeItem("tc_logged_user");
  },

  // Profile Actions
  checkUsernameAvailable: async (username: string): Promise<boolean> => {
    initializeMockDb();
    const profiles = getStorage<Record<string, Profile>>("tc_profiles") || {};
    const cleanedUsername = username.trim().toLowerCase();
    
    // Check reserved routes
    const reserved = ["login", "register", "onboarding", "dashboard", "api", "admin"];
    if (reserved.includes(cleanedUsername)) return false;
    
    return !profiles[cleanedUsername];
  },

  getProfile: async (username: string): Promise<Profile | null> => {
    initializeMockDb();
    const profiles = getStorage<Record<string, Profile>>("tc_profiles") || {};
    return profiles[username.trim().toLowerCase()] || null;
  },

  getMyProfile: async (): Promise<Profile | null> => {
    initializeMockDb();
    const user = apiMock.getCurrentUser();
    if (!user) return null;
    
    const profiles = getStorage<Record<string, Profile>>("tc_profiles") || {};
    const myProfile = Object.values(profiles).find((p) => p.email === user.email);
    return myProfile || null;
  },

  updateMyProfile: async (profileData: Partial<Profile>): Promise<{ success: boolean; profile?: Profile; error?: string }> => {
    initializeMockDb();
    const user = apiMock.getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated." };

    const profiles = getStorage<Record<string, Profile>>("tc_profiles") || {};
    
    // Find matching profile by email, or create new
    let existingProfile = Object.values(profiles).find((p) => p.email === user.email);
    let username = profileData.username || existingProfile?.username;

    if (!username) {
      return { success: false, error: "Username is required." };
    }

    username = username.trim().toLowerCase();

    // Check username availability if it's changing
    if (existingProfile && existingProfile.username !== username) {
      const available = await apiMock.checkUsernameAvailable(username);
      if (!available) return { success: false, error: "Username is already taken." };
      
      // Delete old username key
      delete profiles[existingProfile.username];
    }

    const updatedProfile: Profile = {
      username,
      name: profileData.name || existingProfile?.name || user.name,
      headline: profileData.headline || existingProfile?.headline || "New Professional",
      location: profileData.location || existingProfile?.location || "",
      phone: profileData.phone || existingProfile?.phone || "",
      email: profileData.email || existingProfile?.email || user.email,
      bio: profileData.bio || existingProfile?.bio || "",
      avatarUrl: profileData.avatarUrl || existingProfile?.avatarUrl,
      bannerUrl: profileData.bannerUrl || existingProfile?.bannerUrl,
      theme: profileData.theme || existingProfile?.theme || "modern",
      accentColor: profileData.accentColor || existingProfile?.accentColor || "#3b82f6",
      socialLinks: { ...existingProfile?.socialLinks, ...profileData.socialLinks },
      skills: profileData.skills || existingProfile?.skills || [],
      projects: profileData.projects || existingProfile?.projects || [],
      certifications: profileData.certifications || existingProfile?.certifications || [],
      resumeUrl: profileData.resumeUrl || existingProfile?.resumeUrl,
      resumeFileName: profileData.resumeFileName || existingProfile?.resumeFileName,
      viewsCount: existingProfile?.viewsCount || 0,
      downloadsCount: existingProfile?.downloadsCount || 0,
      clicksCount: existingProfile?.clicksCount || 0,
    };

    profiles[username] = updatedProfile;
    setStorage("tc_profiles", profiles);
    return { success: true, profile: updatedProfile };
  },

  // Analytics Engine
  recordEvent: async (username: string, eventType: "view" | "resume_download" | "link_click", eventMetadata?: string): Promise<void> => {
    initializeMockDb();
    const analytics = getStorage<AnalyticsEvent[]>("tc_analytics") || [];
    const profiles = getStorage<Record<string, Profile>>("tc_profiles") || {};
    const profile = profiles[username.trim().toLowerCase()];
    if (!profile) return;

    // Detect device type
    let deviceType: "desktop" | "mobile" | "tablet" = "desktop";
    if (isClient) {
      const ua = navigator.userAgent.toLowerCase();
      if (/tablet|ipad|playbook|silk/i.test(ua)) {
        deviceType = "tablet";
      } else if (/mobile|iphone|ipod|android|blackberry|iemobile|kindle/i.test(ua)) {
        deviceType = "mobile";
      }
    }

    const newEvent: AnalyticsEvent = {
      id: `evt_${Math.random().toString(36).substring(2, 9)}`,
      username: username.toLowerCase(),
      eventType,
      eventMetadata,
      deviceType,
      timestamp: new Date().toISOString(),
    };

    analytics.push(newEvent);
    setStorage("tc_analytics", analytics);

    // Increment profile fast counters for UI convenience
    if (eventType === "view") profile.viewsCount++;
    else if (eventType === "resume_download") profile.downloadsCount++;
    else if (eventType === "link_click") profile.clicksCount++;

    profiles[username.toLowerCase()] = profile;
    setStorage("tc_profiles", profiles);
  },

  getAnalyticsSummary: async (): Promise<{
    views: number;
    downloads: number;
    clicks: number;
    devices: { mobile: number; desktop: number; tablet: number };
    clicksBreakdown: Record<string, number>;
  }> => {
    initializeMockDb();
    const user = apiMock.getCurrentUser();
    if (!user) return { views: 0, downloads: 0, clicks: 0, devices: { mobile: 0, desktop: 0, tablet: 0 }, clicksBreakdown: {} };

    const profiles = getStorage<Record<string, Profile>>("tc_profiles") || {};
    const myProfile = Object.values(profiles).find((p) => p.email === user.email);
    if (!myProfile) return { views: 0, downloads: 0, clicks: 0, devices: { mobile: 0, desktop: 0, tablet: 0 }, clicksBreakdown: {} };

    const events = getStorage<AnalyticsEvent[]>("tc_analytics") || [];
    const myEvents = events.filter((e) => e.username === myProfile.username);

    const views = myEvents.filter((e) => e.eventType === "view").length;
    const downloads = myEvents.filter((e) => e.eventType === "resume_download").length;
    const clicks = myEvents.filter((e) => e.eventType === "link_click").length;

    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    const clicksBreakdown: Record<string, number> = {};

    myEvents.forEach((e) => {
      // Tally devices
      devices[e.deviceType]++;
      
      // Tally click types
      if (e.eventType === "link_click" && e.eventMetadata) {
        clicksBreakdown[e.eventMetadata] = (clicksBreakdown[e.eventMetadata] || 0) + 1;
      }
    });

    return {
      views: views || myProfile.viewsCount,
      downloads: downloads || myProfile.downloadsCount,
      clicks: clicks || myProfile.clicksCount,
      devices,
      clicksBreakdown,
    };
  }
};

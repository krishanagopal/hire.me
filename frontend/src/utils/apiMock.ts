"use client";

// TypeScript interfaces for hire.me SaaS data models
export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
  leetcode?: string;
  codeforces?: string;
  medium?: string;
  hashnode?: string;
  productHunt?: string;
}

export interface Skill {
  _id?: string;
  name: string;
  category: "Frontend" | "Backend" | "Database" | "Cloud" | "DevOps" | "Tools";
}

export interface Project {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  demoVideoUrl?: string;
  thumbnailUrl?: string;
  screenshots?: string[];
  isFeatured?: boolean;
}

export interface Experience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface Education {
  _id?: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Certification {
  id?: string;
  _id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface Profile {
  username: string;
  fullName: string;
  name?: string; // frontend compatibility
  role?: string;
  headline?: string;
  location?: string;
  phone?: string;
  email: string;
  bio?: string;
  availabilityStatus?: "Open To Work" | "Actively Interviewing" | "Freelancing" | "Not Looking";
  avatarUrl?: string;
  bannerUrl?: string;
  theme?: "modern" | "minimal" | "corporate" | "developer" | "dark";
  accentColor?: string;
  socialLinks?: SocialLinks;
  skills?: Skill[];
  projects?: Project[];
  experiences?: Experience[];
  educations?: Education[];
  certifications?: Certification[];
  resumeUrl?: string;
  resumeFileName?: string;
  tier?: "free" | "pro";
  viewsCount?: number;
  downloadsCount?: number;
  clicksCount?: number;
}

export interface User {
  id: string;
  email: string;
  name?: string; // frontend onboarding mapping
  username?: string;
  provider: string;
  avatar?: string;
  isVerified: boolean;
  onboardingCompleted: boolean;
}

// Helpers for API communication
export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const resolveMediaUrl = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("/api/")) {
    const apiBase = BACKEND_URL.replace("/api/v1", "");
    return `${apiBase}${url}`;
  }
  return url;
};

const getHeaders = async () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    try {
      const { supabase } = await import("../lib/supabase");
      const { data } = await supabase.auth.getSession();
      if (data?.session?.access_token) {
        headers["Authorization"] = `Bearer ${data.session.access_token}`;
        localStorage.setItem("tc_token", data.session.access_token);
      } else {
        const token = localStorage.getItem("tc_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (e) {
      const token = localStorage.getItem("tc_token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    throw new Error("Session expired. Please log in again.");
  }
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

// API CLIENT
export const apiMock = {
  // Authentication Actions
  syncUser: async (): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const { supabase } = await import("../lib/supabase");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session) throw new Error("No active session");

      const res = await fetch(`${BACKEND_URL}/auth/sync-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
      });
      const data = await handleResponse(res);
      
      if (data.user) {
        localStorage.setItem("tc_token", session.access_token);
        localStorage.setItem("tc_logged_user", JSON.stringify(data.user));
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  sendOtp: async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/otp/send`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ email }),
      });
      const data = await handleResponse(res);
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  verifyOtp: async (email: string, otp: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/otp/verify`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ email, otp }),
      });
      const data = await handleResponse(res);
      
      if (data.token && data.user) {
        localStorage.setItem("tc_token", data.token);
        localStorage.setItem("tc_logged_user", JSON.stringify(data.user));
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  loginGoogle: async (token: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/google`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ token }),
      });
      const data = await handleResponse(res);

      if (data.token && data.user) {
        localStorage.setItem("tc_token", data.token);
        localStorage.setItem("tc_logged_user", JSON.stringify(data.user));
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  loginGithub: async (code: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/github`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ code }),
      });
      const data = await handleResponse(res);

      if (data.token && data.user) {
        localStorage.setItem("tc_token", data.token);
        localStorage.setItem("tc_logged_user", JSON.stringify(data.user));
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("tc_logged_user");
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("tc_token");
    localStorage.removeItem("tc_logged_user");
  },

  // Profile / Username Actions
  checkUsernameAvailable: async (username: string): Promise<boolean> => {
    try {
      const res = await fetch(`${BACKEND_URL}/profiles/username/check?username=${encodeURIComponent(username)}`, {
        headers: await getHeaders(),
      });
      const data = await handleResponse(res);
      return data.available;
    } catch (err) {
      return false;
    }
  },

  claimUsername: async (username: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${BACKEND_URL}/profiles/username/claim`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ username }),
      });
      await handleResponse(res);
      
      // Update local storage user object
      const user = apiMock.getCurrentUser();
      if (user) {
        user.username = username;
        localStorage.setItem("tc_logged_user", JSON.stringify(user));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  getProfile: async (username: string): Promise<Profile | null> => {
    try {
      const res = await fetch(`${BACKEND_URL}/profiles/${encodeURIComponent(username)}`, {
        headers: await getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  getMyProfile: async (): Promise<Profile | null> => {
    try {
      const res = await fetch(`${BACKEND_URL}/profiles/me`, {
        headers: await getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  updateMyProfile: async (profileData: Partial<Profile>): Promise<{ success: boolean; profile?: Profile; error?: string }> => {
    try {
      const res = await fetch(`${BACKEND_URL}/profiles/me`, {
        method: "PUT",
        headers: await getHeaders(),
        body: JSON.stringify(profileData),
      });
      const data = await handleResponse(res);
      
      // Mark onboarding completed locally if profile is created successfully
      const user = apiMock.getCurrentUser();
      if (user && !user.onboardingCompleted) {
        user.onboardingCompleted = true;
        localStorage.setItem("tc_logged_user", JSON.stringify(user));
      }

      return { success: true, profile: data.profile };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Analytics Engine
  recordEvent: async (username: string, eventType: "profile_view" | "resume_download" | "github_click" | "linkedin_click" | "demo_video_play" | "contact_click", eventMetadata?: string): Promise<void> => {
    try {
      // DO NOT COUNT events if the current user is the profile owner
      const currentUser = await apiMock.getCurrentUser();
      if (currentUser && currentUser.username === username) {
        return;
      }

      await fetch(`${BACKEND_URL}/analytics/event`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ username, eventType, eventMetadata }),
      });
    } catch (err) {
      console.error("Failed to record event:", err);
    }
  },

  getAnalyticsSummary: async (): Promise<{
    views: number;
    downloads: number;
    clicks: number;
    devices: { mobile: number; desktop: number; tablet: number };
    clicksBreakdown: Record<string, number>;
  }> => {
    try {
      const res = await fetch(`${BACKEND_URL}/analytics/summary`, {
        headers: await getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return { views: 0, downloads: 0, clicks: 0, devices: { mobile: 0, desktop: 0, tablet: 0 }, clicksBreakdown: {} };
    }
  }
};

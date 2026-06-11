"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeLayouts, { triggerVCardDownload, triggerResumeDownload } from "../../components/ThemeLayouts";
import { apiMock, Profile } from "../../utils/apiMock";
import { Search, Compass, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function PublicProfile({ params }: PageProps) {
  const router = useRouter();
  const { username } = use(params);
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const loadProfile = async () => {
      try {
        const data = await apiMock.getProfile(username);
        if (data) {
          setProfile(data);
          
          // Record view event in analytics
          await apiMock.recordEvent(username, "view");
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  // Analytics Event Trackers
  const handleSocialClick = (platform: string) => {
    if (!profile) return;
    apiMock.recordEvent(profile.username, "link_click", platform);
  };

  const handleDownloadResume = () => {
    if (!profile) return;
    apiMock.recordEvent(profile.username, "resume_download");
    triggerResumeDownload(profile);
  };

  const handleSaveContact = () => {
    if (!profile) return;
    triggerVCardDownload(profile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030304] flex items-center justify-center text-neutral-400 select-none">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-sm font-semibold tracking-widest uppercase">Fetching Card...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#030304] text-white px-4 py-12 select-none relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-rose-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

        {/* Floating Header */}
        <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-5 bg-transparent">
          <Link href="/" className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-300 to-neutral-600 bg-clip-text text-transparent">
            hire.me
          </Link>
        </header>

        {/* Card Not Found */}
        <div className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/5 bg-neutral-950/45 backdrop-blur-xl shadow-2xl shadow-black/60 text-center flex flex-col items-center gap-6">
          <div className="p-4 rounded-full border border-rose-500/20 bg-rose-950/15 text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight">Profile Not Found</h2>
            <p className="text-sm text-neutral-400 leading-normal">
              The profile card link for <span className="font-mono text-white font-semibold">/{username}</span> is unclaimed or has been deactivated.
            </p>
          </div>
          <div className="w-full flex flex-col gap-3.5 mt-2">
            <Link 
              href={`/register?claim=${username}`}
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-gradient-to-r from-white via-neutral-300 to-neutral-600 text-neutral-950 font-bold text-sm shadow-xl shadow-neutral-500/10 hover:brightness-110 active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4 text-neutral-950" /> Claim hire.me/{username}
            </Link>
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-white/10 bg-white/5 text-neutral-300 font-semibold text-sm hover:bg-white/10 active:scale-98 transition-all"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render the selected theme layout
  return (
    <ThemeLayouts 
      profile={profile}
      onSocialClick={handleSocialClick}
      onDownloadResume={handleDownloadResume}
      onSaveContact={handleSaveContact}
    />
  );
}

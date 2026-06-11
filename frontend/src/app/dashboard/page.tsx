"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { apiMock, Profile } from "../../utils/apiMock";
import { triggerVCardDownload } from "../../components/ThemeLayouts";
import { 
  User, Eye, Download, MousePointer, Smartphone, Monitor, Tablet, 
  Settings, Layout, Palette, Image as ImageIcon, QrCode, FileText, 
  ExternalLink, LogOut, RefreshCw, Check, Upload, AlertTriangle
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"analytics" | "customizer" | "share">("analytics");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
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
        // Redirect to onboarding if profile hasn't been created yet
        router.push("/onboarding");
        return;
      }
      setProfile(myProfile);

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

  // Profile update handler
  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await apiMock.updateMyProfile(updates);
      if (res.success && res.profile) {
        setProfile(res.profile);
        setSuccessMsg("Changes saved successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(res.error || "Failed to update profile.");
      }
    } catch (err) {
      setErrorMsg("An error occurred while saving.");
    }
  };

  // File Upload Handlers (converts images to Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (type === "avatar") {
        handleUpdateProfile({ avatarUrl: base64 });
      } else {
        handleUpdateProfile({ bannerUrl: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  // Color Swatches
  const accentColors = [
    { name: "Blue", hex: "#3b82f6" },
    { name: "Amber", hex: "#f59e0b" },
    { name: "Emerald", hex: "#10b981" },
    { name: "Indigo", hex: "#6366f1" },
    { name: "Rose", hex: "#f43f5e" },
    { name: "Orange", hex: "#f97316" },
    { name: "Violet", hex: "#8b5cf6" },
  ];

  const themes = [
    { id: "modern", name: "Modern Glow", desc: "Clean shadows, glowing borders, card stacks." },
    { id: "minimal", name: "Classic Minimalist", desc: "Heavy spacing, fine borders, absolute text focus." },
    { id: "corporate", name: "Executive Corporate", desc: "Traditional headers, structured rows, flat designs." },
    { id: "developer", name: "Terminal Code", desc: "Monospace accents, console boards, branch lines." },
    { id: "dark", name: "Cyberpunk Dark", desc: "Deep navy glassmorphism with high neon highlights." }
  ];

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#030304] flex items-center justify-center text-neutral-400 select-none">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-sm font-semibold tracking-widest uppercase">Loading Panel...</span>
        </div>
      </div>
    );
  }

  // Calculate device distribution percentages
  const totalDevices = stats.devices.mobile + stats.devices.desktop + stats.devices.tablet || 1;
  const devicePercentages = {
    mobile: Math.round((stats.devices.mobile / totalDevices) * 100),
    desktop: Math.round((stats.devices.desktop / totalDevices) * 100),
    tablet: Math.round((stats.devices.tablet / totalDevices) * 100)
  };

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/${profile.username}` : `/${profile.username}`;

  return (
    <div className="min-h-screen bg-[#030304] text-white flex flex-col select-none">
      
      {/* Dashboard Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-12 py-4 bg-neutral-950/45 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-neutral-300 to-neutral-600 bg-clip-text text-transparent">
            hire.me
          </span>
          <span className="text-[9px] uppercase font-bold tracking-widest bg-white/10 px-2 py-0.5 rounded text-neutral-300">
            Console
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            Preview Profile <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-rose-400 transition-colors"
          >
            Logout <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Console Layout */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-2.5">
          <div className="p-4 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/15 overflow-hidden shrink-0 bg-neutral-900 flex items-center justify-center">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-neutral-500" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold truncate">{profile.name}</span>
              <span className="text-[10px] text-neutral-400 truncate">hire.me/{profile.username}</span>
            </div>
          </div>

          <nav className="flex flex-row md:flex-col gap-2 p-1.5 rounded-2xl border border-white/5 bg-neutral-950/10 backdrop-blur-md w-full">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "analytics" ? "bg-white text-neutral-950" : "text-neutral-400 hover:text-white"}`}
            >
              <Eye className="w-4 h-4" /> Analytics
            </button>
            <button
              onClick={() => setActiveTab("customizer")}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "customizer" ? "bg-white text-neutral-950" : "text-neutral-400 hover:text-white"}`}
            >
              <Settings className="w-4 h-4" /> Customize
            </button>
            <button
              onClick={() => setActiveTab("share")}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "share" ? "bg-white text-neutral-950" : "text-neutral-400 hover:text-white"}`}
            >
              <QrCode className="w-4 h-4" /> Share Card
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
            <div className="flex items-center gap-3 p-3.5 text-xs rounded-xl border border-rose-500/20 bg-rose-950/15 text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="flex flex-col gap-6">
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/30 backdrop-blur-md flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                    <span>Card Views</span>
                    <Eye className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-3xl font-black">{stats.views}</span>
                </div>
                <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/30 backdrop-blur-md flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                    <span>Downloads</span>
                    <Download className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-3xl font-black">{stats.downloads}</span>
                </div>
                <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/30 backdrop-blur-md flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                    <span>Link Clicks</span>
                    <MousePointer className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-3xl font-black">{stats.clicks}</span>
                </div>
              </div>

              {/* Graphic Visualizations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Device Distribution Dial */}
                <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col gap-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">Device Analytics</h3>
                  <div className="flex flex-col gap-3.5">
                    {/* Desktop */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-neutral-300"><Monitor className="w-3.5 h-3.5" /> Desktop</span>
                        <span>{devicePercentages.desktop}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: `${devicePercentages.desktop}%` }} />
                      </div>
                    </div>
                    {/* Mobile */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-neutral-300"><Smartphone className="w-3.5 h-3.5" /> Mobile</span>
                        <span>{devicePercentages.mobile}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400" style={{ width: `${devicePercentages.mobile}%` }} />
                      </div>
                    </div>
                    {/* Tablet */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-neutral-300"><Tablet className="w-3.5 h-3.5" /> Tablet</span>
                        <span>{devicePercentages.tablet}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${devicePercentages.tablet}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Click breakdown */}
                <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col gap-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">Ref Click Tallies</h3>
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

          {/* TAB 2: CUSTOMIZER */}
          {activeTab === "customizer" && (
            <div className="flex flex-col gap-6">
              
              {/* Theme Selector */}
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 flex items-center gap-2"><Layout className="w-4 h-4" /> Layout Themes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleUpdateProfile({ theme: t.id as Profile["theme"] })}
                      className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition-all ${profile.theme === t.id ? "border-amber-400 bg-white/5" : "border-white/5 bg-neutral-900/10 hover:border-white/15"}`}
                    >
                      <span className="text-xs font-bold">{t.name}</span>
                      <span className="text-[10px] text-neutral-400 leading-normal">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Picker */}
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col gap-4">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 flex items-center gap-2"><Palette className="w-4 h-4" /> Brand Accent Colors</h3>
                <div className="flex items-center gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleUpdateProfile({ accentColor: color.hex })}
                      className="relative w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {profile.accentColor === color.hex && (
                        <Check className="w-4 h-4 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Banner and Avatar uploader */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Avatar Image Card */}
                <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col gap-3">
                  <h4 className="text-[11px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5"><User className="w-4 h-4" /> Avatar Photo</h4>
                  <div className="flex items-center gap-4 p-2.5 rounded-xl border border-white/5 bg-neutral-950/20">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0 bg-neutral-900">
                      {profile.avatarUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <label className="flex items-center gap-1.5 text-xs font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" /> Upload File
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "avatar")} />
                    </label>
                  </div>
                </div>

                {/* Banner Image Card */}
                <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col gap-3">
                  <h4 className="text-[11px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1.5"><ImageIcon className="w-4 h-4" /> Cover Banner</h4>
                  <div className="flex items-center gap-4 p-2.5 rounded-xl border border-white/5 bg-neutral-950/20">
                    <div className="w-16 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-neutral-900">
                      {profile.bannerUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profile.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <label className="flex items-center gap-1.5 text-xs font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" /> Upload File
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "banner")} />
                    </label>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: SHARE & QR CODES */}
          {activeTab === "share" && (
            <div className="flex flex-col gap-6">
              
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-950/20 backdrop-blur-md flex flex-col items-center gap-6 text-center">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold tracking-tight">Your Digital hire.me Card</h3>
                  <p className="text-xs text-neutral-400 max-w-sm">
                    Recruiters can scan this code to load your resume, links, and portfolio layout on their devices instantly.
                  </p>
                </div>

                {/* QR Code Container */}
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

                {/* Profile Links & Test downloads */}
                <div className="w-full max-w-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-neutral-900/40 text-xs text-left">
                    <div className="flex flex-col">
                      <span className="font-bold">Permanent Link</span>
                      <span className="font-mono text-neutral-400 mt-0.5">{shareUrl}</span>
                    </div>
                    <a
                      href={shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      triggerVCardDownload(profile);
                    }}
                    className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 active:scale-95 transition-all"
                  >
                    Test vCard Download (.vcf)
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

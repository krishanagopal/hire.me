"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiMock } from "../../utils/apiMock";
import { Mail, Lock, ArrowRight, AlertTriangle } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await apiMock.login(email, password);
      if (res.success) {
        // If profile exists, go to dashboard. Otherwise, go to onboarding.
        const profile = await apiMock.getMyProfile();
        if (profile) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      } else {
        setError(res.error || "Invalid credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030304] text-white px-4 py-12 overflow-hidden select-none">
      {/* Background ambient light overlays */}
      <div className="absolute top-[20%] left-[15%] w-80 h-80 rounded-full bg-neutral-500/5 blur-[80px]" />
      <div className="absolute bottom-[20%] right-[15%] w-96 h-96 rounded-full bg-neutral-600/5 blur-[100px]" />

      {/* Floating Header */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-5 bg-transparent">
        <Link href="/" className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-300 to-neutral-600 bg-clip-text text-transparent">
          hire.me
        </Link>
        <Link href="/register" className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors">
          Register
        </Link>
      </header>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/5 bg-neutral-950/45 backdrop-blur-xl shadow-2xl shadow-black/60">
        <div className="flex flex-col gap-2 mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight">Welcome back</h2>
          <p className="text-xs text-neutral-400">
            Sign in to manage your professional identity card.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-3.5 mb-6 text-xs rounded-xl border border-rose-500/20 bg-rose-950/15 text-rose-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                placeholder="krishna@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-neutral-400/50 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-neutral-400/50 transition-colors"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 mt-2 w-full h-12 rounded-xl bg-gradient-to-r from-white via-neutral-300 to-neutral-600 text-neutral-950 font-bold text-sm shadow-xl shadow-neutral-500/10 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
            <ArrowRight className="w-4 h-4 text-neutral-950" />
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-neutral-400">
          New to hire.me?{" "}
          <Link href="/register" className="font-semibold text-white hover:underline">
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
}

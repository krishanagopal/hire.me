"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiMock } from "../../../../utils/apiMock";
import { RefreshCw, AlertTriangle } from "lucide-react";

function GithubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("Authorization code is missing from GitHub redirect.");
      setTimeout(() => {
        router.push("/auth?error=GitHub authorization failed");
      }, 3000);
      return;
    }

    const authenticate = async () => {
      try {
        const res = await apiMock.loginGithub(code);
        if (res.success && res.user) {
          if (res.user.onboardingCompleted) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding");
          }
        } else {
          setError(res.error || "GitHub authentication failed on the server.");
          setTimeout(() => {
            router.push(`/auth?error=${encodeURIComponent(res.error || "GitHub failed")}`);
          }, 3000);
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        setTimeout(() => {
          router.push("/auth?error=An unexpected error occurred");
        }, 3000);
      }
    };

    authenticate();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#030304] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-6 rounded-2xl border border-rose-500/20 bg-rose-950/15 text-center flex flex-col items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-rose-450" />
          <h2 className="text-lg font-bold text-rose-300">Authentication Error</h2>
          <p className="text-xs text-rose-400 leading-normal">{error}</p>
          <span className="text-[10px] text-neutral-500 mt-2">Redirecting you to the authentication page...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030304] text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
        <span className="text-sm font-semibold tracking-widest uppercase">Completing Sign In...</span>
      </div>
    </div>
  );
}

export default function GithubCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030304] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-sm font-semibold tracking-widest uppercase font-mono">Loading Callback...</span>
        </div>
      </div>
    }>
      <GithubCallbackContent />
    </Suspense>
  );
}

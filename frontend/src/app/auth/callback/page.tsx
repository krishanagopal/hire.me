"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { apiMock } from "../../../utils/apiMock";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const handleCallback = async () => {
      try {
        // Check if there is an error in the URL parameters (e.g. Supabase failed to exchange the code)
        const params = new URLSearchParams(window.location.search);
        const urlError = params.get("error");
        const urlErrorDesc = params.get("error_description");
        
        if (urlError || urlErrorDesc) {
          throw new Error(urlErrorDesc ? decodeURIComponent(urlErrorDesc).replace(/\+/g, ' ') : urlError);
        }

        // Wait for Supabase to process the URL hash and store the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          // If no session immediately, listen for the auth state change
          // Supabase JS client automatically parses the hash and fires SIGNED_IN
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (event === 'SIGNED_IN' && currentSession) {
              await processUser();
              subscription.unsubscribe();
            }
          });
          
          // Timeout after 10 seconds if nothing happens
          setTimeout(() => {
            if (mounted && !error) {
              setError("Authentication timeout. Please try again.");
              subscription.unsubscribe();
            }
          }, 10000);
          
          return;
        }

        await processUser();
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to authenticate.");
      }
    };

    const processUser = async () => {
      try {
        const res = await apiMock.syncUser();
        if (!res.success) {
          throw new Error(res.error || "Failed to sync user with backend.");
        }
        
        const user = await apiMock.getCurrentUser();
        if (mounted) {
          if (user && user.onboardingCompleted) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding");
          }
        }
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to process user data.");
      }
    };

    handleCallback();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#efeff1] flex flex-col items-center justify-center p-4 font-sans">
      {error ? (
        <div className="p-6 bg-white shadow-xl rounded-2xl border border-rose-100 max-w-sm w-full text-center">
          <p className="font-bold text-rose-600 text-lg mb-2">Authentication Error</p>
          <p className="text-sm text-neutral-600 mb-6">{error}</p>
          <button 
            onClick={() => router.push("/login")}
            className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-[#dc2626]/20 border-t-[#dc2626] rounded-full animate-spin"></div>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs animate-pulse">Completing authentication...</p>
        </div>
      )}
    </div>
  );
}

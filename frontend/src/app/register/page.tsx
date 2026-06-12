"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#030304] flex items-center justify-center text-neutral-500">
      <div className="text-sm font-semibold tracking-widest uppercase">Redirecting...</div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasToken = typeof window !== "undefined" && Boolean(window.localStorage.getItem("accessToken"));

  useEffect(() => {
    if (!hasToken) {
      router.replace("/login");
    }
  }, [hasToken, router]);

  if (!hasToken) return null;
  return <>{children}</>;
}

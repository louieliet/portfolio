"use client";

import { useLenis } from "@/lib/hooks/use-lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useLenis();
  return <>{children}</>;
}

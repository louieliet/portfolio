"use client";

import { useGSAPAnimations } from "@/lib/hooks/use-gsap-animations";

export function AnimationsProvider({ children }: { children: React.ReactNode }) {
  useGSAPAnimations();
  return <>{children}</>;
}

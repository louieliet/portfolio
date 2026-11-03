import { useLenis } from "@/lib/hooks/use-lenis";
import { useGSAPAnimations } from "@/lib/hooks/use-gsap-animations";

// Global runtime: Lenis smooth scroll + the utility GSAP animations.
// The film grain lives in CSS (`body::after` in globals.css); the canvas
// overlay that used to be injected here duplicated it at the same z-index.
export function AppInit() {
  useLenis();
  useGSAPAnimations();
  return null;
}

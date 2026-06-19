import { useEffect } from "react";
import { useLenis } from "@/lib/hooks/use-lenis";
import { useGSAPAnimations } from "@/lib/hooks/use-gsap-animations";

export function AppInit() {
  useLenis();
  useGSAPAnimations();

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 200;
    canvas.width = size;
    canvas.height = size;

    const imageData = ctx.createImageData(size, size);
    const buffer = new Uint32Array(imageData.data.buffer);

    for (let i = 0; i < buffer.length; i++) {
      const gray = Math.floor(Math.random() * 256);
      buffer[i] = (25 << 24) | (gray << 16) | (gray << 8) | gray;
    }

    ctx.putImageData(imageData, 0, 0);
    const dataURL = canvas.toDataURL("image/png");

    const style = document.createElement("style");
    style.textContent = `
      body::after {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.6;
        z-index: 9999;
        pointer-events: none;
        background-image: url(${dataURL});
        background-repeat: repeat;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}

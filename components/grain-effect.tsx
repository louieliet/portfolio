"use client";

import { useEffect } from "react";

export function GrainEffect() {
  useEffect(() => {
    // Create canvas element for grain texture
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    // Set canvas size
    const width = 200;
    const height = 200;
    canvas.width = width;
    canvas.height = height;
    
    // Generate noise pattern
    const imageData = ctx.createImageData(width, height);
    const buffer = new Uint32Array(imageData.data.buffer);
    
    for (let i = 0; i < buffer.length; i++) {
      // Random grayscale value
      const gray = Math.floor(Math.random() * 256);
      // RGBA format: alpha is low for subtle effect
      buffer[i] = (25 << 24) | (gray << 16) | (gray << 8) | gray;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Convert canvas to data URL
    const dataURL = canvas.toDataURL("image/png");
    
    // Create style element
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
    
    // Cleanup function
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}

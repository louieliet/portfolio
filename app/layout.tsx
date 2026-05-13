import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { AnimationsProvider } from "@/components/animations-provider";
import { GrainEffect } from "@/components/grain-effect";
import ScrollRestoration from "@/components/scroll-restoration";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Emiliano Montes | Frontend and Mobile Engineer",
  description: "Portfolio of Emiliano Montes, a Frontend and Mobile Engineer building scalable web and mobile products with strong UX foundations.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="lenis lenis-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GrainEffect />
        <SmoothScrollProvider>
          <AnimationsProvider>
            <ScrollRestoration />
            {children}
          </AnimationsProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

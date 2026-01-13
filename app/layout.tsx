import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { AnimationsProvider } from "@/components/animations-provider";

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Emiliano Montes | Frontend Engineer & UX/UI Designer",
  description: "Portfolio of Emiliano Montes, a Frontend Engineer and Product Designer specializing in building end-to-end digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="lenis lenis-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SmoothScrollProvider>
          <AnimationsProvider>
            {children}
          </AnimationsProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

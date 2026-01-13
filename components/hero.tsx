import Link from "next/link";
import { personalInfo } from "@/lib/data";

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto border-b border-black py-24 relative overflow-hidden">
      {/* Background Parallax Element (very subtle) */}
      <div 
        className="parallax-layer absolute top-20 right-0 w-[500px] h-[500px] bg-gray-50 rounded-full blur-3xl -z-10 opacity-60"
        data-speed="0.2"
      />

      <div className="space-y-12 relative z-10">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] uppercase mix-blend-difference">
          <div className="overflow-hidden">
            <span className="hero-text-reveal block parallax-layer" data-speed="0.5">
              {personalInfo.name.split(" ")[0]}
            </span>
          </div>
          <div className="overflow-hidden">
             <span className="hero-text-reveal block parallax-layer" data-speed="0.8">
              {personalInfo.name.split(" ")[1]}
            </span>
          </div>
        </h1>
        
        <div className="max-w-3xl space-y-8 ml-auto md:w-2/3">
          <div className="overflow-hidden">
            <h2 className="hero-text-reveal text-2xl md:text-4xl font-medium parallax-layer" data-speed="1.0">
              {personalInfo.role}
            </h2>
          </div>
          <div className="overflow-hidden">
            <p className="hero-text-reveal text-xl md:text-2xl text-gray-600 leading-relaxed parallax-layer italic" data-speed="1.2">
              {personalInfo.tagline}
            </p>
          </div>
        </div>

        <div className="pt-12 hero-text-reveal parallax-layer" data-speed="1.5">
          <Link href="#experience" className="group inline-flex items-center gap-2 text-lg font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">
            <span className="border-b-2 border-black group-hover:border-gray-500 pb-1 transition-all">View Experience</span>
            <span className="group-hover:translate-y-1 transition-transform">↓</span>
          </Link>
        </div>
        
        <div className="absolute bottom-12 left-6 md:left-12 text-sm uppercase tracking-widest text-gray-400 hero-text-reveal">
          {personalInfo.location}
        </div>
      </div>
    </section>
  );
}

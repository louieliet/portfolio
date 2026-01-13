import Link from "next/link";
import { personalInfo } from "@/lib/data";

export default function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto border-b border-black py-24">
      <div className="space-y-8">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] uppercase">
          {personalInfo.name.split(" ")[0]}
          <br />
          {personalInfo.name.split(" ").slice(1).join(" ")}
        </h1>
        
        <div className="max-w-2xl space-y-6">
          <h2 className="text-2xl md:text-3xl font-medium">
            {personalInfo.role}
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl">
            {personalInfo.tagline}
          </p>
        </div>

        <div className="pt-8">
          <Link href="#experience" className="brutalist-button">
            View Experience ↓
          </Link>
        </div>
        
        <div className="pt-12 text-sm uppercase tracking-widest text-gray-500">
          {personalInfo.location}
        </div>
      </div>
    </section>
  );
}

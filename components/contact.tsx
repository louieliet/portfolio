import Link from "next/link";
import { personalInfo } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="px-6 md:px-12 py-24 max-w-7xl mx-auto min-h-[60vh] flex flex-col justify-between">
      <div className="fade-in">
        <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold uppercase tracking-tighter mb-12">
          Let's Work Together
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mb-16 leading-relaxed">
          If you are looking for a frontend engineer who also understands product design, UX research, and technical architecture, let's talk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-end">
        <div className="space-y-8">
           <div>
             <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Email</div>
             <a href={`mailto:${personalInfo.email}`} className="text-2xl md:text-3xl font-medium transition-all duration-200 hover:underline decoration-2 underline-offset-4 hover:translate-x-1 inline-block">
               {personalInfo.email}
             </a>
           </div>
           
           <div className="flex gap-8">
             <div>
               <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">LinkedIn</div>
               <Link href={personalInfo.linkedin} target="_blank" className="text-xl font-medium transition-all duration-200 hover:underline decoration-2 underline-offset-4 hover:translate-x-1 inline-block">
                 /in/emiliano-mg
               </Link>
             </div>
             <div>
               <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">GitHub</div>
               <Link href={personalInfo.github} target="_blank" className="text-xl font-medium transition-all duration-200 hover:underline decoration-2 underline-offset-4 hover:translate-x-1 inline-block">
                 @Emiliano-MG
               </Link>
             </div>
           </div>
        </div>

        <div className="text-right space-y-2 text-sm text-gray-500 uppercase tracking-wider">
           <div>{personalInfo.location}</div>
           <div>GMT-6 (CST)</div>
           <div className="pt-8">
             Made by {personalInfo.name.split(" ")[0]}
             <br />
             2026
           </div>
        </div>
      </div>
    </section>
  );
}

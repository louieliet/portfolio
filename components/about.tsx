import Image from "next/image";
import { personalInfo, stack } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="px-6 md:px-12 py-24 max-w-7xl mx-auto border-b border-black">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

        {/* Left Column: Photo & Story */}
        <div className="lg:col-span-5 space-y-12 fade-in">
          <div className="aspect-[3/4] bg-gray-200 border border-black relative overflow-hidden grayscale">
            <Image
              src="/projects/me.jpeg"
              alt="Portrait of Emiliano Montes"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold uppercase tracking-tighter mb-6">About Me</h2>
            <div className="space-y-4 text-lg leading-relaxed text-gray-800">
              {personalInfo.about.history.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Stack, Education */}
        <div className="lg:col-span-7 space-y-16 fade-in">

          <div>
            <h3 className="text-2xl font-bold uppercase mb-8 border-b border-black pb-4">Stack</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold uppercase mb-4 text-sm tracking-wider text-gray-500">Design & UX</h4>
                <ul className="space-y-2">
                  {stack.design.map(tech => <li key={tech} className="border-b border-gray-100 pb-1">{tech}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold uppercase mb-4 text-sm tracking-wider text-gray-500">Frontend</h4>
                <ul className="space-y-2">
                  {stack.frontend.map(tech => <li key={tech} className="border-b border-gray-100 pb-1">{tech}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold uppercase mb-4 text-sm tracking-wider text-gray-500">Mobile</h4>
                <ul className="space-y-2">
                  {stack.mobile.map(tech => <li key={tech} className="border-b border-gray-100 pb-1">{tech}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold uppercase mb-4 text-sm tracking-wider text-gray-500">Gaming</h4>
                <ul className="space-y-2">
                  {stack.gaming.map(tech => <li key={tech} className="border-b border-gray-100 pb-1">{tech}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold uppercase mb-4 text-sm tracking-wider text-gray-500">Backend & Tools</h4>
                <ul className="space-y-2">
                  {stack.backend.map(tech => <li key={tech} className="border-b border-gray-100 pb-1">{tech}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold uppercase mb-8 border-b border-black pb-4">Education</h3>
            <div className="space-y-6">
              {personalInfo.about.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">{edu.degree}</h4>
                    <div className="text-gray-600">{edu.institution}</div>
                  </div>
                  <div className="text-sm font-medium border border-gray-200 px-2 py-1">{edu.year}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

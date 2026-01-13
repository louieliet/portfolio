"use client";

import { useState } from "react";
import { projects } from "@/lib/data";
import Link from "next/link";

const categories = ["All", "Web", "Mobile", "Gaming"];

export default function Projects() {
  const [filter, setFilter] = useState("All");

  const filteredProjects = projects.filter(
    (p) => filter === "All" || p.category === filter
  );

  return (
    <section id="projects" className="px-6 md:px-12 py-24 max-w-7xl mx-auto border-b border-black">
      <div className="mb-16 fade-in">
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8">Projects</h2>
        
        <div className="flex flex-wrap gap-4 md:gap-8 border-b border-gray-200 pb-4 animate-line origin-left">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-lg uppercase tracking-wider transition-colors ${
                filter === cat ? "font-bold text-black" : "text-gray-400 hover:text-black"
              }`}
            >
              {cat} <span className="text-xs align-top opacity-50 ml-1">
                {cat === "All" 
                  ? projects.length 
                  : projects.filter(p => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {filteredProjects.map((project) => (
          <div key={project.id} className="stagger-item group flex flex-col h-full">
            <div className="aspect-video bg-gray-100 border border-black mb-6 relative overflow-hidden transition-all duration-300 group-hover:border-2">
               {/* Placeholder for image */}
               <div className="absolute inset-0 flex items-center justify-center text-gray-400 uppercase tracking-widest text-sm transition-all duration-300 group-hover:scale-105">
                 {project.name} Preview
               </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                   <h3 className="text-2xl font-bold uppercase">{project.name}</h3>
                   <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">{project.subtitle}</div>
                </div>
                <div className="text-sm font-medium border border-black px-2 py-1 uppercase">
                  {project.year}
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6 flex-1">
                {project.description}
              </p>

              <div className="mt-auto">
                 <div className="flex flex-wrap gap-2 mb-6">
                    {project.stack.map(tech => (
                      <span key={tech} className="text-xs text-gray-500 border border-gray-200 px-2 py-1">
                        {tech}
                      </span>
                    ))}
                 </div>
                 
                 {project.link && (
                   <Link href={project.link} className="inline-block text-sm font-bold uppercase tracking-wider border-b border-black pb-1 hover:text-gray-600 transition-colors">
                     View Project →
                   </Link>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

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
    <section id="projects" className="px-6 md:px-12 py-32 max-w-7xl mx-auto border-b border-black">
      <div className="mb-24 fade-in">
        <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-12">Projects</h2>
        
        <div className="flex flex-wrap gap-x-8 gap-y-4 border-b border-gray-200 pb-6 animate-line origin-left">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-lg md:text-xl uppercase tracking-widest transition-all duration-300 ${
                filter === cat ? "font-bold text-black translate-x-2" : "text-gray-400 hover:text-black hover:translate-x-1"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 stagger-container">
        {filteredProjects.map((project) => (
          <div key={project.id} className="stagger-item group flex flex-col h-full cursor-pointer">
            <div className="aspect-[4/3] bg-gray-100 mb-8 relative overflow-hidden">
               {/* Image Placeholder with subtle hover scale */}
               <div className="absolute inset-0 bg-gray-200 transition-transform duration-700 ease-out group-hover:scale-105" />
               
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-gray-400 uppercase tracking-widest text-sm font-medium border border-gray-400 px-4 py-2">
                   {project.name}
                 </span>
               </div>

               {/* Overlay on hover */}
               <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-baseline mb-4 border-b border-gray-100 pb-4 group-hover:border-black transition-colors duration-500">
                 <h3 className="text-3xl font-bold uppercase tracking-tight">{project.name}</h3>
                 <span className="text-sm font-mono">{project.year}</span>
              </div>
              
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-4">{project.subtitle}</div>

              <p className="text-gray-600 leading-relaxed mb-8 flex-1 text-lg">
                {project.description}
              </p>

              <div className="mt-auto">
                 <div className="flex flex-wrap gap-2 mb-8">
                    {project.stack.map(tech => (
                      <span key={tech} className="text-xs font-medium text-gray-500 border border-gray-200 px-2 py-1 uppercase tracking-wider">
                        {tech}
                      </span>
                    ))}
                 </div>
                 
                 {project.link && (
                   <Link href={project.link} className="inline-flex items-center text-sm font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
                     View Project <span className="ml-2">↗</span>
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

"use client";

import { useState } from "react";
import { projects } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { getLenisInstance } from "@/lib/lenis-store";
import {
  saveHomeReturnScrollPosition,
  saveScrollPosition,
} from "@/lib/scroll-position-store";

const categories = ["All", "Web", "Mobile", "Gaming"];

export default function Projects() {
  const [filter, setFilter] = useState("All");

  const filteredProjects = projects.filter(
    (p) => filter === "All" || p.category === filter
  );

  const saveHomeScrollPosition = () => {
    const lenis = getLenisInstance();
    const position = Math.max(lenis?.scroll ?? 0, window.scrollY);

    saveScrollPosition("/", position);
    saveHomeReturnScrollPosition(position);
  };

  return (
    <section id="projects" className="px-6 md:px-12 py-32 max-w-7xl mx-auto border-b border-black">
      <div className="mb-28 fade-in">
        <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-8">Projects</h2>
        <p className="text-lg md:text-2xl text-gray-600 max-w-2xl leading-relaxed mb-8 md:mb-10">
          Click on any project to see more.
        </p>

        <div className="flex flex-wrap gap-x-8 gap-y-4 border-b border-gray-200 pb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-lg md:text-xl uppercase tracking-widest transition-colors duration-300 ${filter === cat ? "font-bold text-black" : "text-gray-400 hover:text-black"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 mt-16 stagger-container">
        {filteredProjects.map((project) => (
          <Link
            id={`project-${project.id}`}
            key={project.id}
            href={`/projects/${project.id}`}
            scroll={false}
            onClick={saveHomeScrollPosition}
            onPointerDown={saveHomeScrollPosition}
            className="stagger-item group flex flex-col h-full cursor-pointer"
          >
            <div className="aspect-[4/3] bg-gray-100 mb-8 relative overflow-hidden border border-transparent group-hover:border-black transition-colors duration-500">
              {project.images?.[0] ? (
                <Image
                  src={project.images[0]}
                  alt={`${project.name} cover image`}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gray-200 transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400 uppercase tracking-widest text-sm font-medium border border-gray-400 px-4 py-2">
                      {project.name}
                    </span>
                  </div>
                </>
              )}

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
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-medium text-gray-500 border border-gray-200 px-2 py-1 uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-geist-mono)' }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

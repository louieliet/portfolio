'use client'
import Image from 'next/image'

import webIcon from '@/app/assets/tecsweb.svg'
import reactIcon from '@/app/assets/reacticon.svg'
import swiftIcon from '@/app/assets/swifticon.svg'
import jsIcon from '@/app/assets/jsicon.svg'
import fbIcon from '@/app/assets/firebaseicon.svg'

const WhatIdo = () => {
  const webProjects = [
    {
      name: 'Hus Website',
      description: 'Created at Chain Solutions using NextJS and Tailwind. I led the design and frontend implementation.',
      url: 'https://hus-demo.vercel.app/',
      tech1: webIcon,
      tech2: reactIcon
    },
    {
      name: 'Ragabe Website',
      description: 'A business page created for Ragabe with responsive design. Worked on layout, components, and polish.',
      url: 'https://dev.ragabe.git.chainsol.io/',
      tech1: webIcon,
      tech2: reactIcon
    }
  ]

  // Mobile projects data
  const mobileProjects = [
    {
      name: 'Fashion Finder',
      description: 'A SwiftUI app with CoreML and Firebase. Gives fashion suggestions based on mood, weather and closet.',
      video: '/videos/FFVideo.webm',
      tech1: swiftIcon,
      tech2: fbIcon
    },
    {
      name: 'Habitus',
      description: 'Built in React Native and Firebase. Tracks daily habits, progress, and includes reminders.',
      video: '/videos/HabitusVideo.webm',
      tech1: jsIcon,
      tech2: reactIcon
    }
  ]

  return (
    <section 
      id="whatido" 
      className="whatido-bg w-full min-h-screen relative overflow-x-hidden pt-36 pb-60 px-6 md:px-20 lg:px-28"
      style={{ 
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        marginBottom: '-80px',
      }}
    >
      <div className="absolute top-0 left-0 w-full flex justify-between items-center z-30">
        <div className="text-white/40 text-xs tracking-widest uppercase pl-6 md:pl-12 pt-4 pb-2">
          Section 01
        </div>
        <div className="text-white/40 text-xs tracking-widest uppercase pr-6 md:pr-12 pt-4 pb-2">
          Work & Process
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="mb-32">
          <div className="text-white/60 text-sm uppercase tracking-widest mb-3 font-light ml-1">
            What I do
          </div>
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-semibold text-white leading-[1.05] tracking-tight">
            My <br />
            <span className="text-gray-300 font-light md:-ml-10">work</span>
          </h2>
          <p className="mt-8 text-white/80 text-base md:text-lg max-w-md leading-relaxed font-light md:ml-16">
            Web and mobile development, and Unity experiences, focused on visual design and clear functionality, with an editorial and minimalist aesthetic.
          </p>
        </div>

        {/* Web Projects - Magazine Style Grid */}
        <div className="mb-24">
          <h3 className="text-white/80 text-xl font-light mb-10 border-b border-white/10 pb-2">Web Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {webProjects.map((project, index) => (
              <div 
                key={`web-${index}`} 
                className="group relative border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-500"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-black/50">
                  <iframe 
                    src={project.url} 
                    title={project.name} 
                    className="w-full h-full opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                    loading="lazy"
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center space-x-3 mb-2">
                    <Image src={project.tech1} alt="Tech" width={24} height={24} className="opacity-50" />
                    <Image src={project.tech2} alt="Tech 2" width={20} height={20} className="opacity-50" />
                  </div>
                  <h4 className="text-xl font-light text-white mb-1">{project.name}</h4>
                  <p className="text-white/70 text-sm leading-relaxed max-w-md">{project.description}</p>
                </div>
                
                <div className="absolute top-4 right-4">
                  <div className="text-white/30 text-xs uppercase tracking-wider px-3 py-1 border border-white/20 rounded-full">
                    0{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Projects - Magazine Style Layout */}
        <div className="mb-24">
          <h3 className="text-white/80 text-xl font-light mb-10 border-b border-white/10 pb-2">Mobile Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {mobileProjects.map((project, index) => (
              <div 
                key={`mobile-${index}`} 
                className="group relative bg-black/20 overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500"
              >
                <div className="relative">
                  {/* Editorial style project number */}
                  <div className="absolute -left-4 top-6 z-10 transform -rotate-90">
                    <div className="text-white/30 text-xs uppercase tracking-widest px-3 py-1">
                      0{index + 1}
                    </div>
                  </div>
                  
                  {/* Phone mockup with video */}
                  <div className="flex justify-center pt-16 pb-10 px-8">
                    <div className="relative w-full max-w-[180px] border-8 border-white/5 rounded-3xl overflow-hidden bg-black/70 shadow-lg">
                      <video
                        className="w-full aspect-[9/16] object-cover"
                        src={project.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-white/10 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Project details in magazine-style layout */}
                <div className="p-6 border-t border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <Image src={project.tech1} alt="Tech" width={24} height={24} className="opacity-50" />
                    <Image src={project.tech2} alt="Tech 2" width={20} height={20} className="opacity-50" />
                    <div className="text-white/30 text-xs uppercase tracking-wider ml-auto">Mobile App</div>
                  </div>
                  
                  <h4 className="text-xl font-light text-white mb-3">{project.name}</h4>
                  <p className="text-white/70 text-sm leading-relaxed">{project.description}</p>
                </div>
                
                {/* Magazine-style decorative element */}
                <div className="absolute top-8 right-6">
                  <div className="w-12 h-[1px] bg-white/20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-30 left-10 text-white/30 text-xs uppercase tracking-widest">
        Section 01 / Skills
      </div>
      <div className="absolute bottom-30 right-28 h-[1px] w-24 bg-white/30"></div>
    </section>
  )
}

export default WhatIdo
import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="px-6 md:px-12 py-32 max-w-7xl mx-auto border-b border-black relative">
      <div className="mb-24 fade-in">
        <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-6">Experience</h2>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
          My professional journey in frontend development, product design, and team leadership.
        </p>
      </div>

      <div className="relative stagger-container">
        {/* Vertical Timeline Line */}
        <div className="absolute left-0 md:left-4 top-4 bottom-0 w-[2px] bg-gray-200 h-full hidden md:block">
          <div className="timeline-line w-full bg-black h-0 origin-top"></div>
        </div>

        <div className="space-y-20">
          {experience.map((job, index) => (
            <div 
              key={index} 
              className="stagger-item grid grid-cols-1 md:grid-cols-12 gap-8 relative group"
            >
              {/* Timeline Dot */}
              <div className="hidden md:block absolute left-4 -translate-x-1/2 top-2 w-3 h-3 bg-white border-2 border-black rounded-full z-10 group-hover:bg-black transition-colors duration-300"></div>

              <div className="md:col-span-1 hidden md:block"></div> {/* Spacer for line */}
              
              <div className="md:col-span-4 md:pr-12">
                <h3 className="text-3xl font-bold uppercase mb-2 leading-none">{job.company}</h3>
                <div className="text-gray-500 font-medium tracking-wide text-sm mt-2">{job.period}</div>
              </div>
              
              <div className="md:col-span-7 space-y-6 pt-1 md:pt-0">
                <h4 className="text-2xl font-medium">{job.role}</h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {job.description}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  {job.stack.map((tech) => (
                    <span key={tech} className="text-xs font-mono uppercase tracking-wider border border-gray-200 px-3 py-1 bg-gray-50">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

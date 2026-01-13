import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="px-6 md:px-12 py-24 max-w-7xl mx-auto border-b border-black">
      <div className="mb-16">
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">Experience</h2>
        <p className="text-xl text-gray-600 max-w-2xl">
          My professional journey in frontend development, product design, and team leadership.
        </p>
      </div>

      <div className="space-y-0">
        {experience.map((job, index) => (
          <div 
            key={index} 
            className="group relative border-t border-black py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 hover:bg-gray-50 transition-colors"
          >
            <div className="md:col-span-4">
              <h3 className="text-2xl font-bold uppercase mb-2">{job.company}</h3>
              <div className="text-gray-500 font-medium">{job.period}</div>
            </div>
            
            <div className="md:col-span-8 space-y-4">
              <h4 className="text-xl font-medium">{job.role}</h4>
              <p className="text-gray-700 leading-relaxed text-lg">
                {job.description}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {job.stack.map((tech) => (
                  <span key={tech} className="text-xs uppercase tracking-wider border border-gray-300 px-3 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

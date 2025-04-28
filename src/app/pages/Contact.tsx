import Link from 'next/link'

const Contact = () => (
    <section id="contact" className="contact-bg py-20 px-6 md:px-20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Section header with decorative lines */}
        <div className="flex items-center space-x-4 mb-12">
          <div className="h-px flex-1 bg-custom-Brown opacity-50"></div>
          <h2 className="text-3xl md:text-5xl font-light uppercase text-custom-Brown">Contact</h2>
          <div className="h-px flex-1 bg-custom-Brown opacity-50"></div>
        </div>
        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact methods */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold uppercase text-custom-Brown mb-2">Email</h3>
              <a href="mailto:emilianomg2003@hotmail.com" className="text-lg text-custom-Brown hover:underline">emilianomg2003@hotmail.com</a>
            </div>
            <div>
              <h3 className="text-xl font-semibold uppercase text-custom-Brown mb-2">LinkedIn</h3>
              <Link href="https://www.linkedin.com/in/emiliano-mg/" target="_blank" rel="noopener noreferrer" className="text-lg text-custom-Brown hover:underline">linkedin.com/in/emiliano-mg</Link>
            </div>
          </div>
          {/* Introductory text */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold uppercase text-custom-Brown">Let’s Connect</h3>
            <p className="text-base text-custom-Brown leading-relaxed">I’m available for project collaborations, consultations, or just to say hello. Feel free to reach out via email or connect with me on LinkedIn.</p>
          </div>
        </div>
        {/* Footer note */}
        <div className="mt-24 text-center text-sm text-gray-600">Made by Emiliano Montes with ❤️, Next.js & Tailwind CSS</div>
      </div>
    </section>
)

export default Contact

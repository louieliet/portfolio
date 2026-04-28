import Hero from "@/components/hero";
import Experience from "@/components/experience";
import Projects from "@/components/projects";
import About from "@/components/about";
import Contact from "@/components/contact";
import { ScrollProgress } from "@/components/scroll-progress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <main className="bg-white text-black min-h-screen">
        <Hero />
        <Experience />
        <Projects />
        <About />
        <Contact />
      </main>
    </>
  );
}

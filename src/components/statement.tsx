import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Statement() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) return;

    // Split text into words (for simple word-by-word reveal)
    const words = Array.from(text.querySelectorAll('.word'));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=150%", // Pinned for 1.5 viewport heights
        pin: true,
        scrub: 1,
      }
    });

    // Animate opacity of each word
    tl.fromTo(words, 
      { opacity: 0.1, filter: "blur(4px)" },
      { opacity: 1, filter: "blur(0px)", stagger: 0.2, ease: "power1.inOut" }
    );

    // Hold the fully visible state for a moment
    tl.to(words, { opacity: 1, duration: 1 });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === container) t.kill();
      });
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center px-6 md:px-12 border-t border-white/10"
    >
      <h2 
        ref={textRef} 
        className="font-display text-4xl md:text-7xl lg:text-9xl uppercase tracking-tighter leading-tight text-center max-w-6xl"
      >
        <span className="word inline-block mr-4 md:mr-8">Design.</span>
        <span className="word inline-block mr-4 md:mr-8">Code.</span>
        <span className="word inline-block mr-4 md:mr-8">Data.</span>
        <span className="word inline-block text-white/50">Everything matters.</span>
      </h2>
    </section>
  );
}

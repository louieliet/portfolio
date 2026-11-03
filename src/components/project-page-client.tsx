import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "@/components/ui/image";
import type { ProjectItem } from "@/lib/data";
import { projects } from "@/lib/data";
import ImageLightbox from "@/components/image-lightbox";
import { getLenisInstance } from "@/lib/lenis-store";
import { hostOf } from "@/lib/utils";

// Clears the fixed header. Matches the rail's sticky top and the section scroll-margin-top in globals.css.
const HEADER_OFFSET = 128;

const pad = (n: number) => String(n).padStart(2, "0");
const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;
const isVideo = (src: string) => src.endsWith(".mp4");

// Live project CTA, used in the head. The domain caption is aria-hidden; the link name carries it.
function LiveCta({ link, label = "Visit site", className, style }: { link: string; label?: string; className: string; style?: CSSProperties }) {
  const host = hostOf(link);
  return (
    <div className={className} style={style}>
      <a
        className="pj-cta"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label}, ${host}, opens in a new tab`}
        data-magnetic="0.35"
      >
        {label}
        <span className="pj-cta-arrow" aria-hidden="true">↗</span>
      </a>
      <span className="pj-cta-host" aria-hidden="true">{host}</span>
    </div>
  );
}

// Coming from the home page, history.back() restores it from bfcache (no preloader, no WebGL reload).
// Every other case (direct entry, another case, modified click) keeps the plain link navigation.
const backToCases = (event: ReactMouseEvent<HTMLAnchorElement>) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
  const from = document.referrer ? new URL(document.referrer) : null;
  if (from?.origin !== window.location.origin || from.pathname !== "/") return;
  event.preventDefault();
  history.back();
};

export default function ProjectPageClient({
  project,
}: {
  project: ProjectItem;
}) {
  const sections = project.sections ?? [];
  const team = project.team ?? [];
  const heroImage = project.images?.[0];
  const index = projects.findIndex((p) => p.id === project.id);
  const next = projects[(index + 1) % projects.length];

  const facts = [
    { label: "Role", value: project.role },
    ...(team.length ? [{ label: "Team", value: team.join(", ") }] : []),
    { label: "Stack", value: project.stack.join(" / ") },
    ...(project.badge ? [{ label: project.badge.label, value: project.badge.text }] : []),
  ];

  // Lightbox order: cover, then every section's images in reading order. Clips play inline and stay out of it.
  const gallery = [
    ...(heroImage ? [heroImage] : []),
    ...sections.flatMap((s) => (s.media?.images ?? []).filter((src) => !isVideo(src))),
  ];

  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const isOpen = viewerIndex !== null;

  const openViewer = (imageIndex: number, trigger: HTMLElement) => {
    lastTriggerRef.current = trigger;
    setViewerIndex(imageIndex);
  };

  const closeViewer = () => {
    setViewerIndex(null);
    requestAnimationFrame(() => {
      lastTriggerRef.current?.focus();
    });
  };

  const step = (delta: number) => {
    setViewerIndex((i) => (i === null ? i : (i + delta + gallery.length) % gallery.length));
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  // Scrollspy: the active section is the last one whose top has crossed 40% of the viewport.
  useEffect(() => {
    const ids = (project.sections ?? []).map((s) => s.id);
    if (ids.length === 0) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let next = 0;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) next = i;
      });
      setActiveId(ids[next]);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [project]);

  // One observer for every clip on the page: play while on screen, pause off screen. Under Reduce Motion nothing
  // starts, so the poster is all that visitor sees. A screen clip gets its src on first sight, so nothing downloads before that.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const clips = document.querySelectorAll<HTMLVideoElement>(".pj-page video[data-clip]");
    if (clips.length === 0) return;
    const io = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        const clip = target as HTMLVideoElement;
        if (!isIntersecting) {
          clip.pause();
          continue;
        }
        if (!clip.getAttribute("src") && clip.dataset.src) clip.src = clip.dataset.src;
        clip.play().catch(() => {}); // a blocked play keeps the poster
      }
    });
    clips.forEach((clip) => io.observe(clip));
    return () => io.disconnect();
  }, [project]);

  // Lenis ignores hash anchors by default, so TOC clicks go through its scrollTo. Native fallback if it is absent.
  const jumpTo = (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const lenis = getLenisInstance();
    if (lenis) {
      lenis.scrollTo(target, { offset: -HEADER_OFFSET });
    } else {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
        behavior: "smooth",
      });
    }
    target.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  };

  const counter = (
    <p className="pj-counter pj-in" style={delay(0.2)}>
      {pad(index + 1)} / {pad(projects.length)}
    </p>
  );

  const back = (
    <a className="pj-back pj-in" style={delay(0.2)} href="/#projects" onClick={backToCases}>
      <ArrowLeft aria-hidden="true" size={14} />
      Cases
    </a>
  );

  return (
    <main className="pj-page">
      <div className="pj-topbar">
        {back}
        {counter}
      </div>

      <aside className="pj-rail" aria-label="Case navigation">
        {back}
        {counter}

        <nav aria-label="On this page">
          <ol className="pj-toc">
            {sections.map((s, i) => (
              <li key={s.id} className="pj-in" style={delay(0.3 + 0.05 * i)}>
                <a
                  href={`#${s.id}`}
                  aria-current={s.id === activeId ? "true" : undefined}
                  onClick={(e) => jumpTo(e, s.id)}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

      </aside>

      <div className="pj-main">
        <header>
          <p className="pj-meta pj-in" style={delay(0)}>
            {project.category} · {project.year}
          </p>
          <div className="pj-title-row">
            <h1 className="chapter-title pj-title" style={delay(0.05)}>
              {project.name}
            </h1>
            {project.mascot && (
              <div className="pj-mascot pj-in" style={delay(0.2)}>
                <video
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={project.mascot.poster}
                  aria-hidden="true"
                  data-clip
                  data-no-mask
                >
                  <source src={project.mascot.mov} type='video/quicktime; codecs="hvc1"' />
                  <source src={project.mascot.webm} type="video/webm" />
                </video>
              </div>
            )}
            {project.link && <LiveCta link={project.link} label={project.linkLabel} className="pj-cta-head pj-in" style={delay(0.35)} />}
          </div>
          <p className="pj-subtitle pj-in" style={delay(0.15)}>
            {project.subtitle}
          </p>

          <dl className="pj-facts">
            {facts.map((fact, i) => (
              <div key={fact.label} className="pj-in" style={delay(0.25 + 0.06 * i)}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <p className="pj-overview pj-in" style={delay(0.4)}>
            {project.overview}
          </p>
        </header>

        {/* No entrance animation: this frame is the view-transition target from the home case card. */}
        <button
          type="button"
          className="case-media pj-hero"
          style={{ viewTransitionName: `case-${project.id}` }}
          onClick={(e) => openViewer(0, e.currentTarget)}
          disabled={!heroImage}
        >
          {heroImage ? (
            <Image
              src={heroImage}
              alt={`${project.name} cover image`}
              fill
              sizes="(max-width: 1023px) 100vw, 75vw"
              priority
            />
          ) : (
            <div className="case-placeholder">
              <span className="case-placeholder-name">{project.name}</span>
              <span className="case-placeholder-note">Images coming soon</span>
            </div>
          )}
        </button>

        {sections.map((s) => (
          <section key={s.id} id={s.id} className="pj-section">
            <h2 className="pj-h2" tabIndex={-1}>
              {s.title}
            </h2>
            {s.body.map((paragraph) => (
              <p key={paragraph} className="pj-body">
                {paragraph}
              </p>
            ))}

            {s.media?.kind === "full" && s.media.images[0] && (
              <button
                type="button"
                className="case-media pj-full"
                onClick={(e) => openViewer(gallery.indexOf(s.media!.images[0]), e.currentTarget)}
              >
                <Image
                  src={s.media.images[0]}
                  alt={`${project.name}, ${s.title}`}
                  fill
                  sizes="(max-width: 1023px) 100vw, 75vw"
                />
              </button>
            )}

            {s.media?.kind === "screens" && (
              <div className="pj-screens">
                {s.media.images.map((src, i) =>
                  isVideo(src) ? (
                    <div key={src} className="pj-screen">
                      <video
                        className="pj-screen-img"
                        muted
                        loop
                        playsInline
                        preload="none"
                        poster={src.replace(/\.mp4$/, ".webp")}
                        data-src={src}
                        data-clip
                        aria-label={`${project.name} screen recording ${i + 1}`}
                      />
                      <img className="pj-bezel" src="/devices/iphone-17-pro-silver.webp" alt="" aria-hidden="true" data-no-mask />
                    </div>
                  ) : (
                    <button
                      key={src}
                      type="button"
                      className="pj-screen"
                      onClick={(e) => openViewer(gallery.indexOf(src), e.currentTarget)}
                    >
                      <Image
                        src={src}
                        alt={`${project.name}, ${s.title}, screen ${i + 1}`}
                        className="pj-screen-img"
                        sizes="(max-width: 1023px) 50vw, 300px"
                      />
                      <img className="pj-bezel" src="/devices/iphone-17-pro-silver.webp" alt="" aria-hidden="true" data-no-mask />
                    </button>
                  ),
                )}
              </div>
            )}
          </section>
        ))}

        <a href={`/projects/${next.id}`} className="pj-next">
          <span className="pj-next-label">Next case</span>
          <span className="chapter-title pj-next-name">{next.name}</span>
          <div className="case-media pj-next-media">
            {next.images?.[0] ? (
              <Image src={next.images[0]} alt={`${next.name} cover`} fill sizes="(max-width: 1023px) 100vw, 36rem" />
            ) : (
              <div className="case-placeholder">
                <span className="case-placeholder-name">{next.name}</span>
                <span className="case-placeholder-note">Images coming soon</span>
              </div>
            )}
          </div>
        </a>
      </div>

      <ImageLightbox
        isOpen={isOpen}
        images={gallery.map((src, i) => ({
          src,
          alt: `${project.name} screenshot ${i + 1}`,
        }))}
        currentIndex={viewerIndex ?? 0}
        onClose={closeViewer}
        onNext={() => step(1)}
        onPrevious={() => step(-1)}
        ariaLabel="Project image viewer"
      />
    </main>
  );
}

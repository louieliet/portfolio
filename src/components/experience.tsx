import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience, type ExperienceItem } from "@/lib/data";
import { layoutRuler } from "@/lib/period";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Experience as a scroll-driven index: each role is a giant name, and the one
// crossing the viewport centre is active (its detail opens). A sticky panel
// mirrors the active role: counter, period, time ruler, screenshot.
// Native scroll only; one ScrollTrigger per item, all resolved by `pick`.

const ITEMS: ExperienceItem[] = experience;
const TOTAL = String(ITEMS.length).padStart(2, "0");
const RULER = layoutRuler(ITEMS.map((item) => item.period));
const START_YEAR = Math.floor(RULER.min / 12); // RULER.min is January of the earliest year
const LANE_PITCH = 8; // px between ruler lanes
const LANES = Math.max(...RULER.segments.map((s) => s.lane)) + 1;
const UNPIN_REACH = 16; // px before the panel unpins, when the last role takes over

const pad = (n: number) => String(n).padStart(2, "0");

// Digits roll: the old value slides up out of the mask, the new one rises in.
// The previous value is cloned into the mask, so React keeps owning the real text.
function Count({ value, reduce }: { value: string; reduce: boolean }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const shown = useRef<string | null>(null);

  useEffect(() => {
    const num = numRef.current;
    const prev = shown.current;
    shown.current = value;
    if (!num || prev === null || prev === value || reduce) return;
    const out = document.createElement("span");
    out.className = "xp-roll-out";
    out.textContent = prev;
    num.after(out);
    gsap.killTweensOf([num, out]);
    gsap.fromTo(num, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "expo.out" });
    gsap.fromTo(out, { yPercent: 0 }, { yPercent: -100, duration: 0.6, ease: "expo.out", onComplete: () => out.remove() });
  }, [value, reduce]);

  return (
    <span className="xp-count">
      <span className="xp-num" ref={numRef}>{value}</span>
    </span>
  );
}

// Two stacked layers crossfade: the hidden one takes the next src, then they swap.
function Media({ src, alt, tall, wide }: { src?: string; alt: string; tall: boolean; wide: boolean }) {
  const [layers, setLayers] = useState<{ top: 0 | 1; srcs: [string?, string?] }>({ top: 0, srcs: [] });

  useEffect(() => {
    if (!src) return;
    setLayers((cur) => {
      if (cur.srcs[cur.top] === src) return cur;
      const next = cur.top === 0 ? 1 : 0;
      const srcs: [string?, string?] = [cur.srcs[0], cur.srcs[1]];
      srcs[next] = src;
      return { top: next, srcs };
    });
  }, [src]);

  return (
    <div className={`xp-media${tall ? " is-tall" : ""}${wide ? " is-wide" : ""}`}>
      {[0, 1].map((i) => (
        <img
          key={i}
          className={`xp-media-img${src && layers.top === i ? " is-top" : ""}`}
          src={layers.srcs[i]}
          alt={alt}
          aria-hidden={!src || layers.top !== i}
          loading="lazy"
          decoding="async"
        />
      ))}
      <span className={`xp-media-empty${src ? "" : " is-on"}`}>No preview</span>
    </div>
  );
}

function Ruler({ active }: { active: number }) {
  return (
    <div className="xp-ruler" aria-hidden="true">
      <div className="xp-lanes" style={{ height: LANES * LANE_PITCH }}>
        {RULER.segments.map((s, i) => (
          <i
            key={i}
            className={`xp-seg${i === active ? " is-active" : ""}`}
            style={{ left: `${s.left}%`, width: `${s.width}%`, top: s.lane * LANE_PITCH }}
          />
        ))}
      </div>
      <div className="xp-ticks">
        {RULER.ticks.map((t) => (
          <span key={t.year} className="xp-tick" style={{ left: `${t.left}%` }}>{t.year}</span>
        ))}
      </div>
    </div>
  );
}

function Entry({ item, active }: { item: ExperienceItem; active: boolean }) {
  return (
    <li className={`xp-item${active ? " is-active" : ""}`}>
      <h3 className="xp-name">
        {item.company}
        {item.highlight && <em className="xp-flag">Lead</em>}
      </h3>
      <div className="xp-detail">
        <div className="xp-detail-in">
          <p className="xp-role">{item.role}</p>
          <p className="xp-impact">{item.description}</p>
          {item.stack.length > 0 && <p className="xp-stack mono">{item.stack.join(" / ")}</p>}
        </div>
      </div>
    </li>
  );
}

export default function Experience() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const item = ITEMS[active];

  // Title rises once out of its mask.
  useEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".xp-title", { yPercent: 110 }, {
        yPercent: 0, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".xp-head", start: "top 88%", once: true, refreshPriority: -1 },
      });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  // Focus: the item at the viewport centre is active. Every trigger calls `pick`,
  // which reads the geometry, so there is never zero or two active items. Ties
  // in the gaps keep the item above, and the first and last hold at the ends.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = gsap.utils.toArray<HTMLElement>(".xp-item", root);
    const pick = () => {
      const mid = window.innerHeight / 2;
      let index = 0;
      items.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= mid) index = i;
      });
      // The panel unpins when the grid's bottom edge reaches its bottom. Just before that
      // the last role takes over, so it is active while the panel is still pinned.
      // A tall (Vyvo) or wide (UPocket) screenshot makes the panel taller or shorter while it is active, so measure the 4:3 height the last role uses.
      const panel = root.querySelector<HTMLElement>(".xp-panel");
      const grid = root.querySelector<HTMLElement>(".xp-grid");
      const shaped = panel?.querySelector<HTMLElement>(".xp-media.is-tall, .xp-media.is-wide");
      const panelH = panel && shaped?.offsetHeight ? panel.offsetHeight - shaped.offsetHeight + panel.clientWidth * 0.75 : panel?.offsetHeight ?? 0;
      if (panel && grid && grid.getBoundingClientRect().bottom <= parseFloat(getComputedStyle(panel).top) + panelH + UNPIN_REACH) {
        index = items.length - 1;
      }
      setActive(index);
    };
    // Top to bottom, after the CODE BEAUTY pin spacer exists (refreshPriority -1).
    const ctx = gsap.context(() => {
      items.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          refreshPriority: -1,
          onToggle: pick,
        });
      });
      // onToggle misses jumps over a whole item (scrollbar, End, reload restore), so pick on every update too.
      ScrollTrigger.create({ start: 0, end: "max", refreshPriority: -1, onUpdate: pick });
    }, root);
    ScrollTrigger.addEventListener("refresh", pick);
    pick();
    return () => {
      ScrollTrigger.removeEventListener("refresh", pick);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="experience"
      className="xp-root font-sans"
      ref={rootRef}
      data-active={active}
      data-reduce={reduce ? "true" : undefined}
    >
      <div className="xp-head">
        <span className="mask xp-mask"><h2 className="chapter-title xp-title">Experience</h2></span>
        <span className="mono">{ITEMS.length} entries · {START_YEAR} to present</span>
      </div>

      <div className="xp-grid">
        <aside className="xp-panel" aria-label="Active role">
          <div className="xp-count-row">
            <Count value={pad(active + 1)} reduce={reduce} />
            <span className="xp-total">/ {TOTAL}</span>
          </div>
          <p className="xp-period">{item.period}</p>
          <p className="xp-cur">{item.role}</p>
          <Ruler active={active} />
          <Media
            src={item.assets?.[0]}
            alt={`${item.company} screenshot`}
            tall={item.assetAspect === "9/16"}
            wide={item.assetAspect === "16/9"}
          />
        </aside>

        <div className="xp-list-col">
          <ol className="xp-list">
            {ITEMS.map((it, i) => (
              <Entry key={it.company} item={it} active={active === i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

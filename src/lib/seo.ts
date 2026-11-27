/*
 * SEO and metadata. One module for the site identity, meta descriptions, canonical URLs, JSON-LD and the sitemap.
 * Everything is derived from data.ts (no duplicated copy). Layout, the pages and the sitemap endpoint import from here.
 *
 * Canonical form: no trailing slash, except the root ("/about", "/projects/luma", "/"). This matches the internal
 * links, the sitemap and the og:url. Vercel serves /about and /about/ alike when no trailingSlash is set, so the
 * form has to be chosen here, not by the host.
 *
 * SITE.url comes from Astro's `site` (astro.config.mjs) through import.meta.env.SITE. Under plain Node (node --test)
 * import.meta.env is undefined, so the url is an empty string there; no test imports this module.
 */
import { experience, personalInfo, projects, type ProjectItem } from './data';

type Json = Record<string, unknown>;

export const SITE = {
  name: 'Emiliano Montes',
  url: String(import.meta.env?.SITE ?? '').replace(/\/$/, ''),
  author: personalInfo.name,
  locale: 'en_US',
  language: 'en',
  defaultTitle: 'Emiliano Montes | Product Designer and Engineer',
  defaultDescription:
    'Emiliano Montes is a product designer and engineer in Mexico City. He designs and builds web and iOS products end to end, including Luma for iPhone.',
  themeColor: { light: '#f4f4f4', dark: '#0b0c0b' },
} as const;

export const MAX_DESCRIPTION_LENGTH = 155;
export const ABOUT_TITLE = `About | ${SITE.name}`;
export const PERSON_ID = `${SITE.url}/#person`;

const allProjects = projects as ProjectItem[];
const SENTENCE_BREAK = /(?<=[.!?])\s+/;

/** Canonical path: trailing slashes removed, the root stays "/". */
export function canonicalPath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/** Absolute URL for a site path, in the canonical form. */
export function absoluteUrl(path: string): string {
  return `${SITE.url}${canonicalPath(path)}`;
}

/**
 * Meta description from prose. Returns the leading whole sentences that fit in `max` characters. If the first
 * sentence alone does not fit, it is cut at the last word boundary that leaves room for "..." (never mid-word,
 * unless a single word is longer than the room).
 */
export function metaDescription(text: string, max: number = MAX_DESCRIPTION_LENGTH): string {
  const clean = text.replace(/\s+/g, " ").trim();
  const sentences = clean.split(SENTENCE_BREAK);

  let out = "";
  for (const sentence of sentences) {
    const next = out ? `${out} ${sentence}` : sentence;
    if (next.length > max) break;
    out = next;
  }
  if (out) return out;

  const room = max - 3;
  const first = sentences[0];
  const cut = first.slice(0, room + 1);
  const boundary = cut.lastIndexOf(" ");
  const head = (boundary > 0 ? cut.slice(0, boundary) : first.slice(0, room)).replace(/[\s,;:-]+$/, "");
  return `${head}...`;
}

/** Description for /about, built from personalInfo (location, role, first education entry). */
export function aboutDescription(): string {
  const [education] = personalInfo.about.education;
  const place = personalInfo.location.split(",")[0].trim();
  return metaDescription(
    `${SITE.name} is a ${personalInfo.role.toLowerCase()} in ${place}, with a degree in ${education.degree} from ${education.institution}.`,
  );
}

/** Title for a case page: "Name: subtitle | Emiliano Montes". */
export function caseTitle(project: ProjectItem): string {
  return `${project.name}: ${project.subtitle} | ${SITE.name}`;
}

/**
 * Removes null, undefined, empty strings and empty arrays or objects, recursively. Keeps structured data free of
 * empty fields.
 */
export function prune(value: unknown): unknown {
  if (Array.isArray(value)) {
    const items = value.map(prune).filter((v) => v !== undefined);
    return items.length ? items : undefined;
  }
  if (value !== null && typeof value === "object") {
    const out: Json = {};
    for (const [key, child] of Object.entries(value)) {
      const pruned = prune(child);
      if (pruned !== undefined) out[key] = pruned;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return value === null || value === "" ? undefined : value;
}

/** Serialised JSON-LD, with "<" escaped so the payload can never close the script tag. */
export function toJsonLd(value: unknown): string {
  return JSON.stringify(prune(value) ?? null).replace(/</g, "\\u003c");
}

const withContext = (node: Json): Json => ({ "@context": "https://schema.org", ...node });
const unique = <T,>(items: T[]): T[] => [...new Set(items)];

/** Person node shared by the home and about pages. Phone and email are deliberately left out. */
export function personNode(): Json {
  const [current] = experience.filter((item) => /present\s*$/i.test(item.period));
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: personalInfo.name,
    url: `${SITE.url}/`,
    jobTitle: personalInfo.role,
    description: aboutDescription(),
    image: absoluteUrl("/projects/me-portrait.jpg"),
    address: {
      "@type": "PostalAddress",
      addressLocality: personalInfo.location.split(",")[0].trim(),
    },
    sameAs: [personalInfo.linkedin, personalInfo.github],
    knowsAbout: unique([
      ...experience.flatMap((item) => item.stack),
      ...allProjects.flatMap((project) => project.stack),
    ]),
    alumniOf: unique(personalInfo.about.education.map((item) => item.institution)).map((name) => ({
      "@type": "CollegeOrUniversity",
      name,
    })),
    worksFor: current && {
      "@type": "Organization",
      name: current.company,
      url: current.appStoreUrl,
    },
  };
}

/** Home: the website and the person. */
export function homeJsonLd(): Json[] {
  return [
    withContext({
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      name: SITE.name,
      url: `${SITE.url}/`,
      inLanguage: SITE.language,
    }),
    withContext(personNode()),
  ];
}

/** About: a ProfilePage whose mainEntity references the Person by @id, plus the Person itself. */
export function aboutJsonLd(): Json[] {
  return [
    withContext({
      "@type": "ProfilePage",
      "@id": `${absoluteUrl("/about")}#profile`,
      url: absoluteUrl("/about"),
      name: ABOUT_TITLE,
      description: aboutDescription(),
      inLanguage: SITE.language,
      mainEntity: { "@id": PERSON_ID },
    }),
    withContext(personNode()),
  ];
}

/**
 * Case page: the CreativeWork and its breadcrumb. `image` is the same og image the page declares (site path).
 */
export function caseJsonLd(project: ProjectItem, image: string): Json[] {
  const url = absoluteUrl(`/projects/${project.id}`);
  return [
    withContext({
      "@type": "CreativeWork",
      name: project.name,
      headline: project.subtitle,
      description: metaDescription(project.description),
      url,
      image: absoluteUrl(image),
      creator: { "@id": PERSON_ID },
      dateCreated: project.year,
      keywords: project.stack.join(", "),
      sameAs: unique([project.link, project.appStoreUrl].filter((u): u is string => Boolean(u))),
      inLanguage: SITE.language,
    }),
    withContext({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: "Work", item: `${SITE.url}/#work` },
        { "@type": "ListItem", position: 3, name: project.name, item: url },
      ],
    }),
  ];
}

/** Paths listed in the sitemap: home, about and every case page. */
export function sitemapPaths(): string[] {
  return ["/", "/about", ...allProjects.map((project) => `/projects/${project.id}`)].map(absoluteUrl);
}

/** sitemaps.org XML for absolute URLs. Slugs and paths here are plain ASCII, so no escaping is needed. */
export function sitemapXml(urls: string[]): string {
  const entries = urls.map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

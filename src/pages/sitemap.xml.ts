import type { APIRoute } from 'astro';
import { sitemapPaths, sitemapXml } from '../lib/seo';

/*
 * Static sitemap: home, /about and every case page, in the canonical form (lib/seo.ts).
 * No lastmod: the site has no truthful per-page dates, and none are invented.
 */
export const prerender = true;

export const GET: APIRoute = () =>
  new Response(sitemapXml(sitemapPaths()), { headers: { 'Content-Type': 'application/xml' } });

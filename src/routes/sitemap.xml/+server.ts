import { projects } from '$lib/data/projects';
import { SITE_URL } from '$lib/site';
import { base } from '$app/paths';

export const prerender = true;

const staticPaths = ['/', '/research/', '/work/', '/algorithms/', '/about/'];

export function GET() {
	const urls = [...staticPaths, ...projects.map((p) => `/projects/${p.slug}/`)].map(
		(path) => `${SITE_URL}${base}${path === '/' ? '/' : path}`
	);

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(loc) =>
			`\t<url>\n\t\t<loc>${loc}</loc>\n\t\t<changefreq>monthly</changefreq>\n\t\t<priority>${loc.includes('/projects/') ? '0.6' : '0.8'}</priority>\n\t</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
}

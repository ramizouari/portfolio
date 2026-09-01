import { SITE_URL } from '$lib/site';
import { base } from '$app/paths';

export const prerender = true;

export function GET() {
	return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}${base}/sitemap.xml\n`, {
		headers: { 'Content-Type': 'text/plain' }
	});
}

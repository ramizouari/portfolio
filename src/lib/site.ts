/**
 * Absolute origin used for canonical URLs, the sitemap and social cards.
 * Override at build time with PUBLIC_SITE_URL.
 */
export const SITE_URL = (import.meta.env.PUBLIC_SITE_URL ?? 'https://ramizouari.github.io').replace(
	/\/+$/,
	''
);

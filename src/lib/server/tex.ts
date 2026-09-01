import katex from 'katex';

/**
 * Every equation on this site is fixed, and every page carrying one is
 * prerendered — so KaTeX only ever needs to run at build time. Keeping it under
 * `$lib/server` guarantees it stays out of the client bundle.
 */
export function renderTex(tex: string, display = true): string {
	return katex.renderToString(tex, {
		displayMode: display,
		throwOnError: false,
		strict: false,
		output: 'html'
	});
}

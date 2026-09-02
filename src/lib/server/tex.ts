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

const ESCAPES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;'
};

function escapeHtml(text: string): string {
	return text.replace(/[&<>"]/g, (c) => ESCAPES[c]);
}

/** Unlikely enough in prose, and free of characters the escaper touches. */
const ATOM = /@@([0-9]+)@@/g;

/**
 * Prose written in the data modules, where a sentence may carry inline maths, a
 * code span or an emphasis. Maths and code are lifted out first, so the
 * emphasis pass cannot reach inside them and KaTeX never sees escaped HTML.
 *
 * The source strings are indented template literals, so runs of whitespace are
 * collapsed on the way out.
 */
export function renderProse(text: string): string {
	const atoms: string[] = [];

	const withAtoms = text.replace(/\$([^$]+)\$|`([^`]+)`/g, (_, math, code) => {
		atoms.push(math === undefined ? `<code>${escapeHtml(code)}</code>` : renderTex(math, false));
		return `@@${atoms.length - 1}@@`;
	});

	return escapeHtml(withAtoms)
		.replace(/\*([^*]+)\*/g, '<em>$1</em>')
		.replace(/\s+/g, ' ')
		.trim()
		.replace(ATOM, (_, i) => atoms[Number(i)]);
}

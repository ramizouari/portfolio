import { renderTex } from '$lib/server/tex';
import { threads } from '$lib/data/research';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => ({
	math: Object.fromEntries(threads.map((t) => [t.slug, t.equations.map((e) => renderTex(e.tex))]))
});

import { renderTex } from '$lib/server/tex';
import { problems } from '$lib/data/problems';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => ({
	math: Object.fromEntries(problems.map((p) => [p.slug, renderTex(p.signature)]))
});

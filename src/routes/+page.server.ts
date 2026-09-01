import { renderTex } from '$lib/server/tex';
import { threads } from '$lib/data/research';
import { profile } from '$lib/data/profile';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => ({
	heroEquation: renderTex(profile.heroEquation, false),
	signatures: Object.fromEntries(threads.map((t) => [t.slug, renderTex(t.signature)]))
});

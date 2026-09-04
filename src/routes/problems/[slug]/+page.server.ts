import { error } from '@sveltejs/kit';
import { problems, problemBySlug } from '$lib/data/problems';
import { renderProse, renderTex } from '$lib/server/tex';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => problems.map((p) => ({ slug: p.slug }));

/** Only what the pager renders — the neighbour's prose stays on the server. */
function neighbour(position: number) {
	const p = problems[position];
	return p ? { slug: p.slug, title: p.title, index: p.index } : null;
}

export const load: PageServerLoad = ({ params }) => {
	const problem = problemBySlug(params.slug);
	if (!problem) error(404, `No problem called "${params.slug}"`);

	const position = problems.findIndex((p) => p.slug === problem.slug);

	/* The raw prose never reaches the client: KaTeX runs here, and only the
	   rendered markup is serialised into the prerendered page data. */
	return {
		meta: {
			slug: problem.slug,
			index: problem.index,
			title: problem.title,
			contest: problem.contest,
			year: problem.year,
			division: problem.division ?? null,
			kicker: problem.kicker,
			tags: problem.tags,
			constraints: problem.constraints,
			complexity: problem.complexity,
			variants: problem.variants ?? null,
			repo: problem.repo ?? null,
			judge: problem.judge ?? [],
			signatureTex: problem.signature
		},
		signature: renderTex(problem.signature),
		statement: problem.statement.map((p) => renderProse(p)),
		reduction: renderProse(problem.reduction),
		ideas: problem.ideas.map((idea) => ({
			title: idea.title,
			body: renderProse(idea.body),
			tex: idea.tex ? renderTex(idea.tex) : null,
			label: idea.tex ?? null
		})),
		prev: neighbour(position - 1),
		next: neighbour(position + 1)
	};
};

import { error } from '@sveltejs/kit';
import { projects, projectBySlug } from '$lib/data/projects';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => projects.map((p) => ({ slug: p.slug }));

export const load: PageLoad = ({ params }) => {
	const project = projectBySlug(params.slug);
	if (!project) error(404, `No project called "${params.slug}"`);

	const index = projects.findIndex((p) => p.slug === project.slug);
	return {
		project,
		prev: projects[index - 1] ?? null,
		next: projects[index + 1] ?? null
	};
};

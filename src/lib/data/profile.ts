import type { Pathname } from '$app/types';

export const profile = {
	name: 'Rami Zouari',
	role: 'Machine Learning Engineer',
	subrole:
		'Applied research in generative models, stochastic dynamics, optimal transport & reinforcement learning',
	location: 'Sfax, Tunisia',
	email: 'zouari.rami@yahoo.com',
	phone: '+216 98 420 806',
	github: 'https://github.com/ramizouari',
	linkedin: 'https://www.linkedin.com/in/rami-zouari',
	heroEquation: String.raw`\mathrm{d}z = f(z,t)\,\mathrm{d}t + h(z,t)\,\mathrm{d}N`,
	tagline:
		'I build models of things that move — patient trajectories, market regimes, probability distributions — and the software that makes them run.',
	intro: [
		`I am a Machine Learning Engineer with a software engineering foundation, focusing on taking applied mathematical
		 research into production. Currently, I’m developing reinforcement learning trading agents
		 along with the surrounding evaluation harness and live execution loops.
		 Previously, I worked on continuous-time generative modeling in oncology, specifically 
		 neural jump ODEs, survival-aware VAEs, and optimal transport with partial observations.`,
		`Earlier work includes research on deep RL for mean-payoff games on graphs at TU Dresden, as well
		 as production systems for Text2SQL, semantic search, and multi-agent LLM pipelines.
		 My focus across all of these has been translating exact mathematical formulations into clean,
		 reliable code.`,
		`My background is in competitive programming (ICPC World Finalist, Tunisian Regional gold medalist).
		 I still stay active in the community by writing problems, building contest platforms, and coaching university teams.`
	],
	stats: [
		{ value: '6', label: 'years', detail: 'in machine learning, research through production' },
		{ value: '100+', label: 'problems set', detail: 'authored & judged across six contests' },
		{
			value: '2025',
			label: 'ICPC finalist',
			detail: 'World Finals in Baku, plus 2× regional gold'
		},
		{ value: '3', label: 'languages', detail: 'Arabic, French, English (875 TOEIC)' }
	],
	availability: 'Open to research-engineering roles and collaborations.'
} as const;

export type NavLink = { href: Pathname; label: string; index: string };

export const navLinks: NavLink[] = [
	{ href: '/work/', label: 'Work', index: '01' },
	{ href: '/research/', label: 'Research', index: '02' },
	{ href: '/algorithms/', label: 'Algorithms', index: '03' },
	{ href: '/about/', label: 'About', index: '04' }
];

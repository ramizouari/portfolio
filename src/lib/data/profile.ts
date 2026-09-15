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
		`I am a Machine Learning Engineer with a Software Engineering background, working where
		 applied research meets production systems. I am currently building a reinforcement-learning
		 trading agent and the framework, evaluation protocol and live loop around it; before that,
		 continuous-time generative modelling in oncology —
		 neural ODEs augmented with jump processes, variational autoencoders with survival-aware
		 objectives, and optimal transport under partial information.`,
		`Before that I spent six months at TU Dresden on deep reinforcement learning for mean-payoff
		 games on graphs, and several years building Text2SQL pipelines, semantic search, and
		 multi-agent LLM systems. The through-line is the same: a precise mathematical statement of
		 the problem, then an implementation that holds up under load.`,
		`I came to all of this through competitive programming — an ICPC Finalist, and a gold medalist
		 at the ICPC Tunisian Regional. These days I spend part of my time on the other side of the
		 judge: writing problems, building contest infrastructure, and coaching the teams that get
		 there.`
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

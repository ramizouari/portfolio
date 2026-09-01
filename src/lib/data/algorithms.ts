export type Award = {
	id: string;
	year: string;
	medal: 'gold' | 'silver' | 'other';
	title: string;
	detail: string;
};

export const awards: Award[] = [
	{
		id: 'icpc-2024-coach',
		year: '2024',
		medal: 'gold',
		title: 'ICPC Tunisian Regional — Gold',
		detail: 'As coach. Second gold at the regional, from the other side of the table.'
	},
	{
		id: 'icpc-2022',
		year: '2022',
		medal: 'silver',
		title: 'ICPC Tunisian Regional — Silver',
		detail: 'As contestant.'
	},
	{
		id: 'icpc-2021',
		year: '2021',
		medal: 'gold',
		title: 'ICPC Tunisian Regional — Gold',
		detail: 'As contestant.'
	},
	{
		id: 'music-2017',
		year: '2017',
		medal: 'other',
		title: 'Arabic Music Diploma',
		detail: 'A different kind of practice, and the one that came first.'
	}
];

export type Contest = {
	name: string;
	year: string;
	role: string;
	authored: string;
	total: string;
	note: string;
	repo?: string;
};

export const contests: Contest[] = [
	{
		name: 'VertexCover Contest',
		year: '2023',
		role: 'Problem setter · judge',
		authored: '51',
		total: '51',
		note: 'The entire problem set — an educational division and a hard division, from counting and number theory to interactive problems with custom checkers and testlib interactors.',
		repo: 'https://github.com/YessineJallouli/VertexCoverContest-1'
	},
	{
		name: 'WinterCup 6.0',
		year: '2023',
		role: 'Problem setter · judge',
		authored: '7',
		total: '13',
		note: 'Including the DOMjudge deployment and the Polygon → DOMjudge conversion tooling that ran the contest.',
		repo: 'https://github.com/YessineJallouli/WinterCup6'
	},
	{
		name: 'WinterCup 5.0',
		year: '2022',
		role: 'Problem setter',
		authored: '—',
		total: '21',
		note: 'Contributed problems and infrastructure to the fifth edition.',
		repo: 'https://github.com/ramizouari/WinterCup5'
	},
	{
		name: 'WinterCup 4.0',
		year: '2022',
		role: 'Problem setter · co-organiser',
		authored: '—',
		total: '14',
		note: 'Hosted at INSAT in April 2022, and later the seed problem set for Excellentia.',
		repo: 'https://github.com/ramizouari/WinterCup4'
	}
];

export type Topic = { group: string; items: string[] };

export const topics: Topic[] = [
	{
		group: 'Data structures',
		items: [
			'Segment trees & variants',
			'Persistent structures',
			'Sqrt trees',
			'Fenwick trees over groups',
			'Order-statistic trees',
			'Tries',
			'B-trees'
		]
	},
	{
		group: 'Algebra & number theory',
		items: [
			'Ring & quadratic extensions',
			'Primitive roots of unity',
			'Discrete logarithm',
			'Modular square roots',
			'Legendre symbol',
			'Bézout over integral domains',
			'FFT on cyclic rings'
		]
	},
	{
		group: 'Graphs & combinatorics',
		items: [
			'Range queries on trees',
			'Path counting',
			'Matching & covers',
			'Expected-value DP',
			'Pattern matching',
			'Hashing'
		]
	}
];

export const infrastructure = [
	{
		name: 'PolygonDOMConverter',
		repo: 'https://github.com/ramizouari/PolygonDOMConverter',
		note: 'Converts a Codeforces Polygon package into a DOMjudge contest — statements, test data, checkers and accounts — so a contest can be prepared in one system and judged in another.'
	},
	{
		name: 'Excellentia',
		repo: 'https://github.com/ramizouari/Excellentia',
		note: 'A compiler, runner and judge on Azure AKS, seeded with the WinterCup 4.0 problem set.'
	},
	{
		name: 'CPLibrary',
		repo: 'https://github.com/ramizouari/CPLibrary',
		note: 'The library the problems were written against — and the reason several of them exist at all.'
	}
];

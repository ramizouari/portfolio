export type Role = {
	company: string;
	/** Surfaced in the "Previously" block on the home page. */
	featured?: boolean;
	title: string;
	period: string;
	start: string;
	end: string;
	location: string;
	summary: string;
	highlights: string[];
	stack: string[];
	kind: 'research' | 'engineering' | 'lead';
};

export const roles: Role[] = [
	{
		company: 'RobotBulls',
		title: 'Reinforcement Learning Engineer',
		period: 'Apr 2026 — present',
		start: '2026-04',
		end: 'present',
		location: 'Remote',
		kind: 'research',
		summary:
			'Reinforcement learning for trading — a natural setting and a hostile one — and the environment, evaluation protocol and framework it takes to do it carefully.',
		highlights: [
			'Designed the trading environment as the specification of the problem — execution timing, fee accounting, position sizing, risk limits, episode structure and what the agent observes of its own book — each an explicit decision covered by tests, because every default becomes a leak or a bias.',
			'Built that environment once and exposed it to both Gymnasium and TorchRL, with a tensorised batched variant stepped on device, so market, portfolio and reward logic cannot drift between stacks.',
			'Designed the indicator layer around two execution modes behind one interface — streaming for live stepping, precalculated for backtests — with a torch-native batched implementation and CUDA tests, so a feature means the same thing in research and in production.',
			'Made inputs and actions invariant to what changes — price level, volatility regime, account size — and put risk into how actions are sized and returns are scored rather than into a veto after the fact.',
			'Set the evaluation protocol as a fixed input: a frozen out-of-sample calendar, temporal walls enforced by assertion, several seeds, and statistics deflated for every configuration tried.',
			'Took the agent to a live loop that reuses the evaluation loop itself — feed in, account as ledger, planned trade out — with shadow and paper modes, guards and nightly replay, so parity with the backtest is by construction and checked daily.'
		],
		stack: ['PyTorch', 'TorchRL', 'TensorDict', 'Gymnasium', 'pytest', 'LightGBM', 'C++23']
	},
	{
		company: 'InovIntell',
		featured: true,
		title: 'Artificial Intelligence Engineer',
		period: 'May 2025 — Sep 2026',
		start: '2025-05',
		end: '2026-09',
		location: 'Kraków, Poland · remote',
		kind: 'research',
		summary:
			'Generative modelling of clinical trial data: continuous-time latent models for patient trajectories, and optimal transport for population adjustment.',
		highlights: [
			'Designed and implemented Jump Neural ODEs — an augmented jump SDE without diffusion — to simulate adverse events and lines of therapy along a patient trajectory.',
			'Extended a differentiable ODE solver with a jump mechanism, event detection and adjoint support, so gradients flow through discontinuities that are not invertible.',
			'Built a library of constrained optimal-transport algorithms that shift a source population onto published summary statistics of a target trial, under partial information.',
			'Added survival-aware components to the generative model: hazard heads, censoring, masking, and an ELBO with a survival term.',
			'Orchestrated a distributed Optuna hyper-parameter search over the NODE-based VAE, with sharded multi-stage pipelines and bootstrap confidence bands.'
		],
		stack: ['PyTorch', 'Lightning', 'torchdiffeq', 'Optuna', 'NumPy', 'SciPy', 'lifelines', 'uv']
	},
	{
		company: 'predictores.ai',
		featured: true,
		title: 'Team Lead — Artificial Intelligence Engineer',
		period: 'Feb 2025 — Jan 2026',
		start: '2025-02',
		end: '2026-01',
		location: 'Graz, Austria · remote',
		kind: 'lead',
		summary:
			'Led AI for a brand-intelligence platform: topic radars, narrative analysis, semantic retrieval, and the agentic crawlers behind them.',
		highlights: [
			'Built a two-level clustering framework that segments news into topics and subtopics, with per-subtopic sentiment to assess tone.',
			'Engineered a semantic search algorithm over sentence embeddings that lifted retrieval precision for brand profiling.',
			'Designed multi-tool agents (web search, semantic search) driven by Jinja-templated prompting, and removed the latency bottlenecks in the serving path.',
			'Shipped Narrative Radar, Topic Trends and Cultural Intelligence end to end — Next.js front end, FastAPI services, and an RQ/Redis job queue for asynchronous crawling and analysis.',
			'Managed cloud infrastructure and inference endpoints for the platform’s models and small language models.'
		],
		stack: [
			'Python',
			'FastAPI',
			'Sentence-Transformers',
			'LangChain',
			'Weaviate',
			'Redis / RQ',
			'Next.js',
			'Prisma'
		]
	},
	{
		company: 'ConvergenceAI',
		featured: true,
		title: 'Machine Learning Engineer',
		period: 'Mar 2024 — Apr 2025',
		start: '2024-03',
		end: '2025-04',
		location: 'Sousse, Tunisia',
		kind: 'engineering',
		summary:
			'Text2SQL: a modular pipeline from natural language to executable SQL, its evaluation harness, and the product built on top of it.',
		highlights: [
			'Improved individual pipeline components by up to 20% while keeping the architecture modular and LLM-agnostic.',
			'Designed the selector layer — SQL-based and index-based schema linking, minimal-schema extraction, and a reflexion layer that evaluates and repairs generated SQL.',
			'Built ChatSQL: a Django + Svelte product for querying and analysing databases in natural language, including auth, subscriptions and a PWA shell.',
			'Wrote a multi-threaded C++ ETL that streams gzip-compressed IMDB TSV dumps, normalises them to a relational schema, and batch-loads into MariaDB/PostgreSQL on Azure.',
			'Published a survey of the Text2SQL literature as a documentation site for the team.'
		],
		stack: ['Python', 'FastAPI', 'Django', 'Svelte', 'OpenAI', 'SQLGlot', 'C++20', 'Boost', 'Azure']
	},
	{
		company: 'Technische Universität Dresden',
		featured: true,
		title: 'Deep Learning Researcher — Master thesis',
		period: 'Feb 2023 — Jul 2023',
		start: '2023-02',
		end: '2023-07',
		location: 'Dresden, Germany',
		kind: 'research',
		summary:
			'Learning to solve mean-payoff games on graphs with a graph neural network trained by AlphaZero-style self-play — thesis hosted at the Institute of Algebra.',
		highlights: [
			'Generated two datasets of 160 000 mean-payoff games each with random-graph constructions optimal in the big-O sense and sinkless conditioning by rejection, as SLURM jobs on the ZIH HPC cluster.',
			'Wrote an exact multithreaded C++ solver by reducing a game to a ternary max-atom system solved by arc consistency, with a linear-bound domain and a tropical early stop, and annotated both datasets with optimal strategies, values and winners.',
			'Designed a weighted graph convolutional network around the game’s symmetries — node-agnostic, invariant under positive rescaling of the weights, stable under padding — in TensorFlow.',
			'Trained it by self-play through a model-based MCTS: learner, actor and evaluator services over FastAPI and a Reverb replay buffer, discovered under SLURM.'
		],
		stack: ['C++', 'TensorFlow', 'Keras', 'Reverb', 'NetworkX', 'gRPC', 'SLURM', 'Boost']
	},
	{
		company: 'Baya Music',
		title: 'Machine Learning Engineer',
		period: 'Aug 2023 — Nov 2023',
		start: '2023-08',
		end: '2023-11',
		location: 'Tunisia',
		kind: 'engineering',
		summary: 'Predicting the timbre of a Tunisian music sequence from raw audio.',
		highlights: [
			'Built the audio feature pipeline and the classifier that predicts musical timbre from a sequence.'
		],
		stack: ['TensorFlow', 'librosa']
	},
	{
		company: 'dB.Sense',
		title: 'Deep Learning Researcher',
		period: 'Jul 2022 — Sep 2022',
		start: '2022-07',
		end: '2022-09',
		location: 'Tunis, Tunisia',
		kind: 'research',
		summary:
			'Quantised networks for embedded deep learning: BinaryFlow, a binary neural network library extending Larq and TensorFlow.',
		highlights: [
			'Formalised binary neural networks and derived the optimal binarisation of vectors, dot products and bilinear operations, then implemented BinaryNet, XNOR-Net, XNOR-Net++, ABC-Net, Bi-Real Net and MeliusNet layers behind one Larq-compatible API.',
			'Added shifted and stochastic meta-binarisations, the Bop optimiser and quantisation-error regularisers, and benchmarked on MNIST and Free Spoken Digits — 29× less memory and 64× fewer equivalent MACs than the float MLP.'
		],
		stack: ['TensorFlow', 'Larq', 'Keras', 'Python']
	},
	{
		company: 'Acrabotics',
		title: 'Computer Vision Research Engineer',
		period: 'Aug 2021',
		start: '2021-08',
		end: '2021-08',
		location: 'Tunis, Tunisia',
		kind: 'research',
		summary: 'Emotion detection from video with a graph neural network.',
		highlights: [
			'Implemented a GNN over facial landmark graphs for emotion recognition on video input.'
		],
		stack: ['Python', 'OpenCV', 'TensorFlow']
	},
	{
		company: 'Naxxum Group',
		title: 'Data Scientist',
		period: 'Aug 2020',
		start: '2020-08',
		end: '2020-08',
		location: 'Tunis, Tunisia',
		kind: 'engineering',
		summary: 'Behavioural analysis from survey results.',
		highlights: [
			'Applied classical machine learning to segment and explain survey response behaviour.'
		],
		stack: ['Python', 'scikit-learn', 'pandas']
	}
];

export type Education = {
	institution: string;
	credential: string;
	detail: string;
	period: string;
};

export const education: Education[] = [
	{
		institution: 'Technische Universität Dresden',
		credential: 'Master thesis — Machine Learning',
		detail:
			'Implementation, generation, analysis and predictive modelling of mean-payoff games using self-play — hosted at the Institute of Algebra.',
		period: '2023'
	},
	{
		institution: 'National Institute of Applied Sciences & Technology (INSAT)',
		credential: 'Software Engineering Degree',
		detail: 'Specialisation: DevOps.',
		period: '2018 — 2023'
	},
	{
		institution: 'Lycée Pilote de Sfax',
		credential: 'Baccalauréat — Mathematics',
		detail: '',
		period: '2014 — 2018'
	}
];

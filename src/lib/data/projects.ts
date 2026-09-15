export type Project = {
	slug: string;
	name: string;
	kicker: string;
	year: string;
	org: string;
	domain: 'research' | 'platform' | 'systems' | 'tooling';
	featured: boolean;
	visibility: 'public' | 'private';
	repo?: string;
	summary: string;
	role: string;
	problem: string;
	approach: string[];
	outcome?: string;
	stack: string[];
	metrics?: { value: string; label: string }[];
};

export const projects: Project[] = [
	{
		slug: 'rl-trading',
		name: 'RL trading framework',
		kicker: 'Build the instrument first, then the agent',
		year: '2026 — present',
		org: 'RobotBulls',
		domain: 'research',
		featured: true,
		visibility: 'private',
		summary:
			'The framework a trading agent has to stand on: one environment core behind Gymnasium and TorchRL, indicators that behave identically in backtest and live, an agent trained in tensorised simulations across a wide range of market conditions, and a live loop that is the backtest loop with the market in it.',
		role: 'Architecture, environments, indicator layer, agent training, live loop.',
		problem: `Reinforcement learning is the natural formalism for trading and a hostile one to train
			in: the reward is a thin edge in heavy noise, the market drifts, the agent's own position feeds
			back into its observations, and costs enter the return at second order. Every trading experiment
			also needs the same primitives — a market, a portfolio, indicators, a trainer — and rebuilding them
			per experiment is how two implementations quietly diverge and a result stops meaning anything.
			So the framework comes first, and every modelling default in it is treated as a decision.`,
		approach: [
			'Implemented the environment against one shared core and exposed it to both Gymnasium and TorchRL, then built the tensorised version — batched lanes stepped together on device, subwindow sampling, explicit execution timing so the agent never fills at a price it has already seen.',
			'Made the environment the specification: fee and slippage accounting, how a requested size becomes a position, risk limits and their anchoring, episode boundaries and settlement, and what the agent observes of its own book — each explicit and under test.',
			'Designed the technical-indicator layer around two execution modes behind one interface — streaming for live stepping, precalculated-and-replayed for backtests — with a torch-native batched implementation and CUDA tests.',
			'Made observations and actions invariant to price level, volatility regime and account size, and placed risk in the sizing and the objective rather than in a post-hoc gate.',
			'Trained the agent on engineered, scale-free inputs against many environments stepped together on device, each started at an independent point in history, so one batch spans calm and turbulent markets alike — and gated its deployment on strict tests: out-of-sample scoring across seeds, causality and invariance checks, and replay of its recorded decisions to the digit.',
			'Kept the evaluation protocol as data: a frozen out-of-sample calendar, temporal walls enforced by assertion, several seeds, and statistics deflated for every configuration tried.',
			'Took it live as the evaluation loop itself run against the exchange — a bar store with freshness and gap gates, the account API as the ledger, guards for drawdown, exposure and outages, shadow and paper modes, nightly replay of recorded inputs — with a parity test against the backtest.',
			'Wrote a C++23 header-only synthetic market for testing against known dynamics: streaming coroutine paths, Markov-switching jump diffusion, pluggable regime and jump processes, correlated assets and reverse-time generation.'
		],
		outcome:
			'The framework is in place and under test, the protocol is fixed, and the agent built on it runs in shadow mode against the exchange with parity to the backtest checked every night.',
		stack: ['PyTorch', 'TorchRL', 'TensorDict', 'Gymnasium', 'pytest', 'LightGBM', 'C++23'],
		metrics: [
			{ value: '2', label: 'RL stacks, one core' },
			{ value: '2', label: 'indicator execution modes' },
			{ value: '1', label: 'loop for backtest, training and live' }
		]
	},
	{
		slug: 'compass',
		name: 'COMPASS',
		kicker: 'Latent jump ODEs for synthetic patient trajectories',
		year: '2025 — 2026',
		org: 'InovIntell',
		domain: 'research',
		featured: true,
		visibility: 'private',
		summary:
			'A conditional VAE whose decoder is a jump ODE over a state that carries both a free latent block and the exact bookkeeping of a patient’s treatment history.',
		role: 'Model design, solver engineering, optimal-transport layer, ITC pipeline.',
		problem: `Oncology trials are small, expensive and rarely directly comparable. Simulating realistic
			patient trajectories — lines of therapy starting and stopping, adverse events firing, death —
			requires a generative model that is continuous in time but discontinuous at events, and that
			respects censoring rather than pretending it away.`,
		approach: [
			'Specified the model as an augmented jump SDE without a diffusion term, with gated hazard channels per event type and masks for death and off-treatment periods.',
			'Extended torchdiffeq with a jump mechanism: event detection, step cutting at event times, multistep restart, latent projection so only the latent block jumps, and adjoint support with tests.',
			'Made the cumulative hazard part of the integrated state, so the solver produces Λ alongside z and S(t) = exp(−Λ(t)) holds to solver tolerance — then built the likelihood on it: right-censoring, terminal and recurrent channels, masked normalisation, and an ELBO with a survival term.',
			'Built the three-stage indirect-treatment-comparison pipeline around it, with sharding, parallelism, CPU thread capping, OOM guards and ETA reporting for long fine-tuning runs.',
			'Reported results as bootstrap Kaplan–Meier percentile bands for synthetic arms, with anchored and unanchored arm mapping.'
		],
		outcome:
			'Applied to real trial comparisons (ELEVATE-TN, ELEVATE-RR, ASCEND, AMPLIFY) as part of a production analysis pipeline, and accepted as a co-authored poster (MSR91) at ISPOR Europe 2026 in Vienna.',
		stack: ['PyTorch', 'Lightning', 'torchdiffeq', 'Optuna', 'lifelines', 'NumPy', 'uv'],
		metrics: [
			{ value: '3', label: 'pipeline stages, sharded' },
			{ value: '9', label: 'event channels' },
			{ value: '10k', label: 'baseline conditions per run' }
		]
	},
	{
		slug: 'cot',
		name: 'cot',
		kicker: 'Constrained optimal transport for population adjustment',
		year: '2026',
		org: 'InovIntell',
		domain: 'research',
		featured: true,
		visibility: 'private',
		summary:
			'A library that transforms a source trial’s covariate distribution to match a target trial’s published summary statistics, preserving the joint correlation structure.',
		role: 'Author — mathematics, implementation, documentation.',
		problem: `You have individual patient-level data for one trial and, for the other, only a published
			table: a mean here, a proportion above a threshold there, a couple of quantiles. Matching those
			numbers by reweighting throws away the joint structure; matching them by ad-hoc rescaling is not
			optimal in any sense you can state.`,
		approach: [
			'Derived and implemented eight transport variants — categorical, expectation, expectation–variance, quantile, single-threshold, bin-constrained, and conditional transports with fixed or flexible strata.',
			'Solved each by the right method: a closed form where one exists, a linear program or Sinkhorn for the discrete cases, a convex QP for overlapping bin constraints.',
			'Made the specification declarative — a per-variable dictionary of method and target statistics — and proved decomposability from an additively separable cost.',
			'Added a constraint-checking module that reports whether each requested constraint was actually met, and a documented policy for over-determined specifications.',
			'Implemented a neural transport module with separated primal and dual optimisers for the cases the closed forms do not reach.'
		],
		stack: ['Python', 'NumPy', 'SciPy', 'PyTorch', 'scikit-learn', 'MkDocs'],
		metrics: [
			{ value: '8', label: 'transport variants derived' },
			{ value: '3', label: 'solution methods' }
		]
	},
	{
		slug: 'naomi',
		name: 'Naomi',
		kicker: 'A wellness companion that is not allowed to improvise',
		year: '2026',
		org: 'Now For Women',
		domain: 'platform',
		featured: true,
		visibility: 'private',
		summary:
			'An in-app companion for women 40+ that grounds every answer in the user’s own assessment, wellness plan and long-term memory — and refuses to free-form medical advice.',
		role: 'Full-stack — orchestration, prompt architecture, assessment reporting and the mobile client.',
		problem: `A health companion that hallucinates is worse than no companion. The hard part is not
			generation; it is guaranteeing that every claim traces back to something the user actually
			answered, and that the labels the assistant uses match the labels in the report they are
			looking at.`,
		approach: [
			'Built an orchestrator with keyword intent detection routing to per-intent response templates, and a strict section order for the assembled prompt.',
			'Retrieved RAG context only for informational intents, keeping it explicitly supporting rather than authoritative, with the wellness plan as the source of truth.',
			'Layered memory: Redis for the working set, Postgres for long-term, with a memory delta extracted and saved on every turn.',
			'Added an output validator running editorial and safety checks before the reply is persisted — no invented headings, no new percentages, no blended domain names.',
			'Implemented the assessment report, wellness-readiness profile and the mobile screens that render them.'
		],
		stack: [
			'Python',
			'FastAPI',
			'AWS Bedrock (Claude)',
			'Postgres',
			'Redis',
			'React Native',
			'Next.js',
			'TypeScript'
		],
		metrics: [
			{ value: '7', label: 'life domains scored' },
			{ value: '8', label: 'prompt sections, ordered' }
		]
	},
	{
		slug: 'predictive-intelligence',
		name: 'Predictive Intelligence Platform',
		kicker: 'Topic radars, narrative analysis and agentic crawling',
		year: '2025 — 2026',
		org: 'predictores.ai',
		domain: 'platform',
		featured: true,
		visibility: 'private',
		summary:
			'A brand-intelligence platform: two-level topic clustering with per-subtopic sentiment, semantic retrieval, LLM agents, and a distributed job queue driving asynchronous crawlers.',
		role: 'Team lead — AI architecture, retrieval, agents, and the full front-to-queue path.',
		problem: `Brand intelligence needs more than a keyword feed. It needs to know what topics exist, how
			they split into subtopics, how the tone differs between them, which narratives are forming, and
			which competitors are moving — continuously, across sources, without a human in the loop.`,
		approach: [
			'Built a double-level clustering framework segmenting news into topics and then subtopics, with sentiment scored per subtopic rather than per article.',
			'Engineered semantic search over sentence embeddings in Weaviate, raising retrieval precision for brand profiling.',
			'Designed multi-tool agents — web search and semantic search — driven by Jinja-templated prompts, with explicit exception handling around LLM calls.',
			'Shipped Narrative Radar, Topic Trends and Cultural Intelligence end to end: Next.js pages and Prisma models, FastAPI endpoints, and RQ workers chaining crawlers with relevance gates.',
			'Added automatic competitor discovery, article-date extraction, pre-crawling exploration and re-analysis jobs.'
		],
		stack: [
			'Python',
			'FastAPI',
			'Redis / RQ',
			'Weaviate',
			'Sentence-Transformers',
			'LangChain',
			'Next.js',
			'Prisma'
		],
		metrics: [
			{ value: '3', label: 'products shipped' },
			{ value: '2-level', label: 'topic segmentation' }
		]
	},
	{
		slug: 'text2sql',
		name: 'Text2SQL & ChatSQL',
		kicker: 'From natural language to executable SQL, and the product on top',
		year: '2024 — 2025',
		org: 'ConvergenceAI',
		domain: 'platform',
		featured: true,
		visibility: 'private',
		summary:
			'A modular, LLM-agnostic pipeline that turns a question and a database schema into SQL — with schema linking, example selection, reflexion and evaluation — plus the product built around it.',
		role: 'Pipeline architecture, selector and reflexion layers, evaluation harness, full-stack product work.',
		problem: `Text2SQL degrades badly on real schemas: hundreds of tables, ambiguous column names, and
			questions that do not map cleanly onto one query. A monolithic prompt cannot be measured, and what
			cannot be measured cannot be improved.`,
		approach: [
			'Split the pipeline into named layers — question reformulation, example generation, schema linking, generation, reflexion — each producing a typed artifact that can be cached, inspected and scored independently.',
			'Built two families of selectors, SQL-based and index-based, and a minimal-schema extractor that computes the smallest schema on which a query is well formed.',
			'Added a reflexion layer that evaluates generated SQL and repairs it, with per-column status tracking.',
			'Wrote the evaluation pipeline as an Azure Function with comprehensive metrics, budgeted to answer within 30 seconds.',
			'Shipped ChatSQL — Django + Svelte, with auth, Stripe subscriptions, conversation history, golden-SQL management and a PWA shell.'
		],
		outcome: 'Component-level improvements of up to 20% on the benchmark suite.',
		stack: [
			'Python',
			'OpenAI',
			'SQLGlot',
			'FastAPI',
			'Django',
			'Svelte',
			'Azure Functions',
			'MongoDB'
		],
		metrics: [
			{ value: '20%', label: 'component improvement' },
			{ value: '<30s', label: 'evaluation budget' }
		]
	},
	{
		slug: 'mean-payoff-games',
		name: 'Mean-payoff games',
		kicker: 'An exact solver, a symmetry-respecting GNN, and self-play',
		year: '2023',
		org: 'TU Dresden',
		domain: 'research',
		featured: true,
		visibility: 'public',
		repo: 'https://github.com/ramizouari/StochasticGames',
		summary:
			'Master thesis — Implementation, generation, analysis and predictive modelling of mean-payoff games using self-play: a library, two annotated datasets, an exact solver by reduction to a CSP, a graph network built from the game’s symmetries, and a distributed AlphaZero pipeline.',
		role: 'Everything: library, dataset generation, exact solver, model design, distributed self-play.',
		problem: `Mean-payoff games have positional optimal strategies but no known polynomial-time algorithm.
			Whether a learned policy can approximate the optimal strategy well enough to be useful is an
			empirical question that first requires ground truth — hundreds of thousands of games with their
			exact values and strategies — and a model that cannot cheat on the labels of the vertices or
			the scale of the weights.`,
		approach: [
			'Wrote an mpg library with Python and C++ environments, then generated two datasets of 160 000 games each — dense (24 GB) and sparse (4 GB) — with random-graph constructions optimal in the big-O sense and sinkless conditioning by rejection.',
			'Built an exact multithreaded C++ solver by reducing a game to a min–max system, then to an n-ary and a ternary max-atom system solved by arc consistency, with a linear bound on the domain and a tropical early stop; annotated both datasets with optimal strategies, values and winners in about twelve hours each on the ZIH HPC cluster.',
			'Designed a weighted graph convolutional network around the game’s symmetries — total in the size of the game, node-agnostic, invariant under positive rescaling of the weights, stable under padding — in TensorFlow, with value, strategy and hybrid heads.',
			'Formalised the game as a stochastic game and trained the model by AlphaZero-style self-play through a model-based MCTS: learner, actor and evaluator services over FastAPI, a Reverb replay buffer over gRPC, and SLURM discovery, run with one learner, six actors and six evaluators.'
		],
		outcome:
			'A complete, working pipeline: generator, solver, datasets, model and distributed self-play. The training run that would make the agent play well is the stated next step; the thesis is the instrument, not the result.',
		stack: ['C++', 'TensorFlow', 'Keras', 'Reverb', 'NetworkX', 'gRPC', 'FastAPI', 'SLURM'],
		metrics: [
			{ value: '320k', label: 'games generated and solved' },
			{ value: '28 GB', label: 'across two datasets' },
			{ value: 'NP ∩ co-NP', label: 'complexity class' }
		]
	},
	{
		slug: 'cplibrary',
		name: 'CPLibrary',
		kicker: 'Competitive programming, with the mathematics left in',
		year: '2021 — present',
		org: 'Personal',
		domain: 'tooling',
		featured: false,
		visibility: 'public',
		repo: 'https://github.com/ramizouari/CPLibrary',
		summary:
			'A C++23 library of algorithms and data structures built on abstract algebra rather than on special cases — segment trees over arbitrary monoids, ring extensions, FFT over cyclic rings.',
		role: 'Author.',
		problem: `Most competitive-programming libraries are a pile of copy-pasted snippets. The abstractions
			that make them correct — the monoid a segment tree needs, the ring an FFT lives in — are usually
			left implicit, which is exactly why they break when reused.`,
		approach: [
			'Built the data structures over generic binary operations: segment trees over any associative operation, Fenwick trees over groups, sparse tables over idempotent operations.',
			'Implemented abstract algebra directly — ring and quadratic extensions, fields of rationals over integral domains, Bézout coefficients over integral domains, fast exponentiation over monoids.',
			'Covered modular arithmetic thoroughly: primitive roots, discrete logarithm, modular square roots, Legendre symbols, and linear-time inverse tables.',
			'Kept it zero-overhead with templates and C++23 features, tested with Boost.Test.'
		],
		stack: ['C++23', 'CMake', 'Boost.Test'],
		metrics: [{ value: '7★', label: 'on GitHub' }]
	},
	{
		slug: 'qipat',
		name: 'QIPAT',
		kicker: 'Image processing, implemented from scratch',
		year: '2022 — 2023',
		org: 'Personal',
		domain: 'systems',
		featured: false,
		visibility: 'public',
		repo: 'https://github.com/ramizouari/QIPAT',
		summary:
			'A C++20 and Qt image-processing application and library — every algorithm implemented by hand, with an emphasis on speed.',
		role: 'Author.',
		problem: `Understanding an image-processing algorithm and calling it are different things. Writing the
			whole toolkit yourself, fast enough to be usable interactively, is the difference.`,
		approach: [
			'Implemented linear and non-linear filters — spectral, convolution, Gaussian, Laplacian, Sobel, Prewitt, Kirsch, Scharr, LoG, bilateral, median — including user-defined operators.',
			'Added thresholding (Otsu, Sauvola, adaptive), edge detection, morphology, colour conversion, noise models and histogram operations.',
			'Optimised the resource-heavy paths with the data structures from CPLibrary, and multi-threaded them without sacrificing consistency.'
		],
		stack: ['C++20', 'Qt6', 'CPLibrary', 'CMake'],
		metrics: [{ value: '12★', label: 'on GitHub' }]
	},
	{
		slug: 'imdb-normalizer',
		name: 'IMDBNormalizer',
		kicker: 'Streaming ETL for compressed dumps',
		year: '2024',
		org: 'ConvergenceAI',
		domain: 'systems',
		featured: false,
		visibility: 'private',
		summary:
			'A C++20 tool that streams gzip-compressed IMDB TSV dumps, normalises them to a relational schema, and batch-loads them into MariaDB or PostgreSQL.',
		role: 'Author.',
		problem:
			'The dumps are large, compressed, and denormalised. Decompressing them to disk first is wasteful; loading them row by row is far too slow.',
		approach: [
			'Read and decompress in a stream, never materialising the full file.',
			'Made the normalisation level configurable — none, keys only, or fully normalised.',
			'Supported asynchronous multi-threaded batch insertion, with a condition variable admitting several writers to the lock at once.',
			'Handled UTF-8 configuration and per-table schema definitions for the whole IMDB dataset.'
		],
		stack: [
			'C++20',
			'Boost.Iostreams',
			'Boost.ProgramOptions',
			'zlib',
			'MariaDB',
			'PostgreSQL',
			'CMake'
		]
	},
	{
		slug: 'excellentia',
		name: 'Excellentia',
		kicker: 'A judge, a runner and a compiler on Kubernetes',
		year: '2022 — 2023',
		org: 'Personal',
		domain: 'platform',
		featured: false,
		visibility: 'public',
		repo: 'https://github.com/ramizouari/Excellentia',
		summary:
			'A platform for learning algorithmics through ICPC-style problems, with its own compiler, runner and judge, deployed on a managed Kubernetes cluster.',
		role: 'Author.',
		problem:
			'Hosting a contest means running untrusted code, deterministically, at scale — a systems problem at least as interesting as the problems it serves.',
		approach: [
			'Split the backend into a compiler, a runner that executes a submission against test cases and issues a verdict, and a judge that orchestrates both.',
			'Instrumented it with Prometheus metrics, health checks and experimental tracing.',
			'Provisioned it on Azure AKS with Terraform, backed by MS-SQL.',
			'Seeded it with the official WinterCup 4.0 problem set.'
		],
		stack: ['Spring Boot 3', 'Svelte', 'Azure AKS', 'Terraform', 'Prometheus', 'MS-SQL']
	},
	{
		slug: 'binaryflow',
		name: 'BinaryFlow',
		kicker: 'Binary neural networks as a library',
		year: '2022',
		org: 'dB.Sense',
		domain: 'research',
		featured: false,
		visibility: 'public',
		repo: 'https://github.com/ramizouari/BNN',
		summary:
			'A binary neural network library extending Larq and TensorFlow: the published binarisation schemes behind one modular API, with the derivations behind each, benchmarked on images and on audio.',
		role: 'Author — formalisation, derivations, library, experiments.',
		problem:
			'A binarised network trades precision for memory and latency — a 1-bit weight is 32× smaller and a dot product becomes XNOR and popcount — but the published methods are scattered across old, abandoned and mutually incompatible implementations, and the derivations that justify their scaling factors are rarely written down.',
		approach: [
			'Formalised BNNs and derived the optimal binarisation of a vector, of a dot product, and of an arbitrary bilinear operation, so dense and convolutional layers share one quantisation argument.',
			'Implemented BinaryNet, XNOR-Net, XNOR-Net++, ABC-Net, Bi-Real Net and MeliusNet layers — dense and 1D/2D/3D convolutions — as Larq-compatible layers and quantizers, so Larq’s deployment optimisations still apply.',
			'Added meta-binarisations Larq lacks — shifted (with a trainable offset), stochastic, and both — plus the Bop optimiser and regularisers on the quantisation error of weights, activations and the bilinear operation.',
			'Benchmarked against a full-precision MLP: on MNIST, BinaryNet is 29× smaller and needs 64× fewer equivalent multiply-accumulates; on Free Spoken Digits, a signal-processing task BNNs are rarely tried on, the binary models reach 92–94 % against the float model’s 96 %.'
		],
		stack: ['TensorFlow', 'Larq', 'Keras', 'Python'],
		metrics: [
			{ value: '29×', label: 'smaller than the float MLP' },
			{ value: '64×', label: 'fewer equivalent MACs' },
			{ value: '6', label: 'BNN families, one API' }
		]
	},
	{
		slug: 'blackscope',
		name: 'Blackscope',
		kicker: 'Multi-agent QA for black-box websites',
		year: '2026',
		org: 'Personal',
		domain: 'tooling',
		featured: false,
		visibility: 'public',
		repo: 'https://github.com/ramizouari/blackscope',
		summary:
			'An AI-powered quality-assurance tool that analyses a website for accessibility, HTML compliance and UI/UX issues, and generates and executes test scenarios against it.',
		role: 'Author.',
		problem:
			'Auditing a site you have no source access to means driving it like a user and reasoning about what you see.',
		approach: [
			'Orchestrated specialised evaluators — accessibility, HTML parsing, compliance, UI/UX — as cooperating agents.',
			'Generated and executed Selenium scenarios against a headless Firefox.',
			'Streamed progress to the client as NDJSON so long audits report as they go.'
		],
		stack: ['Python 3.12', 'FastAPI', 'Selenium', 'React', 'Vite', 'TypeScript']
	}
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);

export function projectBySlug(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}

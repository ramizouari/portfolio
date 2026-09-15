export type Equation = { tex: string; caption: string };

export type Thread = {
	slug: string;
	index: string;
	title: string;
	kicker: string;
	/** A short form of the headline equation, for teasers and narrow columns. */
	signature: string;
	period: string;
	context: string;
	abstract: string;
	equations: Equation[];
	points: { heading: string; body: string }[];
	keywords: string[];
	artifacts?: { label: string; href?: string; note: string }[];
};

export const threads: Thread[] = [
	{
		slug: 'reinforcement-learning',
		signature: String.raw`\bigl|\mathbb{E}[r_{t+1}\mid o_t]\bigr|\ \ll\ \sigma_t`,
		index: '01',
		title: 'Reinforcement learning for trading',
		kicker: 'A natural setting for a trading agent — and a hostile one',
		period: '2026 — present',
		context: 'RobotBulls',
		abstract: `Reinforcement learning is the natural setting for a trading agent, but it is also a hostile one. The reward is a thin edge buried in noise, the market
			does not hold still, the agent's own state feeds back into what it observes, and every modelling
			choice left to a default becomes a leak or a bias. So the agent and the instrument had to be
			built with equal care: a trading environment in which every detail is a decision, an indicator
			layer that cannot see the future and computes identically live and in replay, invariances that
			make inputs and actions mean the same thing across regimes, and a framework in which backtest,
			training and live execution are the same code.`,
		equations: [
			{
				tex: String.raw`\begin{aligned}a_t &= \pi(o_t), \qquad o_t \in \mathcal{F}_t\\ \mathrm{d}P^{\mathrm{mid}}_u &= \sigma_u\,\mathrm{d}B_u + \gamma\,v_u\,\mathrm{d}u, \qquad \textstyle\int_{t+\delta}^{t+\delta+\tau} v_u\,\mathrm{d}u = \Delta S_t\\ \tilde P_u &= P^{\mathrm{mid}}_u + \operatorname{sgn}(v_u)\big(\tfrac{1}{2}\,s_u + \iota(v_u/D_u)\big)\\ P^{\mathrm{exec}}_t &= \frac{1}{\Delta S_t}\int_{t+\delta}^{t+\delta+\tau}\! v_u\,\tilde P_u\,\mathrm{d}u \;\notin\; \mathcal{F}_t\end{aligned}`,
				caption:
					'Execution is a process, not an instant. The order arrives after a latency δ and is worked over a window τ. Meanwhile the mid keeps moving, and the order itself pushes it, causing a permanent impact γ on the market. Each fill crosses half the spread and pays a temporary impact ι that grows with participation. None of this is known when the decision is made.'
			},
			{
				tex: String.raw`\begin{aligned}\mathrm{d}W_t &= \mathrm{d}C_t + P_t\,\mathrm{d}S_t + S_t\,\mathrm{d}P_t + \mathrm{d}[S,P]_t\\ &= S_t\,\mathrm{d}P_t \;-\; \alpha\,P_t\,\lvert\mathrm{d}S_t\rvert\end{aligned}`,
				caption:
					'Wealth as a semimartingale, in the environment’s own accounting. The presence of fees forces the strategy to have finite variation, and  the quadratic covariation with the price vanishes because of the medium frequency trading.'
			},
			{
				tex: String.raw`x_t = \phi\big(b_{\le t}\big), \qquad \phi^{\mathrm{stream}}\big(b_{\le t}\big) = \phi^{\mathrm{batch}}(b)_t \quad \forall\, t \ge t_{\mathrm{warm}}`,
				caption:
					'The indicator contract. A feature is a function of the bars up to now and nothing else, so look-ahead is impossible by construction; and its streaming evaluation, one observation at a time, must equal its batch evaluation over a fixed history at every bar past the warm-up. The equality is tested bar for bar, because the same code runs in the backtest and against the exchange.'
			}
		],
		points: [
			{
				heading: 'Natural, and hostile',
				body: `Everything about trading fits the partially observable Markov decision process, and everything about the data
					fights the estimator. The signal-to-noise ratio per decision is brutal, the relationship
					between features and returns drifts and occasionally inverts, transaction costs enter the
					return at second order, and the amount of genuinely independent out-of-sample data is measured
					in months. 
					
					None of this is a reason not to use reinforcement learning. Instead, all of it is a reason
					to build the instrument before running the experiment.`
			},
			{
				heading: 'The environment is the specification',
				body: `When a fill happens relative to the bar the agent has seen, what a fee is charged on, how
					a requested size becomes a realised position, what the agent observes of its own book, when
					an episode ends and what is settled when it does — each of these is a modelling decision, and
					each default is a way to leak the future or bias the policy toward doing nothing or doing
					too much. They were designed, written down and covered by tests rather than inherited.`
			},
			{
				heading: 'Invariances by construction',
				body: `Feeding raw price or volume units causes a policy to memorize the calendar rather than learn the market. 
					To prevent this, strip out price levels, volume baselines, volatility regimes, and account size beforehand. 
					Construct all observations to be scale-invariant, emit strictly scale-free actions verified by rescaling tests,
					and embed risk directly into action sizing and reward scoring rather than bolting it on after training.`
			},
			{
				heading: 'Indicators that cannot lie',
				body: `Technical indicators depend strictly on bar history and must evaluate in two ways: step-by-step for live stepping (preventing lookahead bias) and vectorized across full windows for backtesting.

A unified interface enforces shared warm-up periods, composes indicators into DAGs computed once per split, and uses a batched,
GPU-native tensor implementation with per-lane state. Both execution modes are tested bar-for-bar to ensure production matches research,
preventing backtest leakage.`
			},
			{
				heading: 'A robust and profitable agent',
				body: `The agent that came out of it is the one that takes all of this literally. Its inputs are
					engineered rather than collected. Tensorized simulations optimized the model, maximizing both GPU utilization and training throughput. 
					The validated model earned its deployment through strict tests before it was allowed
					anywhere near the exchange.`
			},
			{
				heading: 'One framework, or none of it holds',
				body: `One environment core exposed to more than one reinforcement-learning stack, one
					indicator layer beneath both, a test suite for causality, unit invariance and the equivalence
					of every execution mode, and a live loop that is the evaluation loop with the market
					substituted for the file — feed in, account as ledger, planned trade out — so that parity
					between backtest and production is by construction and checked every day.`
			}
		],
		keywords: [
			'reinforcement learning',
			'trading environments',
			'technical indicators',
			'transaction costs',
			'non-stationarity',
			'backtest–live parity',
			'TorchRL'
		],
		artifacts: [
			{
				label: 'rl_notebooks',
				note: 'The rl_trading library: environments, indicators, agents, the training and evaluation protocol, and the live loop — with the design and review documents behind each.'
			}
		]
	},
	{
		slug: 'jump-odes',
		index: '02',
		title: 'Latent jump ODEs',
		kicker: 'Continuous-time generative models that are allowed to break',
		period: '2025 — 2026',
		context: 'InovIntell · COMPASS',
		signature: String.raw`\mathrm{d}y = f\,\mathrm{d}t + h\,\mathrm{d}N`,
		abstract: `A patient trajectory is not smooth. Treatment lines start and stop, adverse events fire,
			the patient dies. A neural ODE integrates a smooth vector field and cannot express any of that.
			The fix is to integrate a state that follows an ODE between isolated instants and is displaced
			discontinuously at those instants. I designed the model and extended a differentiable solver to
			integrate it, detect and even predict its events, and backpropagate through them.`,
		equations: [
			{
				tex: String.raw`\mathrm{d}y(t) \;=\; f\big(t, y(t)\big)\,\mathrm{d}t \;+\; \sum_{k=1}^{K} h_k\big(t, y(t^-)\big)\,\mathrm{d}N_k(t)`,
				caption:
					'The state follows a learned vector field between events, and is displaced by a learned jump map when stream k fires. Solutions are taken càdlàg, so the value reported at an event time is the state after the jump.'
			},
			{
				tex: String.raw`\mathrm{d}\Lambda_{\mathcal{L}} \;=\; [\,m_\dagger = 0\,]\cdot[\,m_\ominus = 1\,]\cdot g_{\mathcal{L}}\big(\chi(t), t\big)\,\mathrm{d}t`,
				caption:
					'An event channel made structurally consistent via indicator masks: therapy initiation requires the patient to be alive and off treatment.'
			}
		],
		points: [
			{
				heading: 'The augmented state carries its own bookkeeping',
				body: `Alongside the latent representations, the model is conditioned on static covariates and dynamic state-space variables.
					Structural constraints are embedded natively into the representation space rather than handled through post-hoc rejection or filtering.`
			},
			{
				heading: 'Order-preserving integration across events',
				body: `Discontinuities that occur within an integration interval degrade solver accuracy unless the step size is adapted to align with the transition boundary.
					For history-dependent methods, these transitions further invalidate prior trajectory data, necessitating a solver reset.`
			},
			{
				heading: 'Adjoints through a non-invertible jump map',
				body: `Adjoint-based gradient calculation with constant memory relies on running the sensitivity equations backward along the trajectory.
					However, non-invertible state transitions disrupt this continuous formulation, requiring explicit handling of event coordinates and sensitivity updates across the discontinuities.`
			},
			{
				heading: 'Two mechanisms: replay at training, generate at sampling',
				body: `Training conditions on the events that were actually observed and replays them at their
					recorded times. Sampling has no such record, so the same model runs against a stochastic
					mechanism that draws its own event times from the hazards it is integrating`
			}
		],
		keywords: [
			'neural ODE',
			'jump processes',
			'càdlàg',
			'adjoint sensitivity',
			'event detection',
			'generative modelling'
		],
		artifacts: [
			{
				label: 'torchdiffeq — jump ODE fork',
				href: 'https://github.com/ramizouari/torchdiffeq',
				note: 'Jump mechanism, event detection, multistep restart and adjoint support added on top of the reference differentiable ODE solver.'
			},
			{
				label: 'multinode',
				note: 'The jump VAE: fixed and stochastic jump mechanisms, the latent projection that keeps the hazards out of the jump, and the recurrent / terminal channel split.'
			}
		]
	},
	{
		slug: 'survival-odes',
		index: '03',
		title: 'Survival latent ODEs',
		kicker: 'Survival curves from the generative model, not fitted after it',
		period: '2025 — 2026',
		context: 'InovIntell · COMPASS',
		signature: String.raw`S(t) = e^{-\Lambda(t)}`,
		abstract: `Continuous dynamical models naturally generate state paths, but time-to-event supervision requires
			aligning these trajectories with target observation densities. Embedding the running integrals required
			for event modeling directly into the state evolution allows the system to compute downstream risk curves
			and likelihood functions natively and with matched numerical fidelity.`,
		equations: [
			{
				tex: String.raw`\frac{\mathrm{d}}{\mathrm{d}t}\begin{pmatrix} z \\ \Lambda \end{pmatrix} = \begin{pmatrix} f_\theta(z) \\ h_\theta(z) \end{pmatrix}`,
				caption:
					'The integrated system couples the primary latent dynamics with an auxiliary accumulating state. By adequate parametrization, the system guarantees valid decay in the downstream event probabilities directly from the integration dynamics, ensuring theoretical consistency by construction.'
			},
			{
				tex: String.raw`\ell \;=\; \begin{cases} -\log h(T) + \Lambda(T), & \text{event at } T \\[2pt] \Lambda(C), & \text{censored at } C \end{cases}`,
				caption:
					'An observed event contributes its log-intensity plus the hazard accumulated up to it; a censored observation contributes only what accumulated before follow-up ended. Treating the two the same is the standard way to bias a survival model, and the loss refuses to.'
			},
			{
				tex: String.raw`\log p_\theta(x \mid z) \;=\; \sum_{(t,d)\,\in\,\mathcal{O}} \log \mathcal{N}\!\big(x_{t,d};\ \hat{x}_{t,d},\ \sigma_d^{2}\big)`,
				caption:
					'Clinical data is missing in patterns that mean something, so the reconstruction likelihood is a sum over 𝒪, the set of measurements that were actually made: an absent one contributes nothing rather than a zero.'
			}
		],
		points: [
			{
				heading: 'The hazard belongs in the state',
				body: `Augmenting the ODE with Λ means one solver call produces the trajectory and the
					cumulative hazard together, consistently, at whatever tolerance the solver was given. A
					hazard summed separately after the fact is a different quantity from the one the dynamics
					imply, and the discrepancy shows up exactly where survival curves are read.`
			},
			{
				heading: 'Right-censoring is the normal case',
				body: `Because most patients remain event-free throughout their observation window, integration intervals are determined dynamically for each individual based on their terminal event or monitoring cut-off. Coincident event and censoring indicators are resolved conservatively to preserve valid clinical observation semantics..`
			},
			{
				heading: 'Terminal and recurrent channels',
				body: `Patient trajectories frequently involve both repeatable clinical complications and definitive terminal endpoints. The framework accommodates these dynamics concurrently, maintaining dedicated event processes to model recurrent adverse occurrences separately from terminal clinical boundaries.`
			},
			{
				heading: 'Masking, all the way down',
				body: `In clinical time-series, the timing and absence of tests carry distinct diagnostic meaning. The framework accounts for these sampling patterns across all normalization steps and training objectives, preventing unrecorded clinical observations from distorting patient state representations or biasing outcome likelihoods.`
			}
		],
		keywords: [
			'survival analysis',
			'cumulative hazard',
			'right-censoring',
			'neural ODE',
			'variational inference',
			'masked losses'
		],
		artifacts: [
			{
				label: 'multinode',
				note: 'The hazard-augmented node, the censored and masked survival log-likelihood, the survival-augmented ELBO, and the masked reduction machinery underneath them.'
			},
			{
				label: 'synthetic_multinode',
				note: 'Training, Cox metrics, and the experiments that score the model against Kaplan–Meier curves rather than only against marginals.'
			}
		]
	},
	{
		slug: 'optimal-transport',
		signature: String.raw`\inf_{\gamma \in \Gamma(\mu,\nu)} \int c\,\mathrm{d}\gamma`,
		index: '04',
		title: 'Constrained optimal transport',
		kicker: 'Moving a population onto statistics you can read, but data you cannot',
		period: '2025 — 2026',
		context: 'InovIntell · COMPASS',
		abstract: `Comparing two clinical trials indirectly means making their populations comparable. You have
			individual patient-level data for one trial and, for the other, only what was published: a mean,
			a standard deviation, a proportion above a threshold, a few quantiles. The question is how to move
			the source population so that it matches those numbers while disturbing its joint structure as
			little as possible. That is an optimal transport problem with marginal constraints.`,
		equations: [
			{
				tex: String.raw`\mathcal{L}(\mu,\nu,c) \;=\; \inf_{\gamma \in \Gamma(\mu,\nu)} \iint_{\mathcal{X}\times\mathcal{Y}} c(x,y)\,\mathrm{d}\gamma(x,y)`,
				caption:
					'Kantorovich’s formulation. The goal is to find a transport plan γ that maps a source population μ to a target population ν.'
			},
			{
				tex: String.raw`\text{Minimise}\quad \mathcal{C}(\nu) \;=\; \min_{\nu \in \mathrm{Distributions}(\mathcal{Y})} \mathcal{L}(\mu,\nu,c) \quad \text{s.t} \quad g(\nu)=0`,
				caption:
					'Constrained version of Optimal Transport. The goal is to find the "closest" target distribution ν that verifies the constraints, and its associated transport plan γ.'
			},
			{
				tex: String.raw`T(x) \;=\; \sqrt{v^{\nu} \oslash v^{\mu}} \odot \big(x - m^{\mu}\big) + m^{\nu}, \qquad T = F_\nu^{-1} \circ F_\mu`,
				caption:
					'Closed forms where they exist: the affine map is optimal when only a mean and a variance are published, the monotone rearrangement when a quantile function can be reconstructed.'
			}
		],
		points: [
			{
				heading: 'A taxonomy, not a bag of tricks',
				body: `With a few assumptions, the problem splits along two axes, the decomposition structure (unconditional, conditionally on a fixed group, conditionally on a variable group) and the variable type together with which
					target statistics are actually available. With that in hand, we attack each variant, case by case.`
			},
			{
				heading: 'Partial information is the normal case',
				body: `A published table rarely gives a full marginal. It gives a threshold proportion, or a single
					quantile, or an integer count. Those become constraints on ν rather than a specification of it,
					and the transport problem is solved subject to them.`
			},
			{
				heading: 'Conditioning that is allowed to move',
				body: `In some formulations, a conditioning variable such as the treatment arm is itself shifted by the transport. 
					This constitute a recursive optimal transport problem, where the outer one can be solved via Linear Programming.`
			},
			{
				heading: 'Constraints are checked, not assumed',
				body: `Every transport reports whether the constraints it was given were actually met, and
					over-determined specifications are prioritised explicitly rather than silently.`
			}
		],
		keywords: [
			'Optimal Transport',
			'Kantorovich duality',
			'Sinkhorn',
			'Linear Programming',
			'quantile transport',
			'indirect treatment comparison'
		],
		artifacts: [
			{
				label: 'cot — constrained optimal transport',
				note: 'Categorical, expectation, variance, quantile, threshold and bin-constrained methods; mixed and stratified transports; a neural transport module; and a documented derivation for each.'
			},
			{
				label: 'multinode_compass',
				note: 'The ITC pipeline that consumes it: three sharded stages, bootstrap Kaplan–Meier bands, and anchored / unanchored comparisons.'
			}
		]
	},
	{
		slug: 'games-on-graphs',
		signature: String.raw`\nu(v) = \sup_{\sigma}\ \inf_{\tau}\ \bar{w}(\sigma,\tau)`,
		index: '05',
		title: 'Learning to solve games on graphs',
		kicker:
			'Mean-payoff games: an exact solver, a network built from the symmetries, and self-play',
		period: '2023',
		context: 'TU Dresden · Institute of Algebra · Master thesis',
		abstract: `Mean-payoff games sit in NP ∩ co-NP with no known polynomial algorithm — a rare and
			interesting place. The thesis asked whether a graph neural network trained by self-play can learn
			the optimal strategy, using exact solutions as ground truth. That meant building the whole
			chain: a library for the games, a generator with the right distributions, a solver fast enough to
			annotate hundreds of thousands of instances, a model that respects what the game is invariant to,
			and a distributed AlphaZero-style pipeline on an HPC cluster to train it.`,
		equations: [
			{
				tex: String.raw`\nu(v) \;=\; \sup_{\sigma}\ \inf_{\tau}\ \liminf_{n\to\infty} \frac{1}{n}\sum_{i=0}^{n-1} w\big(e_i\big)`,
				caption:
					'The value of a vertex: the long-run average weight the maximiser can guarantee against any strategy of the minimiser. Positional strategies suffice, which is what makes the target learnable.'
			},
			{
				tex: String.raw`x_u \;\le\; \max\big(x_v,\ x_{v'}\big) + c \qquad\Longleftarrow\qquad x_u = \max_{(u,v)\in E}\big(x_v + w(u,v)\big)`,
				caption:
					'The exact solver is a constraint-satisfaction reduction: a game becomes a min–max system, then an n-ary max-atom system, then a ternary one, which arc consistency solves over a finite domain. Two heuristics make it fast on random games — a linear bound on the diameter of finite assignments, and an early stop that follows from the system being closed under translation.'
			},
			{
				tex: String.raw`\mathcal{M}(\Phi G) = \Phi\,\mathcal{M}(G), \qquad \mathcal{M}(E,\,sW) = \mathcal{M}(E,\,W)\ \ \text{for } s>0`,
				caption:
					'What the model must not be able to see: the labels of the vertices, and the scale of the weights. Node-agnosticism is permutation equivariance; positive-scaling invariance is a normalisation in front of the network. With totality and stability under padding, these fix the architecture more than any hyper-parameter does.'
			}
		],
		points: [
			{
				heading: 'Generate, then annotate',
				body: `Two datasets of 160 000 games each — one dense, 24 GB; one sparse, 4 GB — drawn from
					graph distributions chosen for fairness and symmetry, built by random-graph constructions that
					are optimal in the big-O sense, and conditioned to be sinkless by rejection. Generation and
					annotation ran as SLURM jobs on the ZIH cluster.`
			},
			{
				heading: 'An exact solver by reduction',
				body: `A multithreaded C++ solver turns each game into a ternary max-atom system and runs arc
					consistency on it. The search domain is cut down by the observation that, on random games,
					finite assignments have diameter of the order of the largest weight; and since translations
					are polymorphisms of a tropical system, an iterate that drops below the domain's ceiling can
					only converge to −∞ — so it stops. Both datasets were labelled with the optimal strategy
					pair, the value and the winner at every start, in about twelve hours each.`
			},
			{
				heading: 'A network built from the symmetries',
				body: `A weighted graph convolutional operator — plain GCN discards exactly the information a
					mean-payoff game turns on — written in TensorFlow because the only available implementation
					was PyTorch. The model is total in the size of the game, equivariant under relabelling,
					invariant under a positive rescaling of the weights and stable under padding, and it carries
					value, strategy and hybrid heads.`
			},
			{
				heading: 'AlphaZero on a graph',
				body: `The game is formalised as a stochastic game, and a model-based Monte Carlo tree search
					plays it. Learner, actor and evaluator services talk over FastAPI, with a Reverb replay
					buffer over gRPC, and discover each other under SLURM; the experimental run used one learner,
					six actors and six evaluators. The pipeline is a working proof of concept — the full training
					run is the first thing the thesis leaves for later.`
			}
		],
		keywords: [
			'graph neural networks',
			'AlphaZero',
			'self-play',
			'max-atom systems',
			'constraint satisfaction',
			'permutation equivariance',
			'HPC'
		],
		artifacts: [
			{
				label: 'StochasticGames',
				href: 'https://github.com/ramizouari/StochasticGames',
				note: 'Agents that play stochastic games on graphs with reinforcement learning — the self-play pipeline, the model, and the mpg library underneath.'
			}
		]
	}
];

export type Publication = {
	title: string;
	/** Vancouver-style author list, in order. */
	authors: string[];
	/** The entry in `authors` that is me, emphasised in the citation. */
	self: string;
	venue: string;
	location: string;
	date: string;
	kind: string;
	code: string;
	status: string;
	href: string;
	topics: string[];
	note: string;
};

export const publications: Publication[] = [
	{
		title:
			'Synthetic patient trajectories from a generative machine-learning model: a framework for generating population-adjusted survival outcomes in chronic lymphocytic leukaemia',
		authors: [
			'Munir T',
			'Sportoletti P',
			'Mohseninejad L',
			'Opat S',
			'Chebuniaev I',
			'Aballea S',
			'Zouari R',
			'Kreif N',
			'Toumi M',
			'Lefebure M',
			'Williams R',
			'Xu S',
			'Frustaci AM',
			'Ysebaert L',
			'Shadman M'
		],
		self: 'Zouari R',
		venue: 'ISPOR Europe 2026',
		location: 'Vienna, Austria',
		date: 'November 2026',
		kind: 'Poster presentation',
		code: 'MSR91',
		status: 'Accepted',
		href: 'https://www.ispor.org/heor-resources/presentations-database/presentation-cti/ispor-europe-2026/poster-session-2-5/synthetic-patient-trajectories-from-a-generative-machine-learning-model-a-framework-for-generating-population-adjusted-survival-outcomes-in-chronic-lymphocytic-leukaemia',
		topics: ['Methodological & statistical research', 'Machine learning', 'Oncology'],
		note: 'The COMPASS work: a latent ODE generative model with survival-aware components, combined with constrained optimal transport for population adjustment, generating synthetic patient trajectories to support population-adjusted indirect treatment comparisons and external control arms.'
	}
];

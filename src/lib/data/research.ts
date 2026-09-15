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
		slug: 'jump-odes',
		index: '01',
		title: 'Latent jump ODEs',
		kicker: 'Continuous-time generative models that are allowed to break',
		period: '2025 — 2026',
		context: 'InovIntell · COMPASS',
		signature: String.raw`\mathrm{d}y = f\,\mathrm{d}t + h\,\mathrm{d}N`,
		abstract: `A patient trajectory is not smooth. Treatment lines start and stop, adverse events fire,
			the patient dies. A neural ODE integrates a smooth vector field and cannot express any of that.
			The fix is to integrate a state that follows an ODE between isolated instants and is displaced
			discontinuously at those instants — an augmented jump SDE with no diffusion term, which is
			exactly a latent jump ODE. I designed the model and extended a differentiable solver to
			integrate it, detect its events, and backpropagate through them.`,
		equations: [
			{
				tex: String.raw`\mathrm{d}y(t) \;=\; f\big(t, y(t)\big)\,\mathrm{d}t \;+\; \sum_{k=1}^{K} h_k\big(t, y(t^-)\big)\,\mathrm{d}N_k(t)`,
				caption:
					'The state follows a learned vector field between events, and is displaced by a learned jump map when stream k fires. Solutions are taken càdlàg, so the value reported at an event time is the state after the jump.'
			},
			{
				tex: String.raw`y = (z, \Lambda) \in \mathbb{R}^{L} \times \mathbb{R}^{K}, \qquad G(t,y) \;=\; y + P^{\top} h\big(t, Py\big)\,\mathrm{d}N`,
				caption:
					'Only the latent block z may jump. A cumulative hazard that jumped would no longer be the integral of anything and S(t) = exp(−Λ(t)) would stop meaning anything, so the jump is scattered through a coordinate projection P rather than applied to the whole state.'
			},
			{
				tex: String.raw`\mathrm{d}\Lambda_{\mathcal{L}_{s,i}} \;=\; [\,m_\dagger = 0\,]\cdot[\,m_\ominus = 1\,]\cdot[\,c = i-1\,]\cdot g_{\mathcal{L}_{s,i}}\big(\chi(t), t\big)\,\mathrm{d}t`,
				caption:
					'Each event channel carries a gate. A line of therapy can only start if the patient is alive, currently off treatment, and has started exactly i−1 lines — the bookkeeping is part of the state, not of the training loop.'
			}
		],
		points: [
			{
				heading: 'The augmented state carries its own bookkeeping',
				body: `Alongside the free latent block sits the frozen baseline conditioning, normalised time,
					a line counter, a belief over the regimen in force living in the simplex, an off-treatment
					mask and a death mask. Structure that would otherwise be enforced by post-hoc filtering is
					instead unrepresentable.`
			},
			{
				heading: 'Order-preserving integration across events',
				body: `An event that lands mid-step destroys the accuracy of the underlying Runge–Kutta method
					unless the step is cut at the event time. Multistep solvers additionally have to be restarted:
					their history is no longer a history of the same function.`
			},
			{
				heading: 'Adjoints through a non-invertible jump map',
				body: `Constant-memory backpropagation runs the adjoint backwards through the solution. A jump
					map that cannot be inverted breaks the usual argument — the reverse pass has to be told where
					the events were and how to transport the adjoint across each one.`
			},
			{
				heading: 'Two mechanisms: replay at training, generate at sampling',
				body: `Training conditions on the events that were actually observed and replays them at their
					recorded times. Sampling has no such record, so the same model runs against a stochastic
					mechanism that draws its own event times from the hazards it is integrating — the coupled
					case, where every channel competes over the same clock.`
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
		index: '02',
		title: 'Survival latent ODEs',
		kicker: 'Put the hazard inside the state, and the likelihood becomes computable',
		period: '2025 — 2026',
		context: 'InovIntell · COMPASS',
		signature: String.raw`S(t) = e^{-\Lambda(t)}`,
		abstract: `A latent ODE gives you a trajectory. It does not give you a likelihood over event
			times, and without one there is nothing to train a survival model against. The fix is to stop
			treating the cumulative hazard as something computed after the fact and make it part of the
			integrated state, so the solver produces it to the same order of accuracy as the latent
			trajectory itself — and everything downstream, the log-likelihood, the censoring, the survival
			curve, follows from a quantity the model actually owns.`,
		equations: [
			{
				tex: String.raw`\frac{\mathrm{d}}{\mathrm{d}t}\begin{pmatrix} z \\ \Lambda \end{pmatrix} = \begin{pmatrix} f_\theta(z) \\ h_\theta(z) \end{pmatrix}`,
				caption:
					'The state handed to the solver is the pair (z, Λ), started at Λ(0) = 0. The hazard head is literally the derivative of the cumulative hazard, held non-negative by a softplus — so Λ is non-decreasing and S(t) = exp(−Λ(t)) is a survival function by construction rather than by hope.'
			},
			{
				tex: String.raw`\ell \;=\; \begin{cases} -\log h(T) + \Lambda(T), & \text{event at } T \\[2pt] \Lambda(C), & \text{censored at } C \end{cases}`,
				caption:
					'An observed event contributes its log-intensity plus the hazard accumulated up to it; a censored observation contributes only what accumulated before follow-up ended. Treating the two the same is the standard way to bias a survival model, and the loss refuses to.'
			},
			{
				tex: String.raw`\mathcal{L} \;=\; \lVert M \odot (x - \hat{x}) \rVert^2 \;+\; \beta\, D_{\mathrm{KL}}\!\big(q \,\Vert\, p\big) \;+\; \lambda\, \ell_{\text{surv}}`,
				caption:
					'The survival term enters the ELBO with its own weight, alongside a reconstruction masked by M so that it only scores observations that were actually made.'
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
				body: `Most patients have not had the event when follow-up ends. The likelihood locates a
					stopping index per instance — first event, first censoring mark, or the last step — and
					integrates to there; an event coinciding with a censoring mark is suppressed and the
					observation treated as censored, because that is what it is.`
			},
			{
				heading: 'Terminal and recurrent channels',
				body: `The hazard vector is not one number. It splits into terminal channels, which are
					absorbing and admit at most one event per trajectory, and recurrent channels for adverse
					events that can fire repeatedly. They need different likelihood treatment, and the model
					carries the split explicitly rather than collapsing everything into a single time-to-event.`
			},
			{
				heading: 'Masking, all the way down',
				body: `Clinical data is missing in patterns that mean something. Masked reductions, mask
					broadcasting and a masked ELBO make "not observed" propagate correctly through
					normalisation, reconstruction and the survival term — so an absent measurement contributes
					nothing rather than contributing a zero.`
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
		index: '03',
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
		slug: 'reinforcement-learning',
		signature: String.raw`a_t=\operatorname{clip}\!\left(s_t\,\sigma^{\star}/\hat\sigma_t,\,-1,\,1\right)`,
		index: '04',
		title: 'A dimensionless trading agent',
		kicker: 'What a policy can learn from hourly prices, and what the fees take back',
		period: '2026 — present',
		context: 'RobotBulls',
		abstract: `A trading agent is an easy thing to build badly. and the one I inherited had been: a
			240 000-parameter Q-network trained on 159 bars per fold, fed prices in dollars through a scaler
			refit every week, trading 55 times a week with no directional skill. The redesign starts from the
			inputs — every feature invariant to the price, volume and volatility level — and works up: a
			35 000-parameter recurrent PPO agent that emits conviction rather than exposure, risk that enters
			as sizing and objective rather than as a veto, pre-training on seven years of history under a
			frozen evaluation calendar, and a post-mortem that traced the first full run's loss to turnover
			and fixed it at the source. Then the same loop, run against the exchange.`,
		equations: [
			{
				tex: String.raw`\mathrm{mom}_k=\frac{\ln\left(c_t/c_{t-k}\right)}{\hat\sigma_t\sqrt{k}},\qquad x\leftarrow\operatorname{clip}_{\pm 5}\!\left(1.349\,\frac{x-\operatorname{med}}{\operatorname{IQR}}\right)`,
				caption:
					'A momentum feature is a t-statistic, not a price difference: divide the log-return by the volatility over its horizon and it means the same thing in a calm market and a turbulent one. The second stage — one robust affine map fitted on data strictly before the first evaluated bar, stored in the checkpoint, never refit — is what lets a chain of checkpoints share an input space.'
			},
			{
				tex: String.raw`\begin{aligned}a_t&=\operatorname{clip}\!\left(s_t\,\sigma^{\star}/\hat\sigma_t,\,-1,\,1\right)\\ r_t&=\Delta\ln W_t-\tfrac{\lambda}{2}\left(\Delta\ln W_t\right)^{2}-\beta\,\big(\mathrm{DD}_t-\mathrm{DD}_{\mathrm{tol}}\big)_{+}-\kappa\,\lvert\Delta a_t\rvert\end{aligned}`,
				caption:
					'The actor emits a conviction s ∈ [−1, 1]; a deterministic sizer turns it into exposure at constant risk per unit of conviction, so the same output means the same thing in every volatility regime. The reward is the second-order expansion of a CARA utility with a drawdown penalty and — added by the post-mortem — a turnover term priced in fee units. PPO scores the signal; the environment consumes the action.'
			},
			{
				tex: String.raw`\mathrm{SR}_{\mathrm{gross}}\;\approx\;\mathrm{IC}\sqrt{N}\;\approx\;0.05\sqrt{365}\;\approx\;1,\qquad \frac{2f}{\hat\sigma_{1\mathrm{h}}}\approx 0.27`,
				caption:
					'The fundamental law bounds what the signal can pay. An information coefficient of 0.05 at a daily horizon is a gross Sharpe of order one — if and only if the policy trades at that cadence. A round trip at 10 bp costs 0.27 hourly standard deviations, so rebalancing every hour spends roughly 40 % a year chasing 5.6 % of gross edge. That arithmetic is what v1 lost to.'
			}
		],
		points: [
			{
				heading: 'Units are the leak',
				body: `Raw closes, moving averages and MACD in price units, a StandardScaler refit on each fold's
					own slice: fold 36's scaler maps 2 400 to zero, fold 76's maps 4 000, and a checkpoint chained
					across them inherits weights trained in an input space that no longer exists. The 42
					replacement features come from four sanctioned families — log ratios, relative deviations,
					volatility scaling, bounded ranks — and a test rescales price and volume together and requires
					every feature unchanged to 1e-6.`
			},
			{
				heading: 'Capacity, history, and a calendar that is data',
				body: `1 514 parameters per training bar is not fixed by a better algorithm. The model shrinks to
					a GRU-64 trunk with actor, critic, auxiliary and quantile heads, and the data grows: 49 332
					bars of history before the first evaluated bar, a second asset as a cross-asset regulariser
					with the other asset's columns stripped by assertion, then KL-anchored fine-tuning fold by
					fold. The 65 test slices are shipped as a CSV, so no hyper-parameter can move the evaluation
					set.`
			},
			{
				heading: 'Conviction, not exposure',
				body: `The observation carries the portfolio, so a replayed transition encodes a state the current
					policy would never reach — off-policy replay is off-support here, and decorrelation moves to
					window sampling across 64 lanes instead. PPO is made recurrent by minibatching over lanes
					with time intact, and the loss is pointed at the sampled signal while the environment consumes
					the sized action. Auxiliary heads regress the next-day return and volatility in σ units — a
					supervision two orders of magnitude denser than the reward.`
			},
			{
				heading: 'It lost on turnover, not direction',
				body: `v1's mean fold return was −0.70 %; its fees were 1.13 %. Gross of costs it was positive, its
					allocation correlated 0.003 with the next return, and its fine-tuning was inert — fold returns
					with and without it correlated 0.985, because early stopping on one noisy validation episode
					selected almost no training. Three levers with a mechanism behind them — a turnover penalty,
					an EMA of the conviction signal, a drawdown gate inside the sizer — cut trades from 55 to 14 a
					week and moved the tiled Sharpe from −1.0 to about 2 across seeds. Deflated for the ~25 arms
					tried, no single Sharpe is significant; what survives is that every smoothed configuration is
					positive on every seed, and 1.16 years of hourly data cannot say more than that.`
			},
			{
				heading: 'The walk-forward loop, with the market in it',
				body: `Live inference is not a port of the agent into a bot. It is the library's own evaluation
					loop with three substitutions: bars arrive from the feed, the account API is the ledger — read
					every hour, never evolved — and the trade the environment plans goes to the venue instead of
					filling at the next open. Parity with the backtest is by construction and tested to the
					digit: a maximum action difference of 7e-7 over a scored slice. Shadow first, with a nightly
					replay as the oracle; then paper fills; then size.`
			}
		],
		keywords: [
			'recurrent PPO',
			'TorchRL',
			'volatility targeting',
			'dimensionless features',
			'walk-forward',
			'deflated Sharpe',
			'live trading'
		],
		artifacts: [
			{
				label: 'rl_notebooks',
				note: 'The rl_trading library: the environment family, dimensionless features and the frozen normaliser, recurrent PPO with auxiliary heads, pre-training and walk-forward drivers, the live loop — and the design, post-mortem and feasibility documents behind each.'
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

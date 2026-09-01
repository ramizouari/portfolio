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
		signature: String.raw`\mathrm{d}y = f\,\mathrm{d}t + h\,\mathrm{d}N`,
		index: '01',
		title: 'Latent jump ODEs',
		kicker: 'Continuous-time generative models that are allowed to break',
		period: '2025 — present',
		context: 'InovIntell · COMPASS',
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
					'Only the latent block z may jump. The cumulative hazard Λ must stay the integral of something, so the jump is scattered through a coordinate projection P rather than applied to the whole state.'
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
				heading: 'Survival is a first-class citizen',
				body: `Hazard heads, right-censoring, masked normalisation and an ELBO with a survival term let
					the same model be scored against Kaplan–Meier curves rather than only against marginals.`
			}
		],
		keywords: [
			'neural ODE',
			'jump processes',
			'càdlàg',
			'adjoint sensitivity',
			'survival analysis',
			'variational inference'
		],
		artifacts: [
			{
				label: 'torchdiffeq — jump ODE fork',
				href: 'https://github.com/ramizouari/torchdiffeq',
				note: 'Jump mechanism, event detection, multistep restart and adjoint support added on top of the reference differentiable ODE solver.'
			},
			{
				label: 'multinode',
				note: 'VAE building blocks: hazard heads, censoring, masking, ODE customisation.'
			},
			{
				label: 'synthetic_multinode',
				note: 'Training, experiments and the phase-3 model specification.'
			}
		]
	},
	{
		slug: 'optimal-transport',
		signature: String.raw`\inf_{\gamma \in \Gamma(\mu,\nu)} \int c\,\mathrm{d}\gamma`,
		index: '02',
		title: 'Constrained optimal transport',
		kicker: 'Moving a population onto statistics you can read, but data you cannot',
		period: '2025 — present',
		context: 'InovIntell · COMPASS',
		abstract: `Comparing two clinical trials indirectly means making their populations comparable. You have
			individual patient-level data for one trial and, for the other, only what was published: a mean,
			a standard deviation, a proportion above a threshold, a few quantiles. The question is how to move
			the source population so that it matches those numbers while disturbing its joint structure as
			little as possible. That is an optimal transport problem with marginal constraints that are
			themselves partial — and it decomposes into a small taxonomy of solvable variants.`,
		equations: [
			{
				tex: String.raw`\mathcal{L}(\mu,\nu,c) \;=\; \inf_{\gamma \in \Gamma(\mu,\nu)} \iint_{\mathcal{X}\times\mathcal{Y}} c(x,y)\,\mathrm{d}\gamma(x,y)`,
				caption:
					'Kantorovich’s formulation. Every variant below descends from it; they differ in the constraint structure on ν, the cost, and whether entropy is added.'
			},
			{
				tex: String.raw`c(x,y) = \sum_k c_k(x_k,y_k) \;\Longrightarrow\; \mathcal{L} = \sum_k \mathcal{L}_k`,
				caption:
					'An additively separable cost makes the mixed transport problem decompose per variable — which is what makes a per-variable specification well posed rather than a heuristic.'
			},
			{
				tex: String.raw`T(x) \;=\; \sqrt{v^{\nu} \oslash v^{\mu}} \odot \big(x - m^{\mu}\big) + m^{\nu}, \qquad T = F_\nu^{-1} \circ F_\mu`,
				caption:
					'Closed forms where they exist: the affine map is optimal when only a mean and a variance are published; the monotone rearrangement when a quantile function can be reconstructed.'
			}
		],
		points: [
			{
				heading: 'A taxonomy, not a bag of tricks',
				body: `The problem splits along two axes — the decomposition structure (unconditional, conditional
					with fixed strata, conditional with flexible strata) and the variable type together with which
					target statistics are actually available. Eight variants cover the space, each with its own
					derivation and solution method: closed form, linear program, or Sinkhorn.`
			},
			{
				heading: 'Partial information is the normal case',
				body: `A published table rarely gives a full marginal. It gives a threshold proportion, or a single
					quantile, or an integer count. Those become constraints on ν rather than a specification of it,
					and the transport problem is solved subject to them — a convex QP for overlapping bins, a global
					shift for a single threshold, a two-stage max-entropy construction for integer counts.`
			},
			{
				heading: 'Conditioning that is allowed to move',
				body: `When a stratifying variable such as the treatment arm is itself shifted by the transport,
					fixed-strata decomposition is wrong. The flexible-strata variant solves an outer LP over strata
					pairs whose costs are the inner mixed-transport optima.`
			},
			{
				heading: 'Constraints are checked, not assumed',
				body: `Every transport reports whether the constraints it was given were actually met, and
					over-determined specifications are prioritised explicitly rather than silently.`
			}
		],
		keywords: [
			'optimal transport',
			'Kantorovich duality',
			'Sinkhorn',
			'linear programming',
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
		signature: String.raw`\mathrm{d}W_t = S_t\,\mathrm{d}P_t - \alpha P_t \lvert \mathrm{d}S_t \rvert`,
		index: '03',
		title: 'Reinforcement learning under non-stationarity',
		kicker: 'Agents that trade, and the derivations that keep them honest',
		period: '2026 — present',
		context: 'RobotBulls',
		abstract: `A trading agent is an easy thing to build badly. The reward is noisy, the environment is
			non-stationary, and almost every plausible design decision quietly biases the policy toward doing
			nothing. I approached it from the other end: build the instrument before the experiment — one
			environment core, indicators that behave identically in backtest and live, learners that keep
			learning — then derive the wealth process properly, choose an action space with the invariances
			you actually want, and treat pathological behaviour as a diagnosable defect rather than a
			hyper-parameter to tune.`,
		equations: [
			{
				tex: String.raw`\mathrm{d}W_t \;=\; \mathrm{d}C_t + P_t\,\mathrm{d}S_t + S_t\,\mathrm{d}P_t + \mathrm{d}[S,P]_t, \qquad [S,P]_t = 0 \ \text{a.s.}`,
				caption:
					'Wealth as a semimartingale. Because the agent acts on discrete steps, its position is a finite-variation jump process, so the quadratic covariation with the price vanishes — and the PnL formula follows rather than being asserted.'
			},
			{
				tex: String.raw`\mathrm{d}C_t \;=\; -P_t\,\mathrm{d}S_t \;-\; \alpha\,P_t\,\lvert \mathrm{d}S_t \rvert \quad\Longrightarrow\quad \mathrm{d}W_t = S_t\,\mathrm{d}P_t - \alpha P_t \lvert \mathrm{d}S_t\rvert`,
				caption:
					'Fees and linear slippage enter through the total variation of the position, which is what makes over-trading costly in the model rather than only in reality.'
			},
			{
				tex: String.raw`R_t \;=\; \ln\frac{W_t}{W_{t-1}} \;+\; \lambda_{\text{trade}} \min\big(\tau_t^2, f_{\text{inc}}^2\big) \;-\; \lambda_{\text{risk}}\,\text{risk}_t \;+\; R^{\text{bankruptcy}}_t`,
				caption:
					'Log-return, a capped incentive to actually take positions, an explicit risk penalty, and an absorbing bankruptcy term.'
			}
		],
		points: [
			{
				heading: 'One environment core, two stacks',
				body: `The trading environment is implemented against a shared core and exposed twice — as a
					Gymnasium environment and as a TorchRL environment — so market, portfolio, reward and window
					logic live in one place. The TorchRL side is tensorised: batched lanes stepped together on
					device, with stacked-frame transforms and a nested parallel layout that fits the process
					budget the hardware actually has.`
			},
			{
				heading: 'Indicators that do not lie between backtest and live',
				body: `The same indicator has to be computable one observation at a time when the agent is
					stepping, and eagerly over a fixed history when it is being backtested. Both modes sit behind
					one interface with a shared warm-up contract, so a group can mix them; a torch-native batched
					implementation carries per-lane readiness and replay cursors, and is tested on CUDA.`
			},
			{
				heading: 'Scale-invariant, symmetric actions',
				body: `Actions are a signed fraction of gross market value rather than a share count. The agent
					learns capital allocation, behaves consistently across account sizes, treats long and short
					symmetrically, and gets "do nothing" for free at zero.`
			},
			{
				heading: 'Diagnosing a policy that refuses to trade',
				body: `Sparse trading and a persistent short bias turned out not to be a market fact but six
					separate defects: exploration that sampled an action and then discarded it, replay that stored
					the post-gate action instead of the model’s decision, a reward computed against a different
					action than the one being trained on, an epsilon schedule that collapsed inside one episode,
					auxiliary models reset every episode, and ensemble weights updated from the ensemble’s own output.`
			},
			{
				heading: 'Risk as a gate, and learners that keep learning',
				body: `A risk network gates action selection ahead of the policy, so risk aversion is a property
					of the acting agent rather than a coefficient the return can learn to pay off. Alongside it,
					online supervised learners carry their own buffers and preprocessors, so the auxiliary
					predictors adapt with the policy instead of being frozen before it.`
			}
		],
		keywords: [
			'reinforcement learning',
			'TorchRL',
			'semimartingales',
			'DQN',
			'ensembles',
			'regime detection',
			'online learning'
		],
		artifacts: [
			{
				label: 'rl_notebooks',
				note: 'Risk-aware ensemble agents, online preprocessors, replay buffers, trainers, and a C++23 header-only synthetic market generator.'
			},
			{
				label: 'Crypto-RL',
				note: 'The mathematical framework, PnL derivation and architecture review that the environment is built from.'
			}
		]
	},
	{
		slug: 'games-on-graphs',
		signature: String.raw`\nu(v) = \sup_{\sigma}\ \inf_{\tau}\ \bar{w}(\sigma,\tau)`,
		index: '04',
		title: 'Learning to solve games on graphs',
		kicker: 'Mean-payoff games, exact solvers, and self-play',
		period: '2023',
		context: 'TU Dresden · Master thesis',
		abstract: `Mean-payoff games sit in NP ∩ co-NP with no known polynomial algorithm — a rare and
			interesting place. The thesis asked whether a graph neural network trained by self-play can learn
			the optimal strategy, using exact solvers as ground truth. That required building all three pieces:
			the sampler, the solver, and the learner.`,
		equations: [
			{
				tex: String.raw`\nu(v) \;=\; \sup_{\sigma}\ \inf_{\tau}\ \liminf_{n\to\infty} \frac{1}{n}\sum_{i=0}^{n-1} w\big(e_i\big)`,
				caption:
					'The value of a vertex: the long-run average weight the maximiser can guarantee against any strategy of the minimiser. Positional strategies suffice, which is what makes the target learnable.'
			}
		],
		points: [
			{
				heading: 'Generate, then annotate',
				body: `A fast C++ graph sampler produces the game instances; fully optimised exact solvers label
					them with the true values and optimal positional strategies.`
			},
			{
				heading: 'AlphaZero on a graph',
				body: `A graph neural network policy trained by self-play, distributed across an HPC cluster with
					gRPC and FastAPI connecting actors, learner and replay buffer under SLURM.`
			}
		],
		keywords: ['graph neural networks', 'AlphaZero', 'self-play', 'game theory', 'HPC'],
		artifacts: [
			{
				label: 'StochasticGames',
				href: 'https://github.com/ramizouari/StochasticGames',
				note: 'Agents that play stochastic games on graphs with reinforcement learning.'
			}
		]
	}
];

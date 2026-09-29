/**
 * A curated set of the problems I have written for contests. Each one carries
 * the statement as posed, and the solution reduced to the ideas that actually
 * carry it — not a full editorial.
 *
 * The `tex` fields are rendered by KaTeX at build time; see
 * `src/routes/problems/[slug]/+page.server.ts`.
 */

export type Idea = {
	title: string;
	body: string;
	/** One display equation, kept short enough to survive a 390px column. */
	tex?: string;
};

export type Problem = {
	slug: string;
	index: string;
	title: string;
	contest: string;
	year: string;
	/** Present only where the contest actually ran divisions. */
	division?: string;
	/** One line, shown on the card. */
	kicker: string;
	/** The equation that identifies the problem, shown on the card. */
	signature: string;
	tags: string[];
	/** The problem as posed, minus the story. */
	statement: string[];
	constraints: string[];
	/** What is really being asked, once the statement is stripped. */
	reduction: string;
	ideas: Idea[];
	complexity: string;
	/** Present when the set shipped more than one version. */
	variants?: { label: string; note: string }[];
	/** The sources, where the contest repository is public. */
	repo?: string;
	/** Where the problem can be solved, when the judge is public. */
	judge?: { label: string; href: string }[];
};

const WC4 = 'https://github.com/ramizouari/WinterCup4';
const WC5 = 'https://github.com/ramizouari/WinterCup5';
const WC6 = 'https://github.com/YessineJallouli/WinterCup6';
const VCC = 'https://github.com/YessineJallouli/VertexCoverContest-1';

/* The Codeforces mirrors. The WinterCup editions live in the group; the two
   most recent ones are public gyms. */
const CF4 = 'https://codeforces.com/group/MAbng8L9pC/contest/368038/problem';
const CF5 = 'https://codeforces.com/group/MAbng8L9pC/contest/426194/problem';
const CF6 = 'https://codeforces.com/group/MAbng8L9pC/contest/479486/problem';
const CF7 = 'https://codeforces.com/gym/594190/problem';
const CF8 = 'https://codeforces.com/gym/106415/problem';

export const problems: Problem[] = [
	{
		slug: 'expected-iterations',
		index: '01',
		title: 'Expected Iterations',
		contest: 'WinterCup 5.0',
		year: '2023',
		kicker: 'A loop that halts with probability one — but after how many turns?',
		signature: String.raw`\mathbb{E}[X_n]=\frac{n-\sum_{d\mid n,\ d<n}\varphi(d)\,\mathbb{E}[X_d]}{n-\varphi(n)}`,
		tags: ['Probability', 'Number theory', 'Dirichlet sieve'],
		statement: [
			`Fix a positive integer $n$. Start with $R = 1$ and a counter $k = 0$, and repeat while
			 $R \\bmod n \\neq 0$: draw $a$ uniformly from $\\{0, \\dots, n-1\\}$, set $R \\leftarrow R \\cdot a$,
			 and increment $k$.`,
			`Report the expected value of $k$ — the number of iterations the loop performs.`
		],
		constraints: ['1 ≤ T ≤ 10⁶ queries', '1 ≤ n ≤ 10⁶'],
		reduction:
			'A million queries against a million values of n, so the per-query answer has to be a table lookup. The whole problem is finding a recurrence that a sieve can fill.',
		ideas: [
			{
				title: 'One draw collapses the modulus',
				body: `After multiplying by $a$, what remains is the condition $R \\equiv 0$ modulo
				 $m = n/\\gcd(n,a)$. Reduction $\\mathbb{Z}/n \\to \\mathbb{Z}/m$ is a ring homomorphism, and it
				 pushes the uniform distribution forward to the uniform distribution — every fibre has the
				 same size $n/m$. So the rest of the run is distributed exactly like a fresh run with
				 parameter $m$, not merely similar to one.`,
				tex: String.raw`\mathbb{E}[X_n \mid a] = \mathbb{E}\!\left[X_{n/\gcd(n,a)}\right] + 1`
			},
			{
				title: 'Group the draws by their gcd',
				body: `The number of $a \\in \\{0,\\dots,n-1\\}$ with $\\gcd(a,n) = d$ is $\\varphi(n/d)$, so
				 averaging over $a$ turns into a divisor sum. Re-indexing by $e = n/d$ puts it in its
				 useful form.`,
				tex: String.raw`\mathbb{E}[X_n]=1+\frac{1}{n}\sum_{d\mid n}\varphi(d)\,\mathbb{E}[X_d]`
			},
			{
				title: 'The self-reference is the point',
				body: `The $d = n$ term on the right is $\\mathbb{E}[X_n]$ itself — it is the case
				 $\\gcd(a,n)=1$, where multiplying by a unit changes nothing. Move it to the left and
				 divide. This is well defined for $n \\geq 2$ because $\\varphi(n) < n$, and the base case is
				 $\\mathbb{E}[X_1] = 0$.`,
				tex: String.raw`\mathbb{E}[X_n]=\frac{n-\sum_{d\mid n,\ d<n}\varphi(d)\,\mathbb{E}[X_d]}{n-\varphi(n)}`
			},
			{
				title: 'Fill the table by divisor sieve',
				body: `Walking multiples of every $d$ up to $L$ is a harmonic sum, so the whole table costs
				 $\\mathcal{O}(L \\log L)$ and every query is then $\\mathcal{O}(1)$. Totients come from the
				 same sieve.`
			}
		],
		complexity: 'O(L log L) precomputation, O(1) per query',
		repo: WC5,
		judge: [{ label: 'WinterCup 5.0 · F', href: `${CF5}/F` }]
	},

	{
		slug: 'simulation',
		index: '02',
		title: 'Simulation',
		contest: 'WinterCup 4.0',
		year: '2022',
		kicker: 'Balls into bins, except someone already showed you the first few bins.',
		signature: String.raw`\mathbf{A}\sim\mathcal{M}\!\left(m,\,n,\,\tfrac{1}{n}\mathbf{1}_n\right)`,
		tags: ['Probability', 'Multinomial', 'Modular arithmetic'],
		statement: [
			`An array $A$ of $n$ zeros. Repeat $m$ times: pick $k$ uniformly from $\\{1,\\dots,n\\}$ and
			 increment $A_k$.`,
			`You are told the final values of the first $s$ cells, $A_1, \\dots, A_s$. Output the
			 probability that every cell of $A$ is strictly less than $K$, as $p \\cdot q^{-1}$ modulo
			 $10^9+7$.`
		],
		constraints: ['1 ≤ n, m ≤ 300', '0 ≤ K ≤ 10⁶', '0 ≤ s ≤ n', 'ΣAᵢ ≤ m'],
		reduction:
			'The counts are multinomial with equal cell probabilities, so conditioning on a prefix leaves a smaller instance of the same question: the CDF of the maximum of a uniform multinomial.',
		ideas: [
			{
				title: 'Conditioning costs nothing',
				body: `Given the first $s$ cells, the remainder is again multinomial — with
				 $n' = n - s$ cells and $m' = m - \\sum_{i \\leq s} A_i$ draws. If any revealed $A_i \\geq K$ the
				 answer is $0$; otherwise it is $\\mathcal{P}(X(n', m') < K)$ and the given values never
				 appear again.`
			},
			{
				title: 'Peel one bin at a time',
				body: `The marginal count of a single cell is binomial, which is what lets the recursion
				 step one cell at a time rather than reasoning about the joint distribution.`,
				tex: String.raw`\mathcal{P}(A_n=j)=\binom{m}{j}\frac{(n-1)^{m-j}}{n^{m}}`
			},
			{
				title: 'Complement, so the recursion closes',
				body: `Write $p_{n,m}$ for $\\mathcal{P}(\\max \\geq K)$. Splitting on the last cell's count $j$,
				 every $j \\geq K$ contributes its full probability at once, and the terms $j < K$ recurse
				 into $n-1$ cells. Summing the binomial over all $j$ gives $1$, which folds both halves into
				 a single sum.`,
				tex: String.raw`p_{n,m}=1-\sum_{j=0}^{K-1}\binom{m}{j}\frac{(n-1)^{m-j}}{n^{m}}\bigl(1-p_{n-1,\,m-j}\bigr)`
			},
			{
				title: 'Two cuts, and no floating point',
				body: `$K > m$ makes the probability $0$ outright, and $j$ never exceeds $\\min(K-1,m)$, so
				 the stated $K \\le 10^6$ never costs anything. Working in $\\mathbb{Z}/(10^9+7)$ — inverses by
				 Fermat — also removes the catastrophic cancellation that the \`long double\` version of this
				 same formula suffers from as $n$ grows.`
			}
		],
		complexity: 'O(n·m·min(K, m))',
		repo: WC4,
		judge: [{ label: 'WinterCup 4.0 · B', href: `${CF4}/B` }]
	},

	{
		slug: 'splitting-game',
		index: '03',
		title: 'Splitting Game',
		contest: 'WinterCup 5.0',
		year: '2023',
		kicker: 'Remove one number, then invent as many smaller ones as you like.',
		signature: String.raw`G_m = 2^{\,m-1}`,
		tags: ['Combinatorial game theory', 'Sprague–Grundy', 'XOR'],
		statement: [
			`A turn-based game on an array $A$. A move is: choose some $A_k > 0$ and delete it, then
			 append any multiset $B$ — possibly empty, possibly enormous — whose elements are all
			 strictly less than $A_k$.`,
			`Normal play: a player who cannot move loses. Both play optimally. Who wins?`
		],
		constraints: ['1 ≤ n ≤ 2·10⁵', '0 ≤ Aᵢ ≤ 10¹⁸'],
		reduction:
			'An impartial game under normal play, so Sprague–Grundy applies and the array is the XOR of its entries. The difficulty is that a single pile has infinitely many moves.',
		ideas: [
			{
				title: 'Even multiplicities vanish, so the move set is finite',
				body: `XOR is an involution: a value appearing an even number of times contributes nothing.
				 What a move from a pile of size $m$ can reach is therefore not an arbitrary multiset but
				 exactly an arbitrary *subset* of $\\{0,\\dots,m-1\\}$ — the values it leaves with odd
				 multiplicity. That turns an infinite mex into a finite one.`,
				tex: String.raw`G_m=\operatorname*{mex}_{S\subseteq\{0,\dots,m-1\}}\ \bigoplus_{k\in S}G_k`
			},
			{
				title: 'The Grundy values are powers of two',
				body: `By induction, $G_0 = 0$ and $G_k = 2^{k-1}$ for $k \\geq 1$. Once the values are
				 distinct powers of two, XOR over a subset is ordinary addition, and $S \\mapsto \\sum_{k \\in S}
				 2^{k-1}$ is a bijection from the subsets of $\\{1,\\dots,m-1\\}$ onto
				 $\\{0,\\dots,2^{m-1}-1\\}$. The mex of a full initial segment is its size.`,
				tex: String.raw`\operatorname*{mex}\left\{\sum_{k\in S}2^{k-1}\ :\ S\subseteq\{1,\dots,m-1\}\right\}=2^{m-1}`
			},
			{
				title: 'Which makes the answer a parity check',
				body: `Because the values are independent powers of two, their XOR is zero if and only if
				 every non-zero value occurs an even number of times. The first player wins exactly when
				 some non-zero value has odd multiplicity — and the winning move is explicit: take the
				 largest such value, pad the array back to all-even, then mirror the opponent forever.`
			},
			{
				title: 'The 10¹⁸ bound is a bluff',
				body: `No Grundy value is ever computed. $2^{m-1}$ for $m$ up to $10^{18}$ is not
				 representable and does not need to be: only the multiplicity parities matter, so the
				 solution is a map from value to count.`
			}
		],
		complexity: 'O(n log n)',
		repo: WC5,
		judge: [{ label: 'WinterCup 5.0 · K', href: `${CF5}/K` }]
	},

	{
		slug: 'bijection-count',
		index: '04',
		title: 'Bijection Count',
		contest: 'WinterCup 5.0',
		year: '2023',
		kicker: 'Count the integer matrices that stay injective after reduction mod m.',
		signature: String.raw`\lvert\mathrm{GL}_n(\mathbb{Z}/m)\rvert=m^{\binom{n}{2}}\prod_{i=1}^{n}\Psi(i,m)`,
		tags: ['Abstract algebra', 'Modules over Z/m', 'Multiplicative functions'],
		variants: [
			{ label: 'Normal', note: 'Dimension fixed at 2, with m ≤ 10⁶ and up to 10⁶ queries.' },
			{
				label: 'Hard',
				note: 'Dimension n up to 10⁵ per query, with Σn ≤ 2·10⁶ — the table you would want no longer fits.'
			}
		],
		statement: [
			`A linear map $T$ sends the integer point $(i,j)$ to $(ai+bj,\\ ci+dj)$. Its $m$-score is the
			 number of distinct points of $T(\\mathbb{Z}^2)$ once both coordinates are reduced modulo $m$.`,
			`Call $T$ *$m$-good* if its parameters satisfy $0 \\le a,b,c,d < m$ and its $m$-score is
			 maximal among all linear maps. Count the $m$-good transformations modulo $10^9+7$.`,
			`The hard version asks the same question in dimension $n$, for an $n \\times n$ integer matrix.`
		],
		constraints: ['1 ≤ T ≤ 10⁶ queries', '1 ≤ m ≤ 10⁶', 'hard: 1 ≤ n ≤ 10⁵ with Σn ≤ 2·10⁶'],
		reduction:
			'The identity already attains the maximum score mⁿ, so the m-good maps are exactly the invertible ones: the question is the order of GLₙ(Z/m) — a ring that is not a field, where nonzero determinant is not enough.',
		ideas: [
			{
				title: 'Invertible means "columns form a basis"',
				body: `Over $\\mathbb{Z}/m$ a matrix is invertible iff $\\det \\in (\\mathbb{Z}/m)^{\\times}$,
				 equivalently iff its columns are a basis of the free module $(\\mathbb{Z}/m)^n$. So count
				 bases, one column at a time.`
			},
			{
				title: 'Maximal vectors, and a quotient',
				body: `A vector $u$ spans a free rank-one summand iff $\\gcd(u_1,\\dots,u_n,m)=1$; write
				 $\\Psi(n,m)$ for how many such $u$ there are. Pick one, quotient by $\\langle u \\rangle \\cong
				 \\mathbb{Z}/m$, and recurse — every basis of the quotient lifts back in exactly $m^{n-1}$
				 ways, one free choice in $\\ker \\Pi$ per remaining vector.`,
				tex: String.raw`\lvert\mathrm{GL}_n\rvert=m^{\,n-1}\,\Psi(n,m)\,\lvert\mathrm{GL}_{n-1}\rvert`
			},
			{
				title: 'Ψ is a Dirichlet convolution, hence multiplicative',
				body: `Split on $d = \\gcd(u_n, m)$ and reduce the first $n-1$ coordinates mod $d$: the
				 condition on them becomes membership in $S_{n-1,d}$, and the fibre count is a clean power
				 of $m/d$. That is a convolution, and it makes each $\\Psi(n,\\cdot)$ multiplicative — the
				 fact the whole solution rests on. For $n = 2$ this reads
				 $\\lvert\\mathrm{GL}_2\\rvert = m\\,\\varphi(m)\\,\\Psi(2,m)$.`,
				tex: String.raw`\Psi(n,\cdot)=\gamma_{n-1}\star\Psi(n-1,\cdot),\qquad \gamma_s(t)=t^{s}\varphi(t)`
			},
			{
				title: 'The hard version is a memory problem, not a maths one',
				body: `$\\Psi(i,m)$ for every pair $(i,m)$ is far too large to tabulate. Multiplicativity
				 means you never need it: evaluate $\\Psi$ only at prime powers $p^{e} \\le L$, and only up to
				 the largest dimension any query with $p \\mid m$ actually asks for. Each query then
				 reassembles its answer across the $\\omega(m) = \\mathcal{O}(\\log\\log m)$ primes dividing
				 $m$.`
			}
		],
		complexity:
			'Normal: O(L log log L + T) with a linear sieve. Hard: O((L + N log²L)·log log L + T log L)',
		repo: WC5,
		judge: [{ label: 'WinterCup 5.0 · L', href: `${CF5}/L` }]
	},

	{
		slug: 'divisibility-game',
		index: '05',
		title: 'Divisibility Game',
		contest: 'WinterCup 6.0',
		year: '2024',
		kicker: 'Merge two numbers into their sum. Lose when everything is divisible by k.',
		signature: String.raw`\mathcal{G}(C)\neq 0 \iff \text{the first player wins}`,
		tags: ['Combinatorial game theory', 'Grundy values', 'Modular arithmetic'],
		statement: [
			`Two players alternate on an array $a$ of $n$ positive integers, with an odd $k$ fixed in
			 advance. A player facing an array in which every element is divisible by $k$ loses
			 immediately.`,
			`Otherwise the player removes two elements $a_i$ and $a_j$ and appends $a_i + a_j$. The sum of
			 the array is guaranteed to be divisible by $k$. Determine the winner under optimal play.`
		],
		constraints: ['1 ≤ n ≤ 10⁵', '1 ≤ k ≤ 10⁹, odd', '1 ≤ aᵢ ≤ 10⁹'],
		reduction:
			'Everything happens in Z/k, and a move shortens the array by one. The only state that survives is the number of zero residues together with the length — two integers, not an array.',
		ideas: [
			{
				title: 'Collapse the state to two numbers',
				body: `Let $C[0]$ count the elements congruent to $0$ modulo $k$. Nothing about the other
				 residues matters — merging two of them either produces a zero or does not. Each move drops
				 $n$ by one and shifts $C[0]$ by at most one, so the game is a walk on a small grid, and
				 $C[0]$ can be taken modulo $2$.`
			},
			{
				title: 'Guess the Grundy value, then verify it by mex',
				body: `The terminal positions are $C[0] = n$. Everything else falls into four cases on the
				 parity of $n$ and whether $C[0]$ sits at $n-2$ or below, and each is closed under the mex
				 recursion — the induction is a finite case check, not a search.`,
				tex: String.raw`\mathcal{G}=\begin{cases}0 & C[0]=n\\ 1 & C[0]=n-2,\ n \text{ even}\\ 2 & C[0]=n-2,\ n \text{ odd}\\ 1 & C[0]<n-2,\ n \text{ even}\\ 0 & C[0]<n-2,\ n \text{ odd}\end{cases}`
			},
			{
				title: 'Where the oddness of k is spent',
				body: `The mex argument needs, from any position with $C[0] < n-2$, a move that keeps
				 $C[0]$ small — a pair that does *not* merge into a zero. Such a pair always exists
				 precisely because $k$ is odd: $2$ is then a unit, so $2x \\equiv 0$ forces $x \\equiv 0$, and
				 two equal non-zero residues can never cancel. Drop the oddness and the whole case analysis
				 collapses.`
			},
			{
				title: 'The answer is one pass',
				body: `Count residues, read off the case, and the first player wins iff the Grundy value is
				 non-zero. No search, no memoisation, no dependence on the $10^9$ bounds.`
			}
		],
		complexity: 'O(n)',
		repo: WC6
	},

	{
		slug: 'infinite-money-glitch',
		index: '06',
		title: 'Infinite Money Glitch',
		contest: 'WinterCup 6.0',
		year: '2024',
		kicker: 'Arbitrage with transaction fees — so a rate alone tells you nothing.',
		signature: String.raw`W_{u\to v}(x)=r_{u,v}\,\bigl(x-f_{u,v}\bigr)`,
		tags: ['Graphs', 'Bellman–Ford', 'Monotone operators', 'Binary search'],
		variants: [
			{
				label: 'Normal',
				note: 'At most 1000 exchanges — a supremum over walks of bounded length.'
			},
			{
				label: 'Hard',
				note: 'As many exchanges as he likes — the supremum is over every walk.'
			}
		],
		statement: [
			`A market of $n$ currencies and $m$ directed exchanges. Converting an amount $x$ from $u$ to
			 $v$ yields $r_{u,v}(x - f_{u,v})$, and is only permitted when $x \\geq f_{u,v}$ — there must be
			 enough to pay the fee.`,
			`Starting with a borrowed integer amount $y \\leq x$ in currency $0$, find the smallest $y$ from
			 which some sequence of conversions returns to currency $0$ holding strictly more than $y$.
			 Print $-1$ if no such $y$ exists, or if reaching one would take more than $x$.`,
			`The two versions differ only in how long the trading may go on: the normal one allows at most
			 $1000$ exchanges, the hard one any number at all.`
		],
		constraints: [
			'1 ≤ n ≤ 500, 1 ≤ m ≤ 4000',
			'0 ≤ x ≤ 10⁹',
			'0.01 ≤ r ≤ 100, 0 ≤ f ≤ 1000, two decimals',
			'rates along any walk of length ≤ n multiply to at most 10¹⁴'
		],
		reduction:
			'Not a negative-cycle problem. With a fee, whether an edge is worth taking depends on how much money is passing through it — the edge weights are functions, not numbers, and they do not commute with each other.',
		ideas: [
			{
				title: 'Edges are maps; walks are compositions',
				body: `Every edge is the affine map $W(x) = r(x-f)$, and a walk is the composition of its
				 edges' maps in order. What you want is the supremum of that composition over all walks
				 from currency $0$ back to itself — a quantity that has nothing to do with the product of
				 the rates once fees are present.`,
				tex: String.raw`\Phi(x)=\sup_{\Pi\in\mathcal{W}_{0,0}}\bigl(W_{e_\ell}\circ\cdots\circ W_{e_1}\bigr)(x)`
			},
			{
				title: 'Bellman–Ford survives, because every W is non-decreasing',
				body: `Relax $D[v] \\leftarrow \\max\\bigl(D[v],\\, W_{u,v}(D[u])\\bigr)$, sweeping every edge each
				 round. The iterate only ever rises, so it has a pointwise limit, and two inductions squeeze
				 that limit onto $\\Phi$: monotonicity of $W$ lets the lower-bound induction push the
				 hypothesis through the last edge of a walk, and after $k$ rounds the iterate is trivially
				 bounded by the sup over walks of length $\\le k$. The normal version can stop at its cap;
				 the hard one cannot, because the limit may be $+\\infty$ and is then never reached.`
			},
			{
				title: 'Fees make every profitable cycle explode',
				body: `A walk composes to $C(x) = Rx - c$ with $c \\ge 0$, since fees are non-negative. So a
				 cycle is profitable exactly on the half-line $x > c/(R-1)$ — only if $R > 1$ — and once
				 profitable, repeating it diverges. Hence any increase after $|V|-1$ rounds certifies
				 $+\\infty$: the witnessing walk has a cycle, and were it unprofitable, removing it would lose
				 nothing. The half-line is also why negative-cycle detection carries over: a simple path
				 already enters the cycle high enough, so one more round flags a node on every profitable
				 cycle, and everything reachable from a flagged node diverges.`,
				tex: String.raw`C(x)>x\iff x>\frac{c}{R-1},\qquad R>1`
			},
			{
				title: 'The feasibility rule enforces itself',
				body: `Initialising every $D$ at $0$ means an edge whose input is below its fee produces a
				 negative value, which the $\\max$ discards. The "you must be able to pay the fee"
				 constraint therefore needs no explicit check — a pleasant accident of the same
				 monotonicity.`
			},
			{
				title: 'Monotone in the borrowed amount, so binary search',
				body: `That $\\Phi$ is non-decreasing is not enough — $\\Phi(y) > y$ need not survive a
				 larger $y$. The half-line does it: each walk profits on an upward-closed set of amounts, so
				 their union is one too, and "$y$ suffices" is monotone. Binary search the least integer
				 $y \\le x$ with $\\mathrm{BF}(y) > y$. The guarantee that the rates along any walk of length $\\le n$ multiply to
				 at most $10^{14}$ is what keeps every intermediate value inside double precision.`
			}
		],
		complexity: 'O(n·m·log x) — one Bellman–Ford sweep set per binary-search step',
		repo: WC6,
		judge: [
			{ label: 'WinterCup 6.0 · N1', href: `${CF6}/N1` },
			{ label: 'WinterCup 6.0 · N2', href: `${CF6}/N2` }
		]
	},

	{
		slug: 'unique-disk-identifier',
		index: '07',
		title: 'Unique Disk Identifier',
		contest: 'WinterCup 6.0',
		year: '2024',
		kicker: 'Colour a disk whose rings spin independently — and that can be flipped.',
		signature: String.raw`N(A,K)=\tfrac{1}{2}\left(\prod_i L(A_i,K)+\prod_i H(A_i,K)\right)`,
		tags: ['Burnside / Pólya', 'Group theory', 'Combinatorics'],
		statement: [
			`A disk of $n$ concentric sectors; sector $i$ is cut into $A_i$ isometric chunks. Colour every
			 chunk with one of $K$ colours.`,
			`Two colourings are equivalent if one becomes the other by rotating each sector *independently*
			 by any angle, and flipping the whole disk vertically or horizontally any number of times.
			 Count the distinct colourings.`
		],
		constraints: ['n sectors, Aᵢ chunks each', 'K colours'],
		reduction:
			'Burnside over a group that is a semidirect product: a product of independent cyclic rotations, one per sector, extended by a single global reflection.',
		ideas: [
			{
				title: 'Identify the group',
				body: `Per sector the rotations give $C_{A_i}$. The flip $r$ conjugates a rotation to its
				 inverse, $r\\pi_i r = \\pi_{-i}$, and $r^2 = \\mathrm{id}$ — so every group element is a
				 rotation, or a rotation followed by *the* flip. The group is
				 $\\bigl(\\prod_i C_{A_i}\\bigr) \\rtimes C_2$, of order $2\\prod_i A_i$.`
			},
			{
				title: 'Burnside factorises into two products',
				body: `Rotations act sector-wise and independently, so the fixed-point count of a rotation
				 is a product over sectors — and so is that of a reflected rotation. The Burnside average
				 over a group of size $2\\prod A_i$ therefore collapses to *two products of $n$ terms*
				 instead of a sum over the whole group. That is the step that makes the problem tractable.`
			},
			{
				title: 'The two per-sector counts',
				body: `The rotation half is the classical necklace count. The reflection half splits on
				 whether the mirror axis passes through chunks or between them — which is a parity
				 question about $m$, not about the colouring.`,
				tex: String.raw`L(m,K)=\frac{1}{m}\sum_{d\mid m}\varphi\!\left(\tfrac{m}{d}\right)K^{d},\qquad H(m,K)=\begin{cases}K^{\frac{m+1}{2}} & m \text{ odd}\\[4pt] \frac{K+1}{2}K^{\frac{m}{2}} & m \text{ even}\end{cases}`
			},
			{
				title: 'Two degenerate sectors',
				body: `For $m \\le 2$ the reflection *is* a rotation, the group degenerates to $C_m$, and the
				 count is the multiset coefficient $\\binom{K+m-1}{m}$. Setting $L = H$ there recovers the
				 general formula exactly — which is what lets the implementation stay branch-free over
				 sectors.`
			}
		],
		complexity: 'O(Σ d(Aᵢ)·log K) after a totient sieve',
		repo: WC6,
		judge: [{ label: 'WinterCup 6.0 · K', href: `${CF6}/K` }]
	},

	{
		slug: 'universe-algorithm',
		index: '08',
		title: 'Universe Algorithm',
		contest: 'WinterCup 6.0',
		year: '2024',
		kicker: 'How many random vectors before two of them must be comparable?',
		signature: String.raw`n_{\min}=1+\#\left\{x\in\{0,\dots,k-1\}^m:\ \textstyle\sum_i x_i=\left\lfloor\tfrac{m(k-1)}{2}\right\rfloor\right\}`,
		tags: ['Order theory', 'Sperner / Dilworth', 'NTT'],
		variants: [
			{ label: 'Normal', note: 'k = 2, with m up to 10⁵ — the Boolean lattice.' },
			{ label: 'Hard', note: 'Arbitrary k, with m, k ≤ 10³ — a product of chains.' }
		],
		statement: [
			`The algorithm produces $n$ arrays of length $m$ with entries in $\\{1,\\dots,k\\}$. Call it
			 *perfect* if, whatever it produces, there are two distinct indices $i \\ne j$ with
			 $a_{i,p} \\le a_{j,p}$ for every $p$.`,
			`Given $m$ and $k$, find the minimum $n$ for which the algorithm is perfect, modulo
			 $998{,}244{,}353$.`
		],
		constraints: ['normal: k = 2, 1 ≤ m ≤ 10⁵', 'hard: 1 ≤ m, k ≤ 10³'],
		reduction:
			'The adversary is choosing an antichain in the product of m chains of length k. Perfect means n exceeds the largest antichain — so the answer is that maximum, plus one.',
		ideas: [
			{
				title: 'The largest antichain is a rank level',
				body: `The product poset $[k]^m$ is rank-symmetric, rank-unimodal and has the normalised
				 matching property, so by de Bruijn–Tengbergen–Kruyswijk its maximum antichain is an entire
				 middle level. Everything reduces to counting vectors with a fixed coordinate sum.`,
				tex: String.raw`\begin{aligned}\Phi(m,k,h)&=\#\left\{x\in\{0,\dots,k-1\}^{m}:\ \textstyle\sum_i x_i=h\right\}\\ h&=\left\lfloor\tfrac{m(k-1)}{2}\right\rfloor\end{aligned}`
			},
			{
				title: 'The normal version is Sperner',
				body: `At $k = 2$ the poset is the Boolean lattice on $m$ elements, the middle level is the
				 binomial coefficient, and the answer is $\\binom{m}{\\lfloor m/2 \\rfloor} + 1$. One row of
				 Pascal's triangle.`
			},
			{
				title: 'The hard version is one polynomial coefficient',
				body: `$\\Phi(m,k,h)$ is a coefficient of a power of the all-ones polynomial — and
				 $998{,}244{,}353$ is chosen so that NTT is available. Binary-exponentiate the polynomial in
				 $\\mathcal{O}(mk \\log mk)$, or skip it entirely with the inclusion–exclusion closed form,
				 which is linear in $m$ once factorials are tabulated.`,
				tex: String.raw`\begin{aligned}\Phi(m,k,h)&=[x^{h}]\left(1+x+\cdots+x^{k-1}\right)^{m}\\ &=\sum_{j\ge 0}(-1)^{j}\binom{m}{j}\binom{m-1+h-kj}{m-1}\end{aligned}`
			},
			{
				title: 'The "+1" is the whole statement',
				body: `Reading the definition of *perfect* correctly is the actual difficulty: the answer is
				 not the size of the largest antichain but one more than it, because the algorithm must
				 fail to avoid a comparable pair. Ties count — two equal arrays are comparable — which is
				 why the adversary is restricted to distinct vectors.`
			}
		],
		complexity: 'Normal: O(m). Hard: O(mk log mk) by NTT, or O(m) from the closed form',
		repo: VCC,
		judge: [
			{ label: 'WinterCup 6.0 · I', href: `${CF6}/I` },
			{ label: 'WinterCup 7.0 · D', href: `${CF7}/D` }
		]
	},

	{
		slug: 'rock-paper-scissors',
		index: '09',
		title: 'Rock Paper Scissors',
		contest: 'WinterCup 7.0',
		year: '2025',
		kicker: 'A matrix game whose payoff matrix contains its own value.',
		signature: String.raw`P=\operatorname{val}\bigl(A+p\,P\,I\bigr)`,
		tags: ['Stochastic games', 'Linear programming', 'Duality', "Newton's method"],
		statement: [
			`Two players hold inventories of rocks, papers and scissors. Each turn both choose an object
			 simultaneously; the loser of the matchup destroys the object they played. On a tie a biased
			 coin decides: with probability $p$ nothing happens at all, and with probability $1-p$ both
			 players lose the object they played.`,
			`The game ends as soon as some object type is exhausted from either inventory. Whoever still
			 holds that type wins; if neither does, a fair coin decides. Compute the probability the first
			 player wins under optimal play.`
		],
		constraints: ['0 ≤ R₁, P₁, S₁, R₂, P₂, S₂ ≤ 6', '0 ≤ p ≤ 1'],
		reduction:
			'A zero-sum stochastic game. Each state is a 3×3 matrix game whose entries are values of successor states — except on the diagonal, where a tie can leave the state unchanged, so the value appears on both sides of its own definition.',
		ideas: [
			{
				title: 'Order the states, and isolate the self-loop',
				body: `Process states by decreasing total inventory, so every off-diagonal entry of $A$ is
				 already solved when a state is reached. The only obstruction is the probability-$p$ tie
				 that returns to the same state, which puts $P$ inside its own payoff matrix.`,
				tex: String.raw`P=\min_{\beta\in\Delta}\max_{\alpha\in\Delta}\ \alpha^{\mathsf T}\bigl(A+p\,P\,I\bigr)\beta`
			},
			{
				title: 'Turn the fixed point into a scalar root-find',
				body: `Define $\\Psi(t) = \\operatorname{val}(A + p\\,t\\,I)$. Every row sum of the perturbed
				 matrix stays in $[0,1]$, so $\\Psi$ maps $[0,1]$ into itself and is continuous — a fixed
				 point exists, and it is the value of the state.`
			},
			{
				title: 'Ψ is a linear program whose derivative is free',
				body: `$\\Psi(t)$ is the optimum of an LP in $(\\beta, s)$, and the envelope theorem reads its
				 derivative straight off the optimal strategies (no numerical differentiation). What it
				 returns is not an abstraction: $\\langle\\alpha_*, \\beta_*\\rangle$ is the probability both
				 players choose the same action, so $\\Psi'$ is the probability that the round leaves the
				 state exactly where it was.`,
				tex: String.raw`\Psi'(t)=p\,\bigl\langle\alpha_*(t),\,\beta_*(t)\bigr\rangle=\Pr[\text{state unchanged}]`
			},
			{
				title: 'Contraction for p < 1 proves uniqueness',
				body: `A tie is necessary for the state to persist, so
				 $\\Psi' \\le p < 1$: $\\Psi$ is a $p$-contraction of $[0,1]$, Banach gives a unique fixed
				 point, and Newton converges on it with the exact derivative above. The bound is uniform
				 over states, so one iteration count serves the whole table.`
			},
			{
				title: 'Stronger uniqueness argument for p = 1',
				body: `With $p=1$, ties never destroy anything and the bound
				 decays to $\\Psi' \\le 1$. Uniqueness survives anyway, and
				 the argument is better as it is agnostic to $p$:
				 $\\Psi'(t) = 1$ forces $\\alpha_*(t) = \\beta_*(t) = e_i$, so cell $(i,i)$ must be a saddle; the row
				 guards that cell with the value after *Rami* loses an $i$ and the column with the value
				 after *Yassine* does, and monotonicity forces the equality of both. So $\\Psi' < 1$ almost surely. We can safely conclude $\\Psi(t) - t$ is still strictly
				 decreasing, and the root is still unique.`,
				tex: String.raw`a_i=V(s\ominus_1 i)\ \le\ V(s\ominus_2 i)=b_i \quad\Longrightarrow\quad \lvert D_i\rvert\le 1`
			},
			{
				title: 'Why the obvious shortcut fails',
				body: `The tempting solution is to solve each $3\\times3$ game by the indifference conditions, reducing it to a linear system. It silently gives wrong answers, because the equilibrium is not always
				 fully mixed: on many states the optimal $\\beta$ sits on a face of the simplex, and only an
				 actual LP finds it. That gap is what puts the problem in the hard division.`
			}
		],
		complexity: 'O(S) states, each a Newton loop over a 2-phase simplex; S ≤ 7⁶',
		repo: VCC,
		judge: [{ label: 'WinterCup 7.0 · J', href: `${CF7}/J` }]
	},

	{
		slug: 'structural-counting',
		index: '10',
		title: 'Structural Counting',
		contest: 'VertexCover Contest',
		year: '2023',
		division: 'Hard division',
		kicker: 'Count org-charts in which sibling departments are interchangeable.',
		signature: String.raw`F=\operatorname{MSET}\bigl((x^{a}+\cdots+x^{b})\cdot F\bigr)`,
		tags: ['Symbolic method', 'Euler transform', 'Power series', 'NTT'],
		statement: [
			`A company is a set of departments forming a rooted forest. Each department is managed
			 cooperatively by between $a$ and $b$ people and contains zero or more sub-departments; the
			 leaves are teams.`,
			`Two structures are the same if one becomes the other by repeatedly swapping two *sibling*
			 departments. Count the distinct structures employing exactly $n$ people, modulo
			 $998{,}244{,}353$.`
		],
		constraints: ['1 ≤ n ≤ 500', '1 ≤ a ≤ b ≤ 20'],
		reduction:
			'Unlabelled rooted forests with weighted nodes. Sibling order is irrelevant, so children form a multiset — which makes the generating function an Euler transform rather than a product.',
		ideas: [
			{
				title: 'Two mutually recursive species',
				body: `A department is a staff block of size in $[a,b]$ carrying a sub-forest; a forest is a
				 multiset of departments. Substituting one into the other gives a single implicit equation
				 for $F$ — the answer is $[x^n]F$.`,
				tex: String.raw`T(x)=\bigl(x^{a}+\cdots+x^{b}\bigr)F(x),\qquad F(x)=\operatorname{MSET}\bigl(T(x)\bigr)`
			},
			{
				title: 'The multiset construction is the Euler transform',
				body: `Writing $\\mathrm{MSET}$ as a product over sizes is correct but useless; the
				 exponential form is the implementable one — a power-series $\\exp$ under NTT, with the
				 inner substitution $T(x^i)$ costing a harmonic sum.`,
				tex: String.raw`\operatorname{MSET}(T)(x)=\prod_{k\ge1}\left(1-x^{k}\right)^{-t_k}=\exp\left(\sum_{i\ge1}\frac{T(x^{i})}{i}\right)`
			},
			{
				title: 'Solve the implicit equation by iterating it',
				body: `The operator only reads coefficients strictly below the one it writes — every
				 department costs at least $a \\ge 1$ people — so each pass fixes at least one more
				 coefficient and the iteration converges in at most $n$ rounds. At $n \\le 500$ that is
				 comfortable; Newton iteration on the functional equation removes the outer factor if you
				 want it.`
			},
			{
				title: 'The sanity check that catches the off-by-one',
				body: `$n=3$, $a=1$, $b=3$ must give $8$: five ways to build a single tree, two more that
				 split into a one-person department beside a two-person one, and one that is three separate
				 one-person departments. Any solution that models a company as a single tree returns $5$
				 and looks plausible until this case.`
			}
		],
		complexity: 'O(n² log n) by fixed-point iteration; O(n log n) with Newton',
		repo: VCC
	},

	{
		slug: 'game-of-divisors',
		index: '11',
		title: 'Game of Divisors',
		contest: 'WinterCup 8.0',
		year: '2026',
		kicker: 'One move reaches every integer at once — so the Grundy values run past infinity.',
		signature: String.raw`\mathcal{G}(x)=\omega\,(r-1)+\Omega(x)-r`,
		tags: ['Combinatorial game theory', 'Ordinal arithmetic', 'Number theory', 'Constructive'],
		statement: [
			`Khalil and Rami alternate on a list $A$ of $n$ positive integers, Khalil first. A move picks
			 some $A_i$ and replaces it either by a proper divisor of $A_i$, or by *any* positive integer
			 with strictly fewer distinct prime factors than $A_i$. A player with no move loses.`,
			`Before play begins Rami may append integers of his own to the list. Output the smallest set
			 he can add — possibly empty — that makes him, the second player, win under optimal play, and
			 the numbers themselves. Any minimal set is accepted.`
		],
		constraints: [
			'1 ≤ T ≤ 10⁴',
			'0 ≤ n ≤ 10⁶ with Σn ≤ 10⁶',
			'1 ≤ Aᵢ ≤ 10⁶, and the appended values too'
		],
		reduction:
			'Drive the Grundy value of the whole list to zero with as few numbers ≤ 10⁶ as possible. The catch is the second move: it is unbounded, so a position has infinitely many options, and the values are ordinals rather than integers.',
		ideas: [
			{
				title: 'The unbounded move pushes the value past ω',
				body: `Write $r$ for the number of distinct primes of $x$. Because a player may jump to
				 *any* integer with fewer distinct primes, the options of an $x$ with $r = 2$ already
				 contain every prime power, hence every finite Grundy value. The game still terminates —
				 $r$ never rises and divisors strictly descend — so Sprague–Grundy applies, but the mex is
				 taken over an infinite set and lands on a transfinite ordinal.`,
				tex: String.raw`\mathcal{G}(p^k)=k,\qquad \mathcal{G}(pq)=\operatorname{mex}\mathbb{N}=\omega`
			},
			{
				title: 'A closed form, one rank at a time',
				body: `Induct on $r$. The unbounded move realises exactly the ordinals below
				 $\\omega\\,(r-1)$, and the divisors that keep all $r$ primes realise every smaller excess
				 $\\Omega(x) - r$ at that rank — so the mex is the next ordinal in line. Prime powers are the
				 degenerate case, $\\mathcal{G}(p^k) = k$, and $\\mathcal{G}(1) = 0$.`,
				tex: String.raw`\mathcal{G}(x)=\omega\,(r-1)+(\Omega(x)-r),\qquad r\ge 2`
			},
			{
				title: 'Nim-addition of ordinals is coordinatewise',
				body: `Every value here is below $\\omega^2$, so it is $\\omega b + a$ in Cantor normal form,
				 and Conway's nim-sum adds the coefficient of each power of $\\omega$ by XOR — the two
				 coordinates never mix. The list is losing for the player to move iff $\\bigoplus a_i$ and
				 $\\bigoplus b_i$ both vanish: two independent Nim games riding on one array, which is why
				 the state is a pair and not an integer.`,
				tex: String.raw`(\omega b+a)\oplus(\omega b'+a')=\omega\,(b\oplus b')+(a\oplus a')`
			},
			{
				title: 'Then it is a packing problem under 10⁶',
				body: `Rami must append numbers whose nim-sum is the current total $(a,b)$. The cheapest
				 carrier of a pair is $2^{a+1}$ times the first $b$ odd primes, and past $10^6$ it stops
				 existing — the ceiling allows only $a \\le 19$ and $b \\le 6$. Split the bits of $a$ across
				 two carriers when one will not fit, and peel the top bit onto a pure power of two when two
				 will not: three numbers always suffice, and that case analysis is the problem.`,
				tex: String.raw`N(a,b)=2^{\,a+1}\!\!\prod_{2\le i\le b+1}\!\! p_i \;\le\; 10^{6}`
			}
		],
		complexity: 'O(L log log L) to sieve, then O(log Aᵢ) per element and O(1) per test case',
		judge: [{ label: 'WinterCup 8.0 · E', href: `${CF8}/E` }]
	},

	{
		slug: 'scratch-expressions',
		index: '12',
		title: 'Scratch Expressions',
		contest: 'WinterCup 8.0',
		year: '2026',
		kicker: 'Scratch a random string, and win if it is an arithmetic expression worth zero.',
		signature: String.raw`E\to E\pm T\mid T,\qquad T\to T*F\mid F,\qquad F\to(E)\mid N`,
		tags: ['Dynamic programming', 'Context-free grammars', 'Probability', 'Modular arithmetic'],
		statement: [
			`A string of length $n$ is drawn uniformly from $\\Sigma^n$, where $\\Sigma$ is the ten digits,
			 the binary operators $+$, $-$, $*$ and the two parentheses — fifteen characters in all.`,
			`It wins if it is a valid arithmetic expression — generated by $E \\to E+E \\mid E-E \\mid E*E
			 \\mid (E) \\mid N$, with $N$ a non-empty run of digits — whose value under the usual precedence
			 and left associativity is $0$ modulo $m$. For each queried $n$, output the probability of
			 winning modulo $10^9+7$.`
		],
		constraints: ['1 ≤ T ≤ 100 queries', '1 ≤ m ≤ 100, shared by every query', '1 ≤ nᵢ ≤ 200'],
		reduction:
			'Count the strings of length n in a context-free language by their value mod m, then divide by 15ⁿ. The grammar the statement gives is the wrong one to count with.',
		ideas: [
			{
				title: 'Count strings, not derivations',
				body: `The grammar as posed is ambiguous: $1+2+3$ has two parse trees, and so does the
				 number $123$ under $N \\to NN$. A DP over its productions counts derivations and
				 overcounts from $n = 3$ on. Validity is a property of the language, not of the grammar, so
				 switch to an equivalent unambiguous one — and choose the one that also encodes the
				 semantics.`
			},
			{
				title: 'Let the grammar do the evaluating',
				body: `The textbook expression grammar gives every valid string exactly one parse tree, and
				 that tree is its evaluation order: $*$ binds below $\\pm$, and left recursion splits on the
				 *last* top-level operator, which is precisely left associativity — $10-3-2$ parses as
				 $(10-3)-2$. Precedence stops being a rule to check and becomes a structural fact.`,
				tex: String.raw`E\to E+T\mid E-T\mid T,\qquad T\to T*F\mid F,\qquad F\to(E)\mid N`
			},
			{
				title: 'Carry the residue through every nonterminal',
				body: `Let $X_\\ell[v]$ count the strings of length $\\ell$ derived from $X$ with value $v$
				 modulo $m$. Numbers extend by Horner, $v \\mapsto 10v + d$; parentheses shift the length by
				 two and keep the value; each binary rule is a split point plus a cyclic convolution over
				 $\\mathbb{Z}/m$ — additive for $E$, multiplicative for $T$.`,
				tex: String.raw`E_\ell[v]=T_\ell[v]+\sum_{a+b=\ell-1}\ \sum_{x\pm y\equiv v}E_a[x]\,T_b[y]`
			},
			{
				title: 'Why m is shared',
				body: `One table up to $n = 200$ answers every query as $E_n[0] \\cdot 15^{-n}$. The cost is
				 the split points times $m^2$ residue pairs — a few hundred million multiply-adds, done
				 once. Had $m$ varied per query, the same work would be repeated for every modulus.`
			}
		],
		complexity: 'O(n²·m²) once, then O(1) per query'
	}
];

export function problemBySlug(slug: string): Problem | undefined {
	return problems.find((p) => p.slug === slug);
}

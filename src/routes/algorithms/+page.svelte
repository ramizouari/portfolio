<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import Code from '$lib/components/Code.svelte';
	import { awards, contests, topics, infrastructure } from '$lib/data/algorithms';
	import { profile } from '$lib/data/profile';

	const snippet = `
// CPLibrary — a segment tree is not a sum tree. It is a tree over any
// associative binary operation, and it only needs a neutral element to
// pad its leaves.
template<typename R>
struct segment_tree
{
    std::vector<std::vector<R>> S;
    binary_operation_ptr<R> F;

    segment_tree(const std::vector<R> &A, std::shared_ptr<binary_operation<R>> _F)
        : F(_F)
    {
        n = bit_ceil(A.size());
        A.resize(n, F.neutral_element());
        build();
    }

    R query(int l, int r)
    {
        return query(std::max(l, 0), std::min(r, n), 0, n, 0);
    }
};
`;
</script>

<svelte:head>
	<title>Algorithms — {profile.name}</title>
	<meta
		name="description"
		content="ICPC gold medalist and problem setter: 58+ original competitive programming problems across four contests, plus the judging infrastructure and the C++ library behind them."
	/>
</svelte:head>

<header class="page-head shell-wide">
	<p class="eyebrow">03 — Algorithms</p>
	<h1>Algorithms</h1>
	<p class="lede">
		Competitive programming is where I learned to state a problem exactly, bound it, and only then
		earn a solution. I competed for four years and then moved to the other side of the judge — now I
		write the problems, build the infrastructure that runs them, and coach the teams.
	</p>
</header>

<!-- ── Medals ───────────────────────────────────────────────────────────── -->
<section class="section shell-wide">
	<h2 class="section-title">Competing</h2>
	<ol class="awards">
		{#each awards as award, i (award.id)}
			<Reveal as="li" delay={i * 60}>
				<div class="award" data-medal={award.medal}>
					<span class="award-year mono">{award.year}</span>
					<span class="disc" aria-hidden="true"></span>
					<div class="award-body">
						<h3>{award.title}</h3>
						<p>{award.detail}</p>
					</div>
				</div>
			</Reveal>
		{/each}
	</ol>
	<p class="footnote">
		Listed on my CV as an ICPC finalist — the regional medals above are the ones with a public
		scoreboard.
	</p>
</section>

<hr class="rule shell-wide" />

<!-- ── Setting ──────────────────────────────────────────────────────────── -->
<section class="section shell-wide">
	<h2 class="section-title">Setting</h2>

	<div class="setting-intro">
		<p class="lede">
			A good problem hides one idea behind a statement that gives nothing away, and admits a
			solution the intended complexity actually reaches. Writing one is harder than solving one — it
			needs the statement, the model solution, a naive solution to check it against, the generators,
			the edge cases, and often a custom checker or an interactor.
		</p>
	</div>

	<ol class="contests">
		{#each contests as contest, i (contest.name)}
			<Reveal as="li" delay={i * 60}>
				<div class="contest">
					<div class="contest-head">
						<h3>{contest.name}</h3>
						<span class="mono contest-year">{contest.year}</span>
					</div>
					<p class="contest-role mono">{contest.role}</p>
					<p class="contest-note">{contest.note}</p>

					<div class="ratio">
						{#if contest.authored !== '—'}
							<div
								class="bar"
								style:--fill="{(Number(contest.authored) / Number(contest.total)) * 100}%"
							>
								<span></span>
							</div>
							<span class="mono ratio-label">
								{contest.authored} of {contest.total} problems authored
							</span>
						{:else}
							<span class="mono ratio-label">{contest.total} problems in the set</span>
						{/if}
					</div>

					{#if contest.repo}
						<a class="contest-repo mono" href={contest.repo} rel="noreferrer" target="_blank">
							repository ↗
						</a>
					{/if}
				</div>
			</Reveal>
		{/each}
	</ol>
</section>

<hr class="rule shell-wide" />

<!-- ── Library ──────────────────────────────────────────────────────────── -->
<section class="section shell-wide">
	<h2 class="section-title">The library</h2>

	<div class="lib">
		<Reveal class="lib-text">
			<h3>CPLibrary</h3>
			<p>
				Most competitive-programming libraries are a pile of snippets. The abstractions that make
				them correct — the monoid a segment tree needs, the ring an FFT lives in, the group a
				Fenwick tree assumes — are usually left implicit, which is exactly why they break the moment
				they are reused.
			</p>
			<p>
				CPLibrary makes them explicit. Data structures are templated over the algebraic structure
				they actually require, so the same segment tree serves sums, minima, matrix products and
				anything else associative, with no rewriting and no runtime cost.
			</p>
			<ul class="lib-topics">
				{#each topics as topic (topic.group)}
					<li>
						<span class="topic-group mono">{topic.group}</span>
						<span class="topic-items">{topic.items.join(' · ')}</span>
					</li>
				{/each}
			</ul>
		</Reveal>

		<Reveal class="lib-code" delay={80}>
			<Code
				code={snippet}
				caption="From CPLibrary. The neutral element comes from the operation, not from a hard-coded zero — which is what lets the same tree answer min-queries and matrix-product queries."
			/>
		</Reveal>
	</div>
</section>

<hr class="rule shell-wide" />

<!-- ── Infrastructure ───────────────────────────────────────────────────── -->
<section class="section shell-wide">
	<h2 class="section-title">Infrastructure</h2>
	<p class="lede infra-lede">
		Running a contest is a systems problem: untrusted code, deterministic judging, and a statement
		pipeline that has to survive the night before.
	</p>

	<ul class="infra">
		{#each infrastructure as item, i (item.name)}
			<Reveal as="li" delay={i * 60}>
				<a class="infra-card" href={item.repo} rel="noreferrer" target="_blank">
					<h3>{item.name}</h3>
					<p>{item.note}</p>
					<span class="mono infra-link">github ↗</span>
				</a>
			</Reveal>
		{/each}
	</ul>
</section>

<style>
	.page-head {
		padding-block: var(--space-3xl) var(--space-2xl);
	}

	h1 {
		margin-top: var(--space-m);
		font-size: var(--step-6);
	}

	.page-head .lede {
		margin-top: var(--space-m);
		max-width: 58ch;
	}

	.section {
		padding-block: var(--space-xl) var(--space-2xl);
	}

	.section-title {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-4);
		padding-bottom: var(--space-m);
		border-bottom: 1px solid var(--line);
		margin-bottom: var(--space-l);
	}

	.rule {
		max-width: var(--shell-wide);
		margin-inline: auto;
	}

	/* ── Awards ──────────────────────────────────────────────────────────── */
	.awards {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.award {
		display: grid;
		grid-template-columns: 3.5rem auto 1fr;
		align-items: start;
		gap: var(--space-s);
		padding-block: var(--space-m);
		border-bottom: 1px solid var(--line-soft);
	}

	.award-year {
		font-size: var(--step--1);
		color: var(--fg-4);
		padding-top: 0.35rem;
	}

	.disc {
		width: 0.7rem;
		height: 0.7rem;
		margin-top: 0.55rem;
		border-radius: 50%;
		background: var(--gold);
		box-shadow: 0 0 0 3px var(--gold-soft);
	}

	[data-medal='silver'] .disc {
		background: var(--fg-3);
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--fg-3) 18%, transparent);
	}

	[data-medal='other'] .disc {
		background: transparent;
		border: 1px solid var(--line-strong);
		box-shadow: none;
	}

	.award h3 {
		font-size: var(--step-1);
	}

	.award p {
		margin-top: 0.15rem;
		font-size: var(--step--1);
		color: var(--fg-3);
	}

	.footnote {
		margin-top: var(--space-m);
		font-size: var(--step--2);
		color: var(--fg-4);
		max-width: 54ch;
	}

	/* ── Contests ────────────────────────────────────────────────────────── */
	.setting-intro {
		margin-bottom: var(--space-xl);
	}

	.setting-intro .lede {
		max-width: 62ch;
	}

	.contests {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-s);
	}

	.contest {
		display: grid;
		gap: 0.4rem;
		height: 100%;
		padding: var(--space-m);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--surface);
	}

	.contest-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-s);
	}

	.contest h3 {
		font-size: var(--step-2);
	}

	.contest-year {
		font-size: var(--step--2);
		color: var(--fg-4);
	}

	.contest-role {
		font-size: var(--step--2);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.contest-note {
		font-size: var(--step--1);
		line-height: 1.6;
		color: var(--fg-3);
	}

	.ratio {
		display: grid;
		gap: 0.4rem;
		margin-top: var(--space-2xs);
	}

	.bar {
		height: 3px;
		background: var(--line);
		border-radius: 999px;
		overflow: hidden;
	}

	.bar span {
		display: block;
		width: var(--fill);
		height: 100%;
		background: var(--gold);
	}

	.ratio-label {
		font-size: var(--step--2);
		color: var(--fg-4);
	}

	.contest-repo {
		margin-top: auto;
		padding-top: var(--space-2xs);
		font-size: var(--step--2);
		color: var(--fg-3);
		width: fit-content;
		transition: color var(--dur-fast) var(--ease);
	}

	.contest-repo:hover {
		color: var(--accent);
	}

	/* ── Library ─────────────────────────────────────────────────────────── */
	.lib {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--space-xl);
	}

	.lib :global(.lib-text h3) {
		font-size: var(--step-3);
	}

	.lib :global(.lib-text p) {
		margin-top: var(--space-s);
		font-size: var(--step-0);
		line-height: 1.7;
		color: var(--fg-2);
		max-width: 54ch;
	}

	.lib-topics {
		list-style: none;
		padding: 0;
		margin-top: var(--space-l);
		display: grid;
		gap: var(--space-s);
	}

	.lib-topics li {
		display: grid;
		gap: 0.25rem;
		padding-left: var(--space-s);
		border-left: 1px solid var(--line-strong);
	}

	.topic-group {
		font-size: var(--step--2);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--flow);
	}

	.topic-items {
		font-size: var(--step--1);
		color: var(--fg-3);
		line-height: 1.6;
	}

	/* ── Infrastructure ──────────────────────────────────────────────────── */
	.infra-lede {
		max-width: 58ch;
		margin-bottom: var(--space-l);
	}

	.infra {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-s);
	}

	.infra-card {
		display: grid;
		gap: 0.4rem;
		height: 100%;
		padding: var(--space-m);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--surface);
		transition:
			border-color var(--dur-fast) var(--ease),
			transform var(--dur-fast) var(--ease);
	}

	.infra-card:hover {
		border-color: var(--accent-line);
		transform: translateY(-2px);
	}

	.infra-card h3 {
		font-family: var(--font-mono);
		font-size: var(--step-0);
		letter-spacing: -0.01em;
	}

	.infra-card p {
		font-size: var(--step--1);
		line-height: 1.6;
		color: var(--fg-3);
	}

	.infra-link {
		margin-top: auto;
		padding-top: var(--space-2xs);
		font-size: var(--step--2);
		color: var(--fg-4);
	}

	.infra-card:hover .infra-link {
		color: var(--accent);
	}

	@media (min-width: 50rem) {
		.contests {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.infra {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (min-width: 68rem) {
		.lib {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
			gap: var(--space-2xl);
			align-items: start;
		}
	}
</style>

<script lang="ts">
	import { resolve } from '$app/paths';
	import Reveal from '$lib/components/Reveal.svelte';
	import Tex from '$lib/components/Tex.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import TransportPlot from '$lib/visuals/TransportPlot.svelte';
	import JumpOdePlot from '$lib/visuals/JumpOdePlot.svelte';
	import SurvivalPlot from '$lib/visuals/SurvivalPlot.svelte';
	import NoiseConePlot from '$lib/visuals/NoiseConePlot.svelte';
	import MeanPayoffPlot from '$lib/visuals/MeanPayoffPlot.svelte';
	import { threads, publications } from '$lib/data/research';
	import { profile } from '$lib/data/profile';
	import type { Component } from 'svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	/* One drawing per thread, computed at build time from the model it illustrates. */
	const plots: Record<string, { component: Component; caption: string }> = {
		'jump-odes': {
			component: JumpOdePlot,
			caption:
				'A latent coordinate integrated between events and displaced at them. The solution is càdlàg — at each event time the open marker is the state the solver arrived with, the filled one the state after the jump — and the counting process below is what drives it.'
		},
		'survival-odes': {
			component: SurvivalPlot,
			caption:
				'The hazard is a head on the integrated state, so the cumulative hazard comes out of the same solver call and the survival curve follows. Two ways an observation can end: an event at T contributes −log h(T) + Λ(T) to the loss, censoring at C only Λ(C).'
		},
		'optimal-transport': {
			component: TransportPlot,
			caption:
				'A source population transported onto a target whose marginals are known only through published statistics. The map moves the least mass it can while satisfying them.'
		},
		'reinforcement-learning': {
			component: NoiseConePlot,
			caption:
				'Over a month of hourly bars, a few basis points of edge accumulate slowly inside a wide cone of noise. Halfway through, the signal inverts without warning. Beneath both lies transaction cost: it takes weeks to distinguish an edge from pure luck, but rebalancing churn erodes it in days.'
		},
		'games-on-graphs': {
			component: MeanPayoffPlot,
			caption:
				'A mean-payoff game: circles belong to the maximiser, squares to the minimiser, edges carry weights. Positional strategies suffice; under the optimal pair the play from v₀ settles on a cycle, and the cycle’s mean weight is the value. The minimiser refuses the +3 edge at D because the cycle it opens averages 3/2.'
		}
	};
</script>

<svelte:head>
	<title>Research — {profile.name}</title>
	<meta
		name="description"
		content="Latent jump ODEs, survival latent ODEs, constrained optimal transport, a dimensionless trading agent, and learning to solve mean-payoff games on graphs."
	/>
</svelte:head>

<header class="page-head shell-wide">
	<p class="eyebrow">02 — Research</p>
	<h1>Research</h1>
	<p class="lede">
		I work at the point where a modelling assumption becomes a line of code. These are the five
		threads that have taken most of my attention — what the problem actually was, the mathematics I
		settled on, and the part that turned out to be harder than it looked.
	</p>

	<nav class="jump" aria-label="Research threads">
		{#each threads as thread (thread.slug)}
			<a href="#{thread.slug}">
				<span class="mono">{thread.index}</span>
				{thread.title}
			</a>
		{/each}
	</nav>
</header>

<section class="pubs shell-wide">
	<Reveal>
		<h2 class="pubs-title">Publications</h2>
		<ul>
			{#each publications as pub (pub.title)}
				<li>
					<div class="pub-meta">
						<span class="mono pub-status">{pub.status}</span>
						<span class="mono">{pub.kind}</span>
						<span class="mono">{pub.code}</span>
					</div>

					<h3>
						<a href={pub.href} rel="noreferrer" target="_blank">
							{pub.title}
							<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
								<path
									d="M4 12L12 4M6 4h6v6"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</a>
					</h3>

					<p class="pub-authors">
						<!-- Separators come from CSS: Svelte trims trailing whitespace in the
						     template, which would run the surnames together. -->
						{#each pub.authors as author (author)}<span
								class="author"
								class:self={author === pub.self}>{author}</span
							>{/each}
					</p>

					<p class="pub-venue mono">
						{pub.venue} · {pub.location} · {pub.date}
					</p>

					<p class="pub-note">{pub.note}</p>

					<div class="pub-topics">
						{#each pub.topics as topic (topic)}
							<Pill>{topic}</Pill>
						{/each}
					</div>
				</li>
			{/each}
		</ul>
	</Reveal>
</section>

{#each threads as thread, i (thread.slug)}
	<article class="thread" id={thread.slug}>
		<div class="shell-wide">
			<Reveal>
				<div class="thread-top">
					<div class="thread-id">
						<span class="mono idx">{thread.index}</span>
						<span class="rail" aria-hidden="true"></span>
					</div>
					<div class="thread-title">
						<p class="eyebrow">{thread.context} · {thread.period}</p>
						<h2>{thread.title}</h2>
						<p class="kicker">{thread.kicker}</p>
					</div>
				</div>
			</Reveal>

			<div class="thread-grid">
				<Reveal class="abstract" delay={60}>
					<p>{thread.abstract}</p>
					<div class="keywords">
						{#each thread.keywords as kw (kw)}
							<Pill>{kw}</Pill>
						{/each}
					</div>
				</Reveal>

				<Reveal class="equations" delay={120}>
					{#if plots[thread.slug]}
						{@const Plot = plots[thread.slug].component}
						<figure class="plot">
							<Plot />
							<figcaption>{plots[thread.slug].caption}</figcaption>
						</figure>
					{/if}
					{#each thread.equations as eq, j (eq.tex)}
						<figure class="eq">
							<Tex html={data.math[thread.slug][j]} label={eq.tex} />
							<figcaption>{eq.caption}</figcaption>
						</figure>
					{/each}
				</Reveal>
			</div>

			<Reveal class="points" delay={90}>
				<ol>
					{#each thread.points as point, j (point.heading)}
						<li>
							<span class="point-idx mono">{String(j + 1).padStart(2, '0')}</span>
							<div>
								<h3>{point.heading}</h3>
								<p>{point.body}</p>
							</div>
						</li>
					{/each}
				</ol>
			</Reveal>

			{#if thread.artifacts?.length}
				<Reveal class="artifacts" delay={60}>
					<p class="eyebrow">Artifacts</p>
					<ul>
						{#each thread.artifacts as artifact (artifact.label)}
							<li>
								{#if artifact.href}
									<a
										class="artifact-name text-link"
										href={artifact.href}
										rel="noreferrer"
										target="_blank">{artifact.label}</a
									>
								{:else}
									<span class="artifact-name">
										{artifact.label}
										<span class="closed">private</span>
									</span>
								{/if}
								<span class="artifact-note">{artifact.note}</span>
							</li>
						{/each}
					</ul>
				</Reveal>
			{/if}
		</div>

		{#if i < threads.length - 1}<hr class="rule" />{/if}
	</article>
{/each}

<section class="outro shell-wide">
	<Reveal>
		<p class="eyebrow">Next</p>
		<h2>Where the habit of stating things precisely came from.</h2>
		<a class="btn" href={resolve('/algorithms/')}>
			Algorithms
			<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
				<path
					d="M2 8h11M9 4l4 4-4 4"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</a>
	</Reveal>
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

	.jump {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: var(--space-xl);
	}

	.jump a {
		display: inline-flex;
		align-items: baseline;
		gap: 0.45rem;
		padding: 0.4rem 0.85rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-size: var(--step--1);
		color: var(--fg-3);
		transition:
			color var(--dur-fast) var(--ease),
			border-color var(--dur-fast) var(--ease);
	}

	.jump a:hover {
		color: var(--fg);
		border-color: var(--accent-line);
	}

	.jump a .mono {
		font-size: 0.7em;
		color: var(--fg-4);
	}

	/* ── Publications ────────────────────────────────────────────────────── */
	.pubs {
		padding-bottom: var(--space-xl);
	}

	.pubs-title {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-4);
		padding-bottom: var(--space-s);
		border-bottom: 1px solid var(--line);
	}

	.pubs ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.pubs li {
		display: grid;
		gap: 0.45rem;
		padding: var(--space-m) 0 var(--space-m) var(--space-m);
		border-left: 2px solid var(--accent);
		border-bottom: 1px solid var(--line);
	}

	.pub-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 0.85rem;
		font-size: var(--step--2);
		color: var(--fg-4);
	}

	.pub-status {
		color: var(--accent);
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.pubs h3 {
		font-size: var(--step-1);
		line-height: 1.3;
		max-width: 62ch;
	}

	.pubs h3 a {
		transition: color var(--dur-fast) var(--ease);
	}

	.pubs h3 a:hover {
		color: var(--accent);
	}

	.pubs h3 svg {
		display: inline-block;
		vertical-align: baseline;
		margin-left: 0.15em;
		color: var(--fg-4);
	}

	.pubs h3 a:hover svg {
		color: var(--accent);
	}

	.pub-authors {
		font-size: var(--step--1);
		line-height: 1.6;
		color: var(--fg-3);
		max-width: 68ch;
	}

	.author:not(:last-child)::after {
		content: ', ';
		color: var(--fg-4);
	}

	.author.self {
		color: var(--fg);
		font-weight: 600;
	}

	.pub-venue {
		font-size: var(--step--2);
		color: var(--fg-4);
	}

	.pub-note {
		font-size: var(--step--1);
		line-height: 1.6;
		color: var(--fg-3);
		max-width: 68ch;
	}

	.pub-topics {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: 0.2rem;
	}

	.thread {
		padding-block: var(--space-2xl);
		scroll-margin-top: 5rem;
	}

	.thread-top {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-m);
		align-items: start;
	}

	.thread-id {
		display: grid;
		gap: 0.6rem;
		justify-items: center;
		padding-top: 0.35rem;
	}

	.idx {
		font-size: var(--step--1);
		color: var(--accent);
	}

	.rail {
		width: 1px;
		height: 2.4rem;
		background: linear-gradient(var(--accent-line), transparent);
	}

	.thread-title h2 {
		margin-top: var(--space-2xs);
		font-size: var(--step-5);
	}

	.kicker {
		margin-top: var(--space-2xs);
		font-family: var(--font-display);
		font-style: italic;
		font-size: var(--step-1);
		color: var(--fg-2);
		max-width: 44ch;
	}

	.thread-grid {
		display: grid;
		gap: var(--space-xl);
		margin-top: var(--space-xl);
	}

	.thread :global(.abstract p) {
		font-size: var(--step-0);
		line-height: 1.7;
		color: var(--fg-2);
		max-width: 56ch;
	}

	.keywords {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-top: var(--space-m);
	}

	.thread :global(.equations) {
		display: grid;
		gap: var(--space-m);
		align-content: start;
	}

	.eq {
		display: grid;
		gap: 0.6rem;
		padding: var(--space-m);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--surface);
		box-shadow: var(--shadow);
	}

	.eq figcaption,
	.plot figcaption {
		font-size: var(--step--1);
		line-height: 1.55;
		color: var(--fg-3);
		border-top: 1px solid var(--line-soft);
		padding-top: 0.65rem;
	}

	.plot {
		display: grid;
		gap: 0.9rem;
		padding: var(--space-m) var(--space-m) var(--space-s);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--surface);
		box-shadow: var(--shadow);
	}

	.thread :global(.points) {
		margin-top: var(--space-xl);
	}

	.thread :global(.points ol) {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0;
		border-top: 1px solid var(--line);
	}

	.thread :global(.points li) {
		display: grid;
		grid-template-columns: 2.5rem 1fr;
		gap: var(--space-s);
		padding-block: var(--space-m);
		border-bottom: 1px solid var(--line);
	}

	.point-idx {
		color: var(--fg-4);
		font-size: var(--step--2);
		padding-top: 0.25rem;
	}

	.thread :global(.points h3) {
		font-size: var(--step-1);
	}

	.thread :global(.points p) {
		margin-top: 0.3rem;
		font-size: var(--step--1);
		line-height: 1.65;
		color: var(--fg-3);
		max-width: 62ch;
	}

	.thread :global(.artifacts) {
		margin-top: var(--space-xl);
	}

	.thread :global(.artifacts ul) {
		list-style: none;
		padding: 0;
		margin-top: var(--space-s);
		display: grid;
		gap: var(--space-s);
	}

	.thread :global(.artifacts li) {
		display: grid;
		gap: 0.25rem;
		padding-left: var(--space-s);
		border-left: 1px solid var(--line-strong);
	}

	.artifact-name {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--fg);
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		width: fit-content;
	}

	.closed {
		font-size: 0.72em;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--fg-4);
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 0.05rem 0.4rem;
	}

	.artifact-note {
		font-size: var(--step--1);
		color: var(--fg-3);
		max-width: 62ch;
		line-height: 1.55;
	}

	.rule {
		max-width: var(--shell-wide);
		margin: var(--space-2xl) auto 0;
	}

	.outro {
		padding-block: var(--space-2xl) var(--space-3xl);
	}

	.outro h2 {
		margin-top: var(--space-s);
		font-size: var(--step-4);
		max-width: 22ch;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: var(--space-l);
		padding: 0.6rem 1.1rem;
		border: 1px solid var(--line-strong);
		border-radius: 999px;
		font-size: var(--step--1);
		color: var(--fg-2);
		transition:
			color var(--dur-fast) var(--ease),
			border-color var(--dur-fast) var(--ease),
			gap var(--dur-fast) var(--ease);
	}

	.btn:hover {
		color: var(--accent);
		border-color: var(--accent-line);
		gap: 0.8rem;
	}

	@media (min-width: 62rem) {
		.thread-grid {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
			gap: var(--space-2xl);
			align-items: start;
		}

		.thread :global(.abstract) {
			position: sticky;
			top: 6.5rem;
		}

		.thread-top {
			gap: var(--space-l);
		}

		.thread :global(.points li) {
			grid-template-columns: 4rem minmax(0, 1fr);
			gap: var(--space-l);
		}
	}
</style>

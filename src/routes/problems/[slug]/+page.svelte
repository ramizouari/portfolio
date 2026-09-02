<script lang="ts">
	import { resolve } from '$app/paths';
	import Reveal from '$lib/components/Reveal.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import Tex from '$lib/components/Tex.svelte';
	import { profile } from '$lib/data/profile';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const problem = $derived(data.meta);
</script>

<svelte:head>
	<title>{problem.title} — {profile.name}</title>
	<meta name="description" content="{problem.kicker} A problem I set for {problem.contest}." />
	<meta property="og:title" content="{problem.title} — {problem.contest}" />
	<meta property="og:description" content={problem.kicker} />
</svelte:head>

<article>
	<header class="head shell-wide">
		<a class="back" href="{resolve('/algorithms/')}#problems">
			<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
				<path
					d="M14 8H3M7 4L3 8l4 4"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			All problems
		</a>

		<div class="head-meta">
			<span class="mono idx">{problem.index}</span>
			<span class="sep" aria-hidden="true">/</span>
			<span class="mono contest">{problem.contest}</span>
			<span class="sep" aria-hidden="true">/</span>
			<span class="mono">{problem.year}</span>
			{#if problem.division}
				<span class="sep" aria-hidden="true">/</span>
				<span class="mono division">{problem.division}</span>
			{/if}
		</div>

		<h1>{problem.title}</h1>
		<p class="kicker">{problem.kicker}</p>

		<div class="signature">
			<Tex html={data.signature} label={problem.signatureTex} />
		</div>

		<a class="repo" href={problem.repo} rel="noreferrer" target="_blank">
			<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
				<path
					d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
				/>
			</svg>
			Contest repository
		</a>
	</header>

	<div class="body shell-wide">
		<aside class="aside">
			<Reveal>
				<div class="aside-block">
					<h2 class="aside-title">Topics</h2>
					<div class="tags">
						{#each problem.tags as tag (tag)}
							<Pill>{tag}</Pill>
						{/each}
					</div>
				</div>

				<div class="aside-block">
					<h2 class="aside-title">Constraints</h2>
					<ul class="constraints">
						{#each problem.constraints as line (line)}
							<li class="mono">{line}</li>
						{/each}
					</ul>
				</div>

				<div class="aside-block">
					<h2 class="aside-title">Complexity</h2>
					<p class="mono complexity">{problem.complexity}</p>
				</div>

				{#if problem.variants}
					<div class="aside-block">
						<h2 class="aside-title">Versions</h2>
						<dl class="variants">
							{#each problem.variants as variant (variant.label)}
								<dt class="mono">{variant.label}</dt>
								<dd>{variant.note}</dd>
							{/each}
						</dl>
					</div>
				{/if}
			</Reveal>
		</aside>

		<div class="main">
			<Reveal>
				<section class="block">
					<h2>Statement</h2>
					{#each data.statement as paragraph, i (i)}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- built from literals in this repo -->
						<p class="prose">{@html paragraph}</p>
					{/each}
				</section>
			</Reveal>

			<Reveal delay={70}>
				<section class="block">
					<h2>What it is really asking</h2>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- built from literals in this repo -->
					<p class="reduction">{@html data.reduction}</p>
				</section>
			</Reveal>

			<Reveal delay={70}>
				<section class="block">
					<h2>Solution</h2>
					<p class="ideas-note">The ideas that carry it, not a full editorial.</p>
					<ol class="ideas">
						{#each data.ideas as idea, i (idea.title)}
							<li>
								<span class="idea-idx mono">{String(i + 1).padStart(2, '0')}</span>
								<div class="idea-body">
									<h3>{idea.title}</h3>
									<!-- eslint-disable-next-line svelte/no-at-html-tags -- built from literals in this repo -->
									<p class="prose">{@html idea.body}</p>
									{#if idea.tex && idea.label}
										<Tex html={idea.tex} label={idea.label} />
									{/if}
								</div>
							</li>
						{/each}
					</ol>
				</section>
			</Reveal>
		</div>
	</div>

	<nav class="pager shell-wide" aria-label="Other problems">
		{#if data.prev}
			<a class="page-link prev" href="{resolve('/problems/[slug]', { slug: data.prev.slug })}/">
				<span class="mono dir">← Previous</span>
				<span class="page-name">{data.prev.title}</span>
			</a>
		{:else}
			<span></span>
		{/if}
		{#if data.next}
			<a class="page-link next" href="{resolve('/problems/[slug]', { slug: data.next.slug })}/">
				<span class="mono dir">Next →</span>
				<span class="page-name">{data.next.title}</span>
			</a>
		{/if}
	</nav>
</article>

<style>
	.head {
		padding-block: var(--space-2xl) var(--space-xl);
	}

	.back {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-family: var(--font-mono);
		font-size: var(--step--2);
		letter-spacing: 0.06em;
		color: var(--fg-4);
		transition:
			color var(--dur-fast) var(--ease),
			gap var(--dur-fast) var(--ease);
	}

	.back:hover {
		color: var(--accent);
		gap: 0.7rem;
	}

	.head-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-top: var(--space-l);
		font-size: var(--step--2);
		color: var(--fg-3);
	}

	.sep {
		color: var(--fg-4);
	}

	.idx {
		color: var(--fg-4);
	}

	.contest {
		color: var(--accent);
	}

	.division {
		color: var(--gold);
	}

	h1 {
		margin-top: var(--space-s);
		font-size: var(--step-6);
	}

	.kicker {
		margin-top: var(--space-2xs);
		font-family: var(--font-display);
		font-style: italic;
		font-size: var(--step-2);
		color: var(--fg-2);
		max-width: 34ch;
	}

	.signature {
		margin-top: var(--space-l);
		padding: var(--space-s) var(--space-m);
		border-left: 2px solid var(--accent-line);
		background: var(--surface);
		border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
		max-width: 46rem;
	}

	.repo {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: var(--space-l);
		padding: 0.5rem 1rem;
		border: 1px solid var(--line-strong);
		border-radius: 999px;
		font-size: var(--step--1);
		color: var(--fg-2);
		transition:
			color var(--dur-fast) var(--ease),
			border-color var(--dur-fast) var(--ease);
	}

	.repo:hover {
		color: var(--accent);
		border-color: var(--accent-line);
	}

	.body {
		display: grid;
		gap: var(--space-xl);
		padding-block: var(--space-xl) var(--space-2xl);
		border-top: 1px solid var(--line);
	}

	.aside {
		align-content: start;
	}

	.aside-block + .aside-block {
		margin-top: var(--space-l);
	}

	.aside-title {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-4);
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--line);
		margin-bottom: var(--space-s);
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.constraints {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.35rem;
	}

	.constraints li {
		font-size: var(--step--2);
		color: var(--fg-3);
		line-height: 1.5;
	}

	.complexity {
		font-size: var(--step--2);
		line-height: 1.6;
		color: var(--flow);
	}

	.variants {
		margin: 0;
		display: grid;
		gap: 0.6rem;
	}

	.variants dt {
		font-size: var(--step--2);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.variants dd {
		margin: 0.15rem 0 0;
		font-size: var(--step--2);
		line-height: 1.6;
		color: var(--fg-3);
	}

	.main > :global(* + *) {
		margin-top: var(--space-2xl);
	}

	.block h2 {
		font-size: var(--step-3);
	}

	.prose {
		font-size: var(--step-0);
		line-height: 1.7;
		color: var(--fg-2);
		max-width: 64ch;
	}

	.block > .prose {
		margin-top: var(--space-s);
	}

	.block > .prose + .prose {
		margin-top: var(--space-m);
	}

	.reduction {
		margin-top: var(--space-s);
		padding: var(--space-m);
		border: 1px solid var(--accent-line);
		border-left-width: 2px;
		border-radius: var(--radius-lg);
		background: var(--accent-soft);
		font-size: var(--step-0);
		line-height: 1.65;
		color: var(--fg);
		max-width: 62ch;
	}

	.ideas-note {
		margin-top: var(--space-2xs);
		font-size: var(--step--1);
		color: var(--fg-4);
	}

	.ideas {
		list-style: none;
		padding: 0;
		margin: var(--space-m) 0 0;
		border-top: 1px solid var(--line);
	}

	.ideas li {
		display: grid;
		grid-template-columns: 2.5rem minmax(0, 1fr);
		gap: var(--space-s);
		padding-block: var(--space-m);
		border-bottom: 1px solid var(--line);
	}

	.idea-idx {
		font-size: var(--step--2);
		color: var(--fg-4);
		padding-top: 0.35rem;
	}

	.idea-body {
		min-width: 0;
	}

	.idea-body h3 {
		font-size: var(--step-1);
		line-height: 1.3;
	}

	.idea-body .prose {
		margin-top: var(--space-2xs);
		font-size: var(--step--1);
		line-height: 1.7;
	}

	.idea-body :global(.tex) {
		margin-top: var(--space-s);
	}

	.prose :global(code),
	.reduction :global(code) {
		font-family: var(--font-mono);
		font-size: 0.88em;
		padding: 0.1em 0.35em;
		border-radius: var(--radius);
		background: var(--surface-2);
		color: var(--fg);
	}

	.prose :global(em) {
		font-style: italic;
		color: var(--fg);
	}

	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-s);
		padding-block: var(--space-xl) var(--space-2xl);
		border-top: 1px solid var(--line);
	}

	.page-link {
		display: grid;
		gap: 0.3rem;
		padding: var(--space-m);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		transition:
			border-color var(--dur-fast) var(--ease),
			background var(--dur-fast) var(--ease);
	}

	.page-link:hover {
		border-color: var(--accent-line);
		background: var(--surface);
	}

	.next {
		text-align: right;
	}

	.dir {
		font-size: var(--step--2);
		color: var(--fg-4);
	}

	.page-name {
		font-family: var(--font-display);
		font-size: var(--step-1);
	}

	@media (min-width: 62rem) {
		.body {
			grid-template-columns: 15rem minmax(0, 1fr);
			gap: var(--space-2xl);
		}

		.aside {
			position: sticky;
			top: 6rem;
			align-self: start;
		}

		.ideas li {
			grid-template-columns: 4rem minmax(0, 1fr);
			gap: var(--space-l);
		}
	}
</style>

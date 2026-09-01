<script lang="ts">
	import { resolve } from '$app/paths';
	import Reveal from '$lib/components/Reveal.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import { profile } from '$lib/data/profile';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const project = $derived(data.project);
	const domainLabel = $derived(
		{
			research: 'Research',
			platform: 'Platform',
			systems: 'Systems',
			tooling: 'Tooling'
		}[project.domain]
	);
</script>

<svelte:head>
	<title>{project.name} — {profile.name}</title>
	<meta name="description" content={project.summary} />
	<meta property="og:title" content="{project.name} — {project.kicker}" />
	<meta property="og:description" content={project.summary} />
</svelte:head>

<article>
	<header class="head shell-wide">
		<a class="back" href="{resolve('/work/')}#projects">
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
			All projects
		</a>

		<div class="head-meta">
			<span class="mono">{project.org}</span>
			<span class="sep" aria-hidden="true">/</span>
			<span class="mono">{project.year}</span>
			<span class="sep" aria-hidden="true">/</span>
			<span class="mono">{domainLabel}</span>
			{#if project.visibility === 'private'}
				<span class="sep" aria-hidden="true">/</span>
				<span class="mono closed">closed source</span>
			{/if}
		</div>

		<h1>{project.name}</h1>
		<p class="kicker">{project.kicker}</p>
		<p class="lede">{project.summary}</p>

		{#if project.repo}
			<a class="repo" href={project.repo} rel="noreferrer" target="_blank">
				<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
					<path
						d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
					/>
				</svg>
				View on GitHub
			</a>
		{/if}
	</header>

	{#if project.metrics?.length}
		<div class="band">
			<dl class="shell-wide metrics">
				{#each project.metrics as metric (metric.label)}
					<div>
						<dt>{metric.value}</dt>
						<dd>{metric.label}</dd>
					</div>
				{/each}
			</dl>
		</div>
	{/if}

	<div class="body shell-wide">
		<aside class="aside">
			<Reveal>
				<div class="aside-block">
					<h2 class="aside-title">Role</h2>
					<p>{project.role}</p>
				</div>
				<div class="aside-block">
					<h2 class="aside-title">Stack</h2>
					<div class="stack">
						{#each project.stack as tool (tool)}
							<Pill>{tool}</Pill>
						{/each}
					</div>
				</div>
			</Reveal>
		</aside>

		<div class="main">
			<Reveal>
				<section class="block">
					<h2>The problem</h2>
					<p class="problem">{project.problem}</p>
				</section>
			</Reveal>

			<Reveal delay={70}>
				<section class="block">
					<h2>What I built</h2>
					<ol class="steps">
						{#each project.approach as step, i (step)}
							<li>
								<span class="step-idx mono">{String(i + 1).padStart(2, '0')}</span>
								<p>{step}</p>
							</li>
						{/each}
					</ol>
				</section>
			</Reveal>

			{#if project.outcome}
				<Reveal delay={70}>
					<section class="block outcome">
						<h2>Outcome</h2>
						<p>{project.outcome}</p>
					</section>
				</Reveal>
			{/if}
		</div>
	</div>

	<nav class="pager shell-wide" aria-label="Other projects">
		{#if data.prev}
			<a class="page-link prev" href="{resolve('/projects/[slug]', { slug: data.prev.slug })}/">
				<span class="mono dir">← Previous</span>
				<span class="page-name">{data.prev.name}</span>
			</a>
		{:else}
			<span></span>
		{/if}
		{#if data.next}
			<a class="page-link next" href="{resolve('/projects/[slug]', { slug: data.next.slug })}/">
				<span class="mono dir">Next →</span>
				<span class="page-name">{data.next.name}</span>
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

	.closed {
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
		max-width: 30ch;
	}

	.head .lede {
		margin-top: var(--space-m);
		max-width: 56ch;
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

	.band {
		border-block: 1px solid var(--line);
		background: var(--bg-sink);
	}

	.metrics {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-l) var(--space-2xl);
		margin: 0;
		padding-block: var(--space-m);
	}

	.metrics dt {
		font-family: var(--font-display);
		font-size: var(--step-3);
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.metrics dd {
		margin: 0.2rem 0 0;
		font-family: var(--font-mono);
		font-size: var(--step--2);
		letter-spacing: 0.08em;
		color: var(--fg-4);
	}

	.body {
		display: grid;
		gap: var(--space-xl);
		padding-block: var(--space-2xl);
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

	.aside p {
		font-size: var(--step--1);
		color: var(--fg-2);
		line-height: 1.6;
	}

	.stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.main > :global(* + *) {
		margin-top: var(--space-2xl);
	}

	.block h2 {
		font-size: var(--step-3);
	}

	.problem {
		margin-top: var(--space-s);
		font-size: var(--step-1);
		line-height: 1.6;
		color: var(--fg-2);
		max-width: 58ch;
	}

	.steps {
		list-style: none;
		padding: 0;
		margin: var(--space-m) 0 0;
		border-top: 1px solid var(--line);
	}

	.steps li {
		display: grid;
		grid-template-columns: 2.5rem minmax(0, 1fr);
		gap: var(--space-s);
		padding-block: var(--space-s);
		border-bottom: 1px solid var(--line);
	}

	.step-idx {
		font-size: var(--step--2);
		color: var(--fg-4);
		padding-top: 0.3rem;
	}

	.steps p {
		font-size: var(--step-0);
		line-height: 1.65;
		color: var(--fg-2);
		max-width: 64ch;
	}

	.outcome p {
		margin-top: var(--space-s);
		padding: var(--space-m);
		border: 1px solid var(--accent-line);
		border-left-width: 2px;
		border-radius: var(--radius-lg);
		background: var(--accent-soft);
		font-size: var(--step-0);
		color: var(--fg);
		max-width: 60ch;
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

		.steps li {
			grid-template-columns: 4rem minmax(0, 1fr);
			gap: var(--space-l);
		}
	}
</style>

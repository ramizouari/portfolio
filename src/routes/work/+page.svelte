<script lang="ts">
	import { resolve } from '$app/paths';
	import Reveal from '$lib/components/Reveal.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import { roles } from '$lib/data/experience';
	import { featuredProjects, otherProjects } from '$lib/data/projects';
	import { profile } from '$lib/data/profile';

	let filter = $state<'all' | 'research' | 'platform' | 'systems' | 'tooling'>('all');

	const all = [...featuredProjects, ...otherProjects];
	const shown = $derived(filter === 'all' ? all : all.filter((p) => p.domain === filter));

	const filters = [
		{ key: 'all', label: 'Everything' },
		{ key: 'research', label: 'Research' },
		{ key: 'platform', label: 'Platforms' },
		{ key: 'systems', label: 'Systems' },
		{ key: 'tooling', label: 'Tooling' }
	] as const;
</script>

<svelte:head>
	<title>Work — {profile.name}</title>
	<meta
		name="description"
		content="Roles and projects across generative modelling for oncology, LLM platforms, Text2SQL, reinforcement learning and native systems tooling."
	/>
</svelte:head>

<header class="page-head shell-wide">
	<p class="eyebrow">02 — Work</p>
	<h1>Work</h1>
	<p class="lede">
		Research groups, start-ups and one HPC cluster. Below: where I have been, and then the projects
		themselves — what the problem was, what I built, and what made it difficult.
	</p>
</header>

<!-- ── Timeline ─────────────────────────────────────────────────────────── -->
<section class="section shell-wide">
	<h2 class="section-title">Experience</h2>

	<ol class="timeline">
		{#each roles as role, i (role.company + role.start)}
			<Reveal as="li" delay={Math.min(i, 4) * 50}>
				<div class="entry" data-kind={role.kind}>
					<div class="when">
						<span class="mono period">{role.period}</span>
						<span class="mono place">{role.location}</span>
					</div>

					<div class="what">
						<div class="title-row">
							<h3>{role.title}</h3>
							<span class="company">{role.company}</span>
						</div>
						<p class="summary">{role.summary}</p>

						{#if role.highlights.length > 1}
							<ul class="highlights">
								{#each role.highlights as item (item)}
									<li>{item}</li>
								{/each}
							</ul>
						{/if}

						<div class="stack">
							{#each role.stack as tool (tool)}
								<Pill>{tool}</Pill>
							{/each}
						</div>
					</div>
				</div>
			</Reveal>
		{/each}
	</ol>
</section>

<hr class="rule shell-wide" />

<!-- ── Projects ─────────────────────────────────────────────────────────── -->
<section class="section shell-wide" id="projects">
	<div class="projects-head">
		<h2 class="section-title">Projects</h2>
		<div class="filters" role="group" aria-label="Filter projects by kind">
			{#each filters as f (f.key)}
				<button
					type="button"
					class="chip"
					class:on={filter === f.key}
					aria-pressed={filter === f.key}
					onclick={() => (filter = f.key)}
				>
					{f.label}
				</button>
			{/each}
		</div>
	</div>

	<ul class="grid">
		{#each shown as project (project.slug)}
			<li>
				<a class="card" href="{resolve('/projects/[slug]', { slug: project.slug })}/">
					<div class="card-top">
						<span class="mono card-org">{project.org}</span>
						<span class="mono card-year">{project.year}</span>
					</div>

					<h3>{project.name}</h3>
					<p class="card-kicker">{project.kicker}</p>
					<p class="card-summary">{project.summary}</p>

					{#if project.metrics?.length}
						<dl class="metrics">
							{#each project.metrics as metric (metric.label)}
								<div>
									<dt>{metric.value}</dt>
									<dd>{metric.label}</dd>
								</div>
							{/each}
						</dl>
					{/if}

					<div class="card-foot">
						<div class="stack tight">
							{#each project.stack.slice(0, 4) as tool (tool)}
								<Pill>{tool}</Pill>
							{/each}
							{#if project.stack.length > 4}
								<span class="more mono">+{project.stack.length - 4}</span>
							{/if}
						</div>
						<svg class="arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
							<path
								d="M4 12L12 4M6 4h6v6"
								fill="none"
								stroke="currentColor"
								stroke-width="1.4"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</a>
			</li>
		{/each}
	</ul>

	{#if shown.length === 0}
		<p class="empty muted">Nothing in that category.</p>
	{/if}
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
		max-width: 54ch;
	}

	.section {
		padding-block: var(--space-xl) var(--space-3xl);
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
	}

	.rule {
		max-width: var(--shell-wide);
		margin-inline: auto;
	}

	/* ── Timeline ────────────────────────────────────────────────────────── */
	.timeline {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.entry {
		display: grid;
		gap: var(--space-s);
		padding-block: var(--space-l);
		border-bottom: 1px solid var(--line);
	}

	.when {
		display: grid;
		gap: 0.15rem;
		align-content: start;
		position: relative;
	}

	.period {
		font-size: var(--step--1);
		color: var(--fg-2);
	}

	.place {
		font-size: var(--step--2);
		color: var(--fg-4);
	}

	.title-row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.65rem;
	}

	.entry h3 {
		font-size: var(--step-2);
	}

	.company {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--accent);
	}

	[data-kind='research'] .company {
		color: var(--flow);
	}

	[data-kind='lead'] .company {
		color: var(--gold);
	}

	.summary {
		margin-top: var(--space-2xs);
		color: var(--fg-2);
		font-size: var(--step-0);
		max-width: 60ch;
	}

	.highlights {
		list-style: none;
		padding: 0;
		margin-top: var(--space-m);
		display: grid;
		gap: var(--space-xs);
		max-width: 66ch;
	}

	.highlights li {
		position: relative;
		padding-left: 1.4rem;
		font-size: var(--step--1);
		line-height: 1.65;
		color: var(--fg-3);
	}

	.highlights li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.66em;
		width: 0.55rem;
		height: 1px;
		background: var(--line-strong);
	}

	.stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: var(--space-m);
	}

	.stack.tight {
		margin-top: 0;
	}

	/* ── Projects ────────────────────────────────────────────────────────── */
	.projects-head {
		display: grid;
		gap: var(--space-s);
		padding-bottom: var(--space-l);
	}

	.projects-head .section-title {
		padding-bottom: 0;
		border-bottom: 0;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.chip {
		padding: 0.3rem 0.8rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: transparent;
		color: var(--fg-3);
		font-size: var(--step--1);
		cursor: pointer;
		transition:
			color var(--dur-fast) var(--ease),
			border-color var(--dur-fast) var(--ease),
			background var(--dur-fast) var(--ease);
	}

	.chip:hover {
		color: var(--fg);
		border-color: var(--line-strong);
	}

	.chip.on {
		color: var(--accent-fg);
		background: var(--accent);
		border-color: var(--accent);
	}

	.grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-s);
		border-top: 1px solid var(--line);
		padding-top: var(--space-s);
	}

	.card {
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 0.55rem;
		padding: var(--space-m);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--surface);
		transition:
			border-color var(--dur-fast) var(--ease),
			background var(--dur-fast) var(--ease),
			transform var(--dur-fast) var(--ease);
	}

	.card:hover {
		border-color: var(--accent-line);
		background: var(--surface-2);
		transform: translateY(-2px);
	}

	.card-top {
		display: flex;
		justify-content: space-between;
		gap: var(--space-s);
		font-size: var(--step--2);
		color: var(--fg-4);
	}

	.card-org {
		color: var(--accent);
	}

	.card h3 {
		font-size: var(--step-2);
		margin-top: 0.2rem;
	}

	.card-kicker {
		font-family: var(--font-display);
		font-style: italic;
		font-size: var(--step-0);
		color: var(--fg-2);
		line-height: 1.35;
	}

	.card-summary {
		font-size: var(--step--1);
		line-height: 1.6;
		color: var(--fg-3);
	}

	.metrics {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-m);
		margin: var(--space-2xs) 0 0;
		padding-top: var(--space-2xs);
	}

	.metrics dt {
		font-family: var(--font-display);
		font-size: var(--step-1);
		line-height: 1.1;
		color: var(--fg);
	}

	.metrics dd {
		margin: 0;
		font-family: var(--font-mono);
		font-size: var(--step--2);
		color: var(--fg-4);
	}

	.card-foot {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--space-s);
		margin-top: auto;
		padding-top: var(--space-s);
	}

	.more {
		align-self: center;
		font-size: var(--step--2);
		color: var(--fg-4);
	}

	.arrow {
		flex: none;
		color: var(--fg-4);
		transition:
			color var(--dur-fast) var(--ease),
			transform var(--dur-fast) var(--ease);
	}

	.card:hover .arrow {
		color: var(--accent);
		transform: translate(2px, -2px);
	}

	.empty {
		padding-block: var(--space-xl);
	}

	@media (min-width: 58rem) {
		.entry {
			grid-template-columns: 15rem minmax(0, 1fr);
			gap: var(--space-l);
		}

		.projects-head {
			grid-template-columns: auto 1fr;
			align-items: center;
			gap: var(--space-l);
		}

		.filters {
			justify-content: flex-end;
		}

		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 82rem) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>

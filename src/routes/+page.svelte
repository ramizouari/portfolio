<script lang="ts">
	import { resolve } from '$app/paths';
	import FlowField from '$lib/components/FlowField.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import SectionHead from '$lib/components/SectionHead.svelte';
	import Tex from '$lib/components/Tex.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import { profile } from '$lib/data/profile';
	import { threads } from '$lib/data/research';
	import { featuredProjects } from '$lib/data/projects';
	import { roles } from '$lib/data/experience';
	import { awards, contests } from '$lib/data/algorithms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const current = roles.filter((r) => r.end === 'present');
	const previous = roles.filter((r) => r.featured && r.end !== 'present');
	const preview = featuredProjects.slice(0, 6);
	const problemsAuthored = 58;
</script>

<svelte:head>
	<title>{profile.name} — {profile.role}</title>
	<meta
		name="description"
		content="Rami Zouari — machine learning engineer working on continuous-time generative models, jump ODEs, optimal transport and reinforcement learning. ICPC Finalist and problem setter."
	/>
	<meta property="og:title" content="{profile.name} — {profile.role}" />
	<meta property="og:description" content={profile.tagline} />
</svelte:head>

<!-- ── Hero ─────────────────────────────────────────────────────────────── -->
<section class="hero">
	<FlowField />
	<div class="hero-inner shell-wide">
		<p class="eyebrow">{profile.location} · {profile.role}</p>

		<h1>
			<span class="line">Rami</span>
			<span class="line indent">Zouari</span>
		</h1>

		<p class="tagline">{profile.tagline}</p>

		<div class="cta">
			<a class="btn primary" href={resolve('/research/')}>
				Read the research
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
			<a class="btn" href={resolve('/work/')}>Selected work</a>
			<a class="btn ghost" href="mailto:{profile.email}">Get in touch</a>
		</div>
	</div>

	<figure class="legend">
		<Tex html={data.heroEquation} label={profile.heroEquation} display={false} />
		<figcaption>
			A jump ODE — smooth flow, punctuated by events. It is the model behind much of my recent work,
			and behind this drawing.
		</figcaption>
	</figure>
</section>

<!-- ── Stats ────────────────────────────────────────────────────────────── -->
<section class="stats-band">
	<div class="shell-wide stats">
		{#each profile.stats as stat, i (stat.label)}
			<Reveal delay={i * 70} class="stat">
				<span class="stat-value">{stat.value}</span>
				<span class="stat-label">{stat.label}</span>
				<span class="stat-detail">{stat.detail}</span>
			</Reveal>
		{/each}
	</div>
</section>

<!-- ── Now ──────────────────────────────────────────────────────────────── -->
<section class="section now-section shell-wide">
	<p class="eyebrow now-label">Currently</p>

	<div class="now-roles">
		{#each current as role, i (role.company)}
			<Reveal delay={i * 70}>
				<div class="now">
					<div class="now-side">
						<p class="now-role">{role.title}</p>
						<p class="now-company">{role.company}</p>
						<p class="mono now-period">{role.period}</p>
					</div>
					<div class="now-main">
						<p class="now-lede">{role.summary}</p>
						<ul class="now-list">
							{#each role.highlights.slice(0, 2) as item (item)}
								<li>{item}</li>
							{/each}
						</ul>
						<div class="now-stack">
							{#each role.stack as tool (tool)}
								<Pill>{tool}</Pill>
							{/each}
						</div>
					</div>
				</div>
			</Reveal>
		{/each}
	</div>

	<div class="prev">
		<p class="eyebrow prev-label">Previously</p>
		<ul class="prev-list">
			{#each previous as role, i (role.company)}
				<Reveal as="li" delay={i * 50}>
					<div class="prev-card">
						<div class="prev-top">
							<span class="prev-company">{role.company}</span>
							<span class="mono prev-period">{role.period}</span>
						</div>
						<p class="prev-role">{role.title}</p>
						<p class="prev-summary">{role.summary}</p>
						<div class="prev-stack">
							{#each role.stack.slice(0, 5) as tool (tool)}
								<Pill>{tool}</Pill>
							{/each}
						</div>
					</div>
				</Reveal>
			{/each}
		</ul>
	</div>
</section>

<hr class="rule shell-wide" />

<!-- ── Work ─────────────────────────────────────────────────────────────── -->
<section class="section shell-wide">
	<SectionHead
		eyebrow="01 — Selected work"
		title="Systems that had to survive contact with reality"
		lede="Research pipelines, LLM platforms and native tooling. Most of it is closed source; what follows is what I built and why it was hard."
		more={{ href: '/work/', label: 'All work' }}
	/>

	<ol class="work">
		{#each preview as project, i (project.slug)}
			<Reveal as="li" delay={i * 50}>
				<a class="row" href="{resolve('/projects/[slug]', { slug: project.slug })}/">
					<span class="row-year mono">{project.year}</span>
					<span class="row-name">{project.name}</span>
					<span class="row-kicker">{project.kicker}</span>
					<span class="row-org mono">{project.org}</span>
					<svg class="row-arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
						<path
							d="M4 12L12 4M6 4h6v6"
							fill="none"
							stroke="currentColor"
							stroke-width="1.4"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</a>
			</Reveal>
		{/each}
	</ol>
</section>

<hr class="rule shell-wide" />

<!-- ── Research ─────────────────────────────────────────────────────────── -->
<section class="section shell-wide">
	<SectionHead
		eyebrow="02 — Research"
		title="Five things I keep coming back to"
		lede="Survival and jump dynamics in continuous time, transport between distributions, decision-making under non-stationarity, and games on graphs. Different fields; the same instinct to write the problem down properly before writing any code."
		more={{ href: '/research/', label: 'All threads' }}
	/>

	<ol class="threads">
		{#each threads as thread, i (thread.slug)}
			<Reveal as="li" delay={i * 60}>
				<a class="thread" href="{resolve('/research/')}#{thread.slug}">
					<span class="thread-idx mono">{thread.index}</span>
					<div class="thread-body">
						<h3>{thread.title}</h3>
						<p class="thread-kicker">{thread.kicker}</p>
						<div class="thread-meta">
							<span class="mono">{thread.context}</span>
							<span class="dot" aria-hidden="true">·</span>
							<span class="mono">{thread.period}</span>
						</div>
					</div>
					<div class="thread-eq" aria-hidden="true">
						<Tex html={data.signatures[thread.slug]} label={thread.signature} />
					</div>
				</a>
			</Reveal>
		{/each}
	</ol>
</section>

<hr class="rule shell-wide" />

<!-- ── Algorithms ───────────────────────────────────────────────────────── -->
<section class="section shell-wide">
	<SectionHead
		eyebrow="03 — Algorithms"
		title="Where the habits came from"
		lede="Competitive programming taught me to state a problem exactly, bound it, and then earn the solution. I still do it — mostly from the other side of the judge now."
		more={{ href: '/algorithms/', label: 'Problems & contests' }}
	/>

	<div class="cp">
		<Reveal class="cp-medals">
			{#each awards.filter((a) => a.medal !== 'other') as award (award.id)}
				<div class="medal" data-medal={award.medal}>
					<span class="medal-year mono">{award.year}</span>
					<span class="medal-title"
						>{award.title.replace(' — Gold', '').replace(' — Silver', '')}</span
					>
					<span class="medal-kind">{award.kind}</span>
					<span class="medal-detail">{award.detail}</span>
				</div>
			{/each}
		</Reveal>

		<Reveal class="cp-setting" delay={90}>
			<p class="eyebrow">On the other side</p>
			<p class="cp-number">{problemsAuthored}<span>+</span></p>
			<p class="cp-caption">
				original problems written and judged across {contests.length} contests — including the complete
				problem set for the VertexCover Contest.
			</p>
			<ul class="cp-list">
				{#each contests as contest (contest.name)}
					<li>
						<span>{contest.name}</span>
						<span class="mono">{contest.year}</span>
					</li>
				{/each}
			</ul>
		</Reveal>
	</div>
</section>

<style>
	/* ── Hero ────────────────────────────────────────────────────────────── */
	.hero {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: min(92svh, 54rem);
		padding-block: var(--space-3xl) var(--space-2xl);
		overflow: hidden;
		isolation: isolate;
	}

	.hero::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--glow);
		pointer-events: none;
		z-index: -1;
	}

	.hero-inner {
		position: relative;
		z-index: 1;
	}

	.hero-inner::before {
		content: '';
		position: absolute;
		inset: -3rem -6rem -3rem -6rem;
		z-index: -1;
		pointer-events: none;
		background: radial-gradient(
			78% 62% at 34% 50%,
			var(--bg) 0%,
			color-mix(in oklab, var(--bg) 88%, transparent) 46%,
			transparent 82%
		);
	}

	@media (min-width: 58rem) {
		.hero-inner::before {
			background: radial-gradient(
				58% 66% at 26% 50%,
				var(--bg) 0%,
				color-mix(in oklab, var(--bg) 80%, transparent) 44%,
				transparent 76%
			);
		}
	}

	h1 {
		margin-top: var(--space-m);
		font-size: var(--step-7);
		line-height: 0.9;
		letter-spacing: -0.04em;
	}

	.line {
		display: block;
	}

	.indent {
		padding-left: 0.16em;
		font-style: italic;
		color: var(--fg-2);
	}

	.tagline {
		margin-top: var(--space-l);
		max-width: 44ch;
		font-size: var(--step-1);
		line-height: 1.5;
		color: var(--fg-2);
		text-wrap: pretty;
	}

	.cta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs);
		margin-top: var(--space-xl);
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1.1rem;
		border: 1px solid var(--line-strong);
		border-radius: 999px;
		background: color-mix(in oklab, var(--surface) 70%, transparent);
		backdrop-filter: blur(6px);
		font-size: var(--step--1);
		color: var(--fg-2);
		transition:
			color var(--dur-fast) var(--ease),
			border-color var(--dur-fast) var(--ease),
			background var(--dur-fast) var(--ease),
			transform var(--dur-fast) var(--ease);
	}

	.btn:hover {
		color: var(--fg);
		border-color: var(--accent-line);
		transform: translateY(-1px);
	}

	.btn.primary {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--accent-fg);
		font-weight: 500;
	}

	.btn.primary:hover {
		color: var(--accent-fg);
		filter: brightness(1.08);
	}

	.btn.ghost {
		background: transparent;
		border-color: transparent;
		color: var(--fg-3);
	}

	.legend {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: var(--shell-wide);
		margin: var(--space-2xl) auto 0;
		padding-inline: var(--gutter);
		display: grid;
		gap: 0.45rem;
		justify-items: start;
	}

	.legend figcaption {
		max-width: 46ch;
		font-size: var(--step--1);
		color: var(--fg-4);
		line-height: 1.5;
	}

	/* ── Stats ───────────────────────────────────────────────────────────── */
	.stats-band {
		border-block: 1px solid var(--line);
		background: var(--bg-sink);
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	.stats :global(.stat) {
		display: grid;
		gap: 0.15rem;
		padding: var(--space-m) var(--space-s) var(--space-m) 0;
		border-right: 1px solid var(--line-soft);
	}

	.stats :global(.stat:nth-child(2n)) {
		border-right: 0;
		padding-left: var(--space-s);
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: var(--step-3);
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.stat-label {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.stat-detail {
		font-size: var(--step--1);
		color: var(--fg-3);
		line-height: 1.4;
	}

	/* ── Sections ────────────────────────────────────────────────────────── */
	.section {
		padding-block: var(--space-3xl);
	}

	.rule {
		max-width: var(--shell-wide);
		margin-inline: auto;
	}

	/* ── Previously ──────────────────────────────────────────────────────── */
	.prev {
		margin-top: var(--space-2xl);
	}

	.prev-label {
		padding-bottom: var(--space-m);
	}

	.prev-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-s);
	}

	.prev-card {
		display: grid;
		gap: 0.35rem;
		height: 100%;
		padding: var(--space-m);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--surface);
	}

	.prev-top {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.4rem var(--space-s);
	}

	.prev-company {
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--accent);
	}

	.prev-period {
		font-size: var(--step--2);
		color: var(--fg-4);
	}

	.prev-role {
		font-family: var(--font-display);
		font-size: var(--step-2);
		line-height: 1.15;
	}

	.prev-summary {
		font-size: var(--step--1);
		line-height: 1.6;
		color: var(--fg-3);
	}

	.prev-stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: auto;
		padding-top: var(--space-2xs);
	}

	/* ── Now ─────────────────────────────────────────────────────────────── */
	.now-section {
		/* The last role already ends on a rule, so it needs less room below. */
		padding-bottom: var(--space-xl);
	}

	.now-label {
		padding-bottom: var(--space-l);
	}

	.now-roles {
		display: grid;
		border-top: 1px solid var(--line);
	}

	.now-roles > :global(*) {
		padding-block: var(--space-l);
		border-bottom: 1px solid var(--line);
	}

	.now {
		display: grid;
		gap: var(--space-l);
	}

	.now-side {
		display: grid;
		gap: 0.2rem;
		align-content: start;
	}

	.now-role {
		font-family: var(--font-display);
		font-size: var(--step-2);
		line-height: 1.15;
	}

	.now-company {
		font-size: var(--step-0);
		color: var(--accent);
	}

	.now-period {
		color: var(--fg-4);
		margin-top: 0.2rem;
	}

	.now-lede {
		font-size: var(--step-1);
		line-height: 1.5;
		color: var(--fg-2);
		max-width: 54ch;
	}

	.now-list {
		list-style: none;
		padding: 0;
		margin-top: var(--space-m);
		display: grid;
		gap: var(--space-xs);
		max-width: 62ch;
	}

	.now-list li {
		position: relative;
		padding-left: 1.4rem;
		font-size: var(--step--1);
		color: var(--fg-3);
		line-height: 1.6;
	}

	.now-list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 0.55rem;
		height: 1px;
		background: var(--accent);
	}

	.now-stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-top: var(--space-m);
	}

	/* ── Threads ─────────────────────────────────────────────────────────── */
	.threads {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid var(--line);
	}

	.thread {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-s) var(--space-m);
		padding-block: var(--space-m);
		border-bottom: 1px solid var(--line);
		transition: background var(--dur-fast) var(--ease);
	}

	.thread:hover {
		background: color-mix(in oklab, var(--surface) 60%, transparent);
	}

	.thread-idx {
		color: var(--fg-4);
		padding-top: 0.35rem;
		transition: color var(--dur-fast) var(--ease);
	}

	.thread:hover .thread-idx {
		color: var(--accent);
	}

	.thread h3 {
		font-size: var(--step-2);
	}

	.thread-kicker {
		margin-top: 0.2rem;
		color: var(--fg-2);
		font-size: var(--step-0);
		max-width: 44ch;
	}

	.thread-meta {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.55rem;
		font-size: var(--step--2);
		color: var(--fg-4);
	}

	.thread-eq {
		grid-column: 2;
		font-size: 0.88rem;
		color: var(--fg-3);
		opacity: 0.62;
		max-width: 100%;
		transition: opacity var(--dur) var(--ease);
	}

	.thread:hover .thread-eq {
		opacity: 1;
	}

	/* ── Work rows ───────────────────────────────────────────────────────── */
	.work {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid var(--line);
	}

	.row {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-areas:
			'name arrow'
			'kicker kicker'
			'year org';
		gap: 0.3rem var(--space-s);
		align-items: baseline;
		padding-block: var(--space-m);
		border-bottom: 1px solid var(--line);
		transition: background var(--dur-fast) var(--ease);
	}

	.row:hover {
		background: color-mix(in oklab, var(--surface) 60%, transparent);
	}

	.row-year {
		grid-area: year;
		color: var(--fg-4);
		font-size: var(--step--2);
	}

	.row-name {
		grid-area: name;
		font-family: var(--font-display);
		font-size: var(--step-2);
		letter-spacing: -0.015em;
	}

	.row-kicker {
		grid-area: kicker;
		color: var(--fg-2);
		font-size: var(--step--1);
	}

	.row-org {
		grid-area: org;
		color: var(--fg-4);
		font-size: var(--step--2);
		text-align: right;
	}

	.row-arrow {
		grid-area: arrow;
		align-self: center;
		color: var(--fg-4);
		transition:
			color var(--dur-fast) var(--ease),
			transform var(--dur-fast) var(--ease);
	}

	.row:hover .row-arrow {
		color: var(--accent);
		transform: translate(2px, -2px);
	}

	/* ── Competitive ─────────────────────────────────────────────────────── */
	.cp {
		display: grid;
		gap: var(--space-xl);
	}

	.cp :global(.cp-medals) {
		display: grid;
		gap: var(--space-s);
		align-content: start;
	}

	.medal {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 0.2rem var(--space-s);
		align-items: baseline;
		padding: var(--space-s) var(--space-m);
		border: 1px solid var(--line);
		border-left: 2px solid var(--gold);
		border-radius: var(--radius);
		background: var(--surface);
	}

	.medal[data-medal='finalist'] {
		border-left-color: var(--accent);
	}

	.medal[data-medal='silver'] {
		border-left-color: var(--fg-4);
	}

	.medal-year {
		color: var(--fg-4);
		font-size: var(--step--2);
	}

	.medal-title {
		font-size: var(--step-0);
	}

	.medal-kind {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.medal[data-medal='finalist'] .medal-kind {
		color: var(--accent);
	}

	.medal[data-medal='silver'] .medal-kind {
		color: var(--fg-3);
	}

	.medal-detail {
		grid-column: 2 / -1;
		font-size: var(--step--1);
		color: var(--fg-3);
	}

	.cp :global(.cp-setting) {
		align-content: start;
	}

	.cp-number {
		font-family: var(--font-display);
		font-size: var(--step-7);
		line-height: 0.9;
		letter-spacing: -0.04em;
		margin-top: var(--space-s);
	}

	.cp-number span {
		color: var(--accent);
	}

	.cp-caption {
		margin-top: var(--space-xs);
		max-width: 38ch;
		color: var(--fg-2);
		font-size: var(--step--1);
	}

	.cp-list {
		list-style: none;
		padding: 0;
		margin-top: var(--space-m);
		display: grid;
		gap: 0;
		max-width: 30rem;
	}

	.cp-list li {
		display: flex;
		justify-content: space-between;
		gap: var(--space-s);
		padding-block: 0.55rem;
		border-bottom: 1px solid var(--line-soft);
		font-size: var(--step--1);
		color: var(--fg-2);
	}

	.cp-list li :global(.mono) {
		color: var(--fg-4);
	}

	/* ── Responsive ──────────────────────────────────────────────────────── */
	@media (min-width: 44rem) {
		.stats {
			grid-template-columns: repeat(4, 1fr);
		}

		.stats :global(.stat:nth-child(2n)) {
			border-right: 1px solid var(--line-soft);
			padding-left: 0;
		}

		.stats :global(.stat) {
			padding-inline: var(--space-m);
		}

		.stats :global(.stat:first-child) {
			padding-left: 0;
		}

		.stats :global(.stat:last-child) {
			border-right: 0;
		}
	}

	@media (min-width: 58rem) {
		.now {
			grid-template-columns: 16rem 1fr;
			gap: var(--space-2xl);
		}

		.prev-list {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.thread {
			grid-template-columns: 3rem minmax(0, 1fr) minmax(0, 22rem);
			align-items: start;
			gap: var(--space-l);
		}

		.thread-eq {
			grid-column: 3;
			padding-top: 0.4rem;
		}

		.row {
			grid-template-columns: 7rem minmax(0, 21rem) minmax(0, 1fr) auto auto;
			grid-template-areas: 'year name kicker org arrow';
			gap: var(--space-m);
			align-items: center;
		}

		.row-name {
			font-size: var(--step-1);
		}

		.row-org {
			min-width: 9rem;
		}

		.cp {
			grid-template-columns: 1.05fr 1fr;
			gap: var(--space-2xl);
		}
	}
</style>

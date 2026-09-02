<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import { profile } from '$lib/data/profile';
	import { education } from '$lib/data/experience';
	import { skillGroups, languages } from '$lib/data/skills';
</script>

<svelte:head>
	<title>About — {profile.name}</title>
	<meta
		name="description"
		content="Rami Zouari — software engineer from INSAT, machine learning researcher, ICPC Finalist. Skills, education and how to get in touch."
	/>
</svelte:head>

<header class="page-head shell-wide">
	<p class="eyebrow">04 — About</p>
	<h1>About</h1>
</header>

<section class="intro shell-wide">
	<Reveal class="intro-text">
		{#each profile.intro as paragraph, i (i)}
			<p class:first={i === 0}>{paragraph}</p>
		{/each}
	</Reveal>

	<Reveal class="intro-side" delay={80}>
		<dl class="facts">
			<div>
				<dt>Based in</dt>
				<dd>{profile.location}</dd>
			</div>
			<div>
				<dt>Focus</dt>
				<dd>{profile.subrole}</dd>
			</div>
			<div>
				<dt>Languages</dt>
				<dd>
					{#each languages as lang, i (lang.name)}<span class="lang"
							>{lang.name} <em>{lang.level}</em></span
						>{#if i < languages.length - 1}<br />{/if}{/each}
				</dd>
			</div>
			<div>
				<dt>Email</dt>
				<dd><a class="text-link" href="mailto:{profile.email}">{profile.email}</a></dd>
			</div>
			<div>
				<dt>Elsewhere</dt>
				<dd>
					<a class="text-link" href={profile.github} rel="me noreferrer" target="_blank">GitHub</a>
					·
					<a class="text-link" href={profile.linkedin} rel="me noreferrer" target="_blank"
						>LinkedIn</a
					>
				</dd>
			</div>
		</dl>
	</Reveal>
</section>

<hr class="rule shell-wide" />

<section class="section shell-wide">
	<h2 class="section-title">Education</h2>
	<ol class="education">
		{#each education as entry, i (entry.institution)}
			<Reveal as="li" delay={i * 60}>
				<div class="edu">
					<span class="mono edu-period">{entry.period}</span>
					<div>
						<h3>{entry.credential}</h3>
						<p class="edu-institution">{entry.institution}</p>
						{#if entry.detail}<p class="edu-detail">{entry.detail}</p>{/if}
					</div>
				</div>
			</Reveal>
		{/each}
	</ol>
</section>

<hr class="rule shell-wide" />

<section class="section shell-wide">
	<h2 class="section-title">Toolkit</h2>
	<ul class="skills">
		{#each skillGroups as group, i (group.title)}
			<Reveal as="li" delay={Math.min(i, 5) * 45}>
				<div class="skill">
					<h3>{group.title}</h3>
					<p class="skill-note">{group.note}</p>
					<div class="skill-items">
						{#each group.items as item (item)}
							<Pill>{item}</Pill>
						{/each}
					</div>
				</div>
			</Reveal>
		{/each}
	</ul>
</section>

<section class="cta shell-wide">
	<Reveal>
		<p class="eyebrow">Contact</p>
		<h2>If any of this overlaps with what you are building, I would like to hear about it.</h2>
		<a class="mail" href="mailto:{profile.email}">{profile.email}</a>
	</Reveal>
</section>

<style>
	.page-head {
		padding-block: var(--space-3xl) var(--space-l);
	}

	h1 {
		margin-top: var(--space-m);
		font-size: var(--step-6);
	}

	.intro {
		display: grid;
		gap: var(--space-xl);
		padding-block: var(--space-l) var(--space-2xl);
	}

	.intro :global(.intro-text p) {
		font-size: var(--step-0);
		line-height: 1.75;
		color: var(--fg-2);
		max-width: 58ch;
	}

	.intro :global(.intro-text p + p) {
		margin-top: var(--space-m);
	}

	.intro :global(.intro-text p.first) {
		font-size: var(--step-1);
		line-height: 1.6;
		color: var(--fg);
	}

	.facts {
		display: grid;
		gap: var(--space-s);
		margin: 0;
		padding: var(--space-m);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--surface);
	}

	.facts div + div {
		padding-top: var(--space-s);
		border-top: 1px solid var(--line-soft);
	}

	.facts dt {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-4);
	}

	.facts dd {
		margin: 0.25rem 0 0;
		font-size: var(--step--1);
		color: var(--fg-2);
		line-height: 1.55;
	}

	.lang em {
		color: var(--fg-4);
		font-style: normal;
		font-size: 0.92em;
	}

	.rule {
		max-width: var(--shell-wide);
		margin-inline: auto;
	}

	.section {
		padding-block: var(--space-2xl);
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

	.education {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.edu {
		display: grid;
		gap: 0.35rem;
		padding-block: var(--space-m);
		border-bottom: 1px solid var(--line-soft);
	}

	.edu-period {
		font-size: var(--step--1);
		color: var(--fg-4);
	}

	.edu h3 {
		font-size: var(--step-1);
	}

	.edu-institution {
		margin-top: 0.1rem;
		font-size: var(--step--1);
		color: var(--accent);
	}

	.edu-detail {
		margin-top: 0.3rem;
		font-size: var(--step--1);
		color: var(--fg-3);
	}

	.skills {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-s);
	}

	.skill {
		display: grid;
		gap: 0.3rem;
		height: 100%;
		padding: var(--space-m);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--surface);
	}

	.skill h3 {
		font-size: var(--step-1);
	}

	.skill-note {
		font-size: var(--step--1);
		color: var(--fg-3);
		font-style: italic;
		font-family: var(--font-display);
	}

	.skill-items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: var(--space-2xs);
	}

	.cta {
		padding-block: var(--space-2xl) var(--space-3xl);
		border-top: 1px solid var(--line);
	}

	.cta h2 {
		margin-top: var(--space-s);
		font-size: var(--step-4);
		max-width: 24ch;
	}

	.mail {
		display: inline-block;
		margin-top: var(--space-l);
		font-family: var(--font-mono);
		font-size: var(--step-0);
		color: var(--accent);
		border-bottom: 1px solid var(--accent-line);
		padding-bottom: 2px;
		transition: border-color var(--dur-fast) var(--ease);
	}

	.mail:hover {
		border-color: var(--accent);
	}

	@media (min-width: 58rem) {
		.intro {
			grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
			gap: var(--space-2xl);
		}

		.edu {
			grid-template-columns: 10rem minmax(0, 1fr);
			gap: var(--space-l);
			align-items: baseline;
		}

		.skills {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 82rem) {
		.skills {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>

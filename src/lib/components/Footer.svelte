<script lang="ts">
	import { resolve } from '$app/paths';
	import { navLinks, profile } from '$lib/data/profile';

	const year = new Date().getFullYear();
</script>

<footer class="foot">
	<div class="shell-wide inner">
		<div class="lead">
			<p class="eyebrow">Get in touch</p>
			<a class="mail" href="mailto:{profile.email}">{profile.email}</a>
			<p class="avail muted">{profile.availability}</p>
		</div>

		<nav class="cols" aria-label="Footer">
			<div class="col">
				<h2 class="col-title">Site</h2>
				{#each navLinks as link (link.href)}
					<a href={resolve(link.href)}>{link.label}</a>
				{/each}
			</div>
			<div class="col">
				<h2 class="col-title">Elsewhere</h2>
				<a href={profile.github} rel="me noreferrer" target="_blank">GitHub</a>
				<a href={profile.linkedin} rel="me noreferrer" target="_blank">LinkedIn</a>
				<a href="mailto:{profile.email}">Email</a>
			</div>
			<div class="col">
				<h2 class="col-title">Based in</h2>
				<span class="static">{profile.location}</span>
				<span class="static">GMT+1</span>
			</div>
		</nav>
	</div>

	<div class="shell-wide base">
		<span class="mono">© {year} {profile.name}</span>
		<span class="mono colophon">Built with SvelteKit · Newsreader &amp; Inter · KaTeX</span>
	</div>
</footer>

<style>
	.foot {
		margin-top: var(--space-2xl);
		border-top: 1px solid var(--line);
		background: var(--bg-sink);
	}

	.inner {
		display: grid;
		gap: var(--space-xl);
		padding-block: var(--space-2xl) var(--space-xl);
	}

	.mail {
		display: inline-block;
		margin-top: var(--space-s);
		font-family: var(--font-display);
		font-size: var(--step-4);
		letter-spacing: -0.02em;
		line-height: 1.1;
		word-break: break-word;
		background-image: linear-gradient(var(--accent), var(--accent));
		background-size: 0% 1px;
		background-repeat: no-repeat;
		background-position: 0 100%;
		transition: background-size var(--dur) var(--ease);
	}

	.mail:hover {
		background-size: 100% 1px;
	}

	.avail {
		margin-top: var(--space-xs);
		font-size: var(--step--1);
		max-width: 34ch;
	}

	.cols {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		gap: var(--space-l);
	}

	.col {
		display: grid;
		align-content: start;
		gap: 0.45rem;
	}

	.col-title {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-4);
		margin-bottom: 0.2rem;
	}

	.col a {
		font-size: var(--step--1);
		color: var(--fg-2);
		width: fit-content;
		transition: color var(--dur-fast) var(--ease);
	}

	.col a:hover {
		color: var(--accent);
	}

	.static {
		font-size: var(--step--1);
		color: var(--fg-3);
	}

	.base {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-s);
		justify-content: space-between;
		padding-block: var(--space-s) var(--space-l);
		border-top: 1px solid var(--line-soft);
		color: var(--fg-4);
		font-size: var(--step--2);
	}

	.colophon {
		font-size: var(--step--2);
	}

	@media (min-width: 52rem) {
		.inner {
			grid-template-columns: 1.15fr 1fr;
			gap: var(--space-2xl);
		}
	}
</style>

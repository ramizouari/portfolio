<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { navLinks } from '$lib/data/profile';
</script>

<svelte:head>
	<title>{page.status} — Rami Zouari</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="err shell-wide">
	<p class="eyebrow">Error {page.status}</p>
	<h1>{page.status === 404 ? 'No such page.' : 'Something broke.'}</h1>
	<p class="lede">
		{page.error?.message ?? 'An unexpected error occurred.'}
	</p>

	<nav class="links" aria-label="Recover">
		<a href={resolve('/')}>Home</a>
		{#each navLinks as link (link.href)}
			<a href={resolve(link.href)}>{link.label}</a>
		{/each}
	</nav>
</section>

<style>
	.err {
		display: grid;
		align-content: center;
		min-height: 70svh;
		padding-block: var(--space-3xl);
	}

	h1 {
		margin-top: var(--space-m);
		font-size: var(--step-6);
	}

	.lede {
		margin-top: var(--space-s);
		max-width: 44ch;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: var(--space-xl);
	}

	.links a {
		padding: 0.45rem 1rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-size: var(--step--1);
		color: var(--fg-3);
		transition:
			color var(--dur-fast) var(--ease),
			border-color var(--dur-fast) var(--ease);
	}

	.links a:hover {
		color: var(--accent);
		border-color: var(--accent-line);
	}
</style>

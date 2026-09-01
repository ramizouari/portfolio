<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { profile } from '$lib/data/profile';
	import { SITE_URL } from '$lib/site';
	import { asset } from '$app/paths';

	let { children }: { children: Snippet } = $props();

	const canonical = $derived(SITE_URL + page.url.pathname);
	const ogImage = $derived(SITE_URL + asset('/og.png'));
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	<meta name="author" content={profile.name} />
	<meta property="og:site_name" content="{profile.name} — {profile.role}" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<div class="app">
	<Nav />
	<main id="main">
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}

	main {
		flex: 1;
	}
</style>

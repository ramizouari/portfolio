<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { navLinks, profile } from '$lib/data/profile';
	import type { Pathname } from '$app/types';
	import ThemeToggle from './ThemeToggle.svelte';

	let open = $state(false);
	let scrolled = $state(false);

	const path = $derived(page.url.pathname.replace(/\/+$/, '') || '/');

	function isActive(href: Pathname) {
		const target = resolve(href).replace(/\/+$/, '') || '/';
		return path === target || path.startsWith(target + '/');
	}
</script>

<svelte:window onscroll={() => (scrolled = window.scrollY > 24)} />

<a class="skip" href="#main">Skip to content</a>

<header class="bar" class:scrolled class:open>
	<div class="inner shell-wide">
		<a class="brand" href={resolve('/')} onclick={() => (open = false)}>
			<svg viewBox="0 0 40 28" width="30" height="21" aria-hidden="true" class="mark">
				<path
					d="M2 22 C 11 22, 12 7, 19 7 S 27 17, 27 17"
					fill="none"
					stroke="var(--accent)"
					stroke-width="2.2"
					stroke-linecap="round"
				/>
				<path
					d="M27 8 C 32 8, 33 12, 38 12"
					fill="none"
					stroke="var(--flow)"
					stroke-width="2.2"
					stroke-linecap="round"
				/>
				<circle cx="27" cy="17" r="2" fill="var(--gold)" />
				<circle cx="27" cy="8" r="2" fill="var(--gold)" />
			</svg>
			<span class="name">{profile.name}</span>
		</a>

		<nav class="links" aria-label="Primary">
			{#each navLinks as link (link.href)}
				<a
					class="link"
					class:active={isActive(link.href)}
					href={resolve(link.href)}
					onclick={() => (open = false)}
					aria-current={isActive(link.href) ? 'page' : undefined}
				>
					<span class="idx">{link.index}</span>
					<span class="label">{link.label}</span>
				</a>
			{/each}
		</nav>

		<div class="tools">
			<ThemeToggle />
			<button
				type="button"
				class="burger"
				aria-expanded={open}
				aria-controls="mobile-nav"
				aria-label={open ? 'Close menu' : 'Open menu'}
				onclick={() => (open = !open)}
			>
				<span></span>
				<span></span>
			</button>
		</div>
	</div>

	<div class="sheet" id="mobile-nav" hidden={!open}>
		{#each navLinks as link (link.href)}
			<a
				class="sheet-link"
				class:active={isActive(link.href)}
				href={resolve(link.href)}
				onclick={() => (open = false)}
			>
				<span class="idx">{link.index}</span>
				{link.label}
			</a>
		{/each}
		<a class="sheet-link" href="mailto:{profile.email}" onclick={() => (open = false)}>
			<span class="idx">05</span>
			Contact
		</a>
	</div>
</header>

<style>
	.skip {
		position: fixed;
		top: 0.5rem;
		left: 0.5rem;
		z-index: 200;
		padding: 0.5rem 0.9rem;
		background: var(--accent);
		color: var(--accent-fg);
		border-radius: var(--radius);
		font-size: var(--step--1);
		transform: translateY(-200%);
		transition: transform var(--dur-fast) var(--ease);
	}

	.skip:focus {
		transform: none;
	}

	.bar {
		position: sticky;
		top: 0;
		z-index: 100;
		border-bottom: 1px solid transparent;
		transition:
			background var(--dur-fast) var(--ease),
			border-color var(--dur-fast) var(--ease),
			backdrop-filter var(--dur-fast) var(--ease);
	}

	.bar.scrolled,
	.bar.open {
		background: color-mix(in oklab, var(--bg) 82%, transparent);
		backdrop-filter: blur(14px) saturate(140%);
		border-bottom-color: var(--line);
	}

	.inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-m);
		height: 4.25rem;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex: none;
	}

	.mark {
		overflow: visible;
	}

	.name {
		font-family: var(--font-display);
		font-size: var(--step-1);
		letter-spacing: -0.015em;
		white-space: nowrap;
	}

	.links {
		display: none;
		gap: 0.35rem;
	}

	.link {
		position: relative;
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		padding: 0.4rem 0.75rem;
		border-radius: var(--radius);
		color: var(--fg-3);
		font-size: var(--step--1);
		transition: color var(--dur-fast) var(--ease);
	}

	.link:hover,
	.link.active {
		color: var(--fg);
	}

	.link .idx {
		font-family: var(--font-mono);
		font-size: 0.66em;
		color: var(--fg-4);
		letter-spacing: 0.06em;
	}

	.link.active .idx {
		color: var(--accent);
	}

	.link::after {
		content: '';
		position: absolute;
		left: 0.75rem;
		right: 0.75rem;
		bottom: 0.1rem;
		height: 1px;
		background: var(--accent);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform var(--dur-fast) var(--ease);
	}

	.link:hover::after,
	.link.active::after {
		transform: scaleX(1);
	}

	.tools {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex: none;
	}

	.burger {
		display: grid;
		align-content: center;
		gap: 5px;
		width: 2.1rem;
		height: 2.1rem;
		padding: 0 0.42rem;
		border: 1px solid var(--line);
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
	}

	.burger span {
		display: block;
		height: 1px;
		background: var(--fg-2);
		transition: transform var(--dur-fast) var(--ease);
	}

	.burger[aria-expanded='true'] span:first-child {
		transform: translateY(3px) rotate(45deg);
	}

	.burger[aria-expanded='true'] span:last-child {
		transform: translateY(-3px) rotate(-45deg);
	}

	.sheet {
		display: grid;
		padding: var(--space-2xs) var(--gutter) var(--space-m);
		border-top: 1px solid var(--line-soft);
	}

	.sheet-link {
		display: flex;
		align-items: baseline;
		gap: 0.7rem;
		padding: 0.7rem 0;
		font-family: var(--font-display);
		font-size: var(--step-2);
		color: var(--fg-2);
		border-bottom: 1px solid var(--line-soft);
	}

	.sheet-link.active {
		color: var(--fg);
	}

	.sheet-link .idx {
		font-family: var(--font-mono);
		font-size: var(--step--2);
		color: var(--fg-4);
	}

	@media (min-width: 60rem) {
		.links {
			display: flex;
		}

		.burger,
		.sheet {
			display: none;
		}
	}
</style>

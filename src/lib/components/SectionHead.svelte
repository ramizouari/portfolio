<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';

	type Props = {
		eyebrow: string;
		title: string;
		lede?: string;
		more?: { href: Pathname; label: string };
		children?: Snippet;
	};

	let { eyebrow, title, lede, more, children }: Props = $props();
</script>

<header class="head">
	<div class="text">
		<p class="eyebrow">{eyebrow}</p>
		<h2>{title}</h2>
		{#if lede}<p class="lede">{lede}</p>{/if}
		{#if children}{@render children()}{/if}
	</div>
	{#if more}
		<a class="more" href={resolve(more.href)}>
			{more.label}
			<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
				<path
					d="M2 8h11M9 4l4 4-4 4"
					fill="none"
					stroke="currentColor"
					stroke-width="1.4"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</a>
	{/if}
</header>

<style>
	.head {
		display: grid;
		gap: var(--space-m);
		align-items: end;
		padding-bottom: var(--space-xl);
	}

	.text {
		display: grid;
		gap: var(--space-s);
		max-width: 46ch;
	}

	h2 {
		font-size: var(--step-4);
	}

	.lede {
		font-size: var(--step-0);
		max-width: 52ch;
	}

	.more {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		width: fit-content;
		font-family: var(--font-mono);
		font-size: var(--step--1);
		color: var(--fg-3);
		padding-bottom: 2px;
		border-bottom: 1px solid var(--line-strong);
		transition:
			color var(--dur-fast) var(--ease),
			border-color var(--dur-fast) var(--ease),
			gap var(--dur-fast) var(--ease);
	}

	.more:hover {
		color: var(--accent);
		border-color: var(--accent);
		gap: 0.75rem;
	}

	@media (min-width: 52rem) {
		.head {
			grid-template-columns: 1fr auto;
		}
	}
</style>

<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = { children: Snippet; tone?: 'default' | 'accent' | 'flow' | 'gold' };
	let { children, tone = 'default' }: Props = $props();
</script>

<span class="pill" data-tone={tone}>{@render children()}</span>

<style>
	.pill {
		display: inline-flex;
		align-items: center;
		padding: 0.18rem 0.55rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: var(--step--2);
		letter-spacing: 0.02em;
		color: var(--fg-3);
		white-space: nowrap;
		background: var(--surface);
	}

	.pill[data-tone='accent'] {
		color: var(--accent);
		border-color: var(--accent-line);
		background: var(--accent-soft);
	}

	.pill[data-tone='flow'] {
		color: var(--flow);
		border-color: color-mix(in oklab, var(--flow) 40%, transparent);
		background: var(--flow-soft);
	}

	.pill[data-tone='gold'] {
		color: var(--gold);
		border-color: color-mix(in oklab, var(--gold) 40%, transparent);
		background: var(--gold-soft);
	}
</style>

<script lang="ts">
	import { theme } from '$lib/theme.svelte';
</script>

<button
	type="button"
	class="toggle"
	onclick={() => theme.toggle()}
	aria-label="Switch to {theme.current === 'dark' ? 'light' : 'dark'} theme"
	title="Switch to {theme.current === 'dark' ? 'light' : 'dark'} theme"
>
	<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
		{#if theme.current === 'dark'}
			<circle cx="12" cy="12" r="4.4" fill="currentColor" />
			{#each [0, 45, 90, 135, 180, 225, 270, 315] as a (a)}
				<line
					x1="12"
					y1="2.6"
					x2="12"
					y2="5.4"
					stroke="currentColor"
					stroke-width="1.9"
					stroke-linecap="round"
					transform="rotate({a} 12 12)"
				/>
			{/each}
		{:else}
			<path d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" fill="currentColor" />
		{/if}
	</svg>
</button>

<style>
	.toggle {
		display: grid;
		place-items: center;
		width: 2.1rem;
		height: 2.1rem;
		border: 1px solid var(--line);
		border-radius: 50%;
		background: transparent;
		color: var(--fg-3);
		cursor: pointer;
		transition:
			color var(--dur-fast) var(--ease),
			border-color var(--dur-fast) var(--ease),
			background var(--dur-fast) var(--ease);
	}

	.toggle:hover {
		color: var(--fg);
		border-color: var(--line-strong);
		background: var(--surface);
	}
</style>

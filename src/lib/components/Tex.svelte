<script lang="ts">
	import 'katex/dist/katex.min.css';

	type Props = {
		/** KaTeX output, rendered at build time — see `$lib/server/tex`. */
		html: string;
		/** The source LaTeX, used as the accessible name. */
		label: string;
		/** Shrink the type until the equation fits its column. */
		fit?: boolean;
		class?: string;
		display?: boolean;
	};

	let { html, label, fit = true, display = true, class: className = '' }: Props = $props();

	/**
	 * KaTeX sizes everything in em, so shrinking the container's font-size scales
	 * the whole equation and its height follows. That beats a transform, which
	 * would leave the original height behind, and beats a scrollbar, which nobody
	 * notices on a phone.
	 */
	function autofit(node: HTMLElement) {
		let lastWidth = -1;

		const measure = () => {
			const avail = node.clientWidth;
			if (avail === 0 || avail === lastWidth) return;
			lastWidth = avail;

			// Reset first: scrollWidth is only the natural width at natural size.
			node.style.fontSize = '';
			const natural = node.scrollWidth;
			if (natural > avail) {
				node.style.fontSize = `${Math.max(0.55, (avail - 1) / natural).toFixed(3)}em`;
			}
		};

		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(node);
		return () => ro.disconnect();
	}
</script>

<span
	class="tex {className}"
	class:display
	role="math"
	aria-label={label}
	{@attach display && fit ? autofit : undefined}
>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- KaTeX output built from literals in this repo -->
	{@html html}
</span>

<style>
	.tex {
		display: inline-block;
		max-width: 100%;
	}

	.display {
		display: block;
		overflow-x: auto;
		overflow-y: hidden;
		padding-block: 0.15rem;
	}

	.display::-webkit-scrollbar {
		height: 3px;
	}

	.display::-webkit-scrollbar-thumb {
		background: var(--line-strong);
		border-radius: 2px;
	}

	/* katex.min.css is imported above; these need to outrank it, and scoping
	   them here does that regardless of which chunk loads first. */
	.tex :global(.katex-display) {
		margin: 0;
		padding: 0.2rem 0 0.35rem;
		text-align: left;
	}

	.tex :global(.katex-display > .katex) {
		text-align: left;
	}

	.tex :global(.katex) {
		color: var(--fg);
		font-size: 1.02em;
	}
</style>

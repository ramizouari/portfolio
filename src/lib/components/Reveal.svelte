<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		/** Stagger, in milliseconds. */
		delay?: number;
		as?: 'div' | 'li' | 'section' | 'article';
		class?: string;
	};

	let { children, delay = 0, as = 'div', class: className = '' }: Props = $props();

	let shown = $state(false);

	function watch(node: HTMLElement) {
		if (!('IntersectionObserver' in window)) {
			shown = true;
			return;
		}
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					shown = true;
					io.disconnect();
				}
			},
			{ rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
		);
		io.observe(node);
		return () => io.disconnect();
	}
</script>

<svelte:element
	this={as}
	class="reveal {className}"
	class:shown
	style:--reveal-delay="{delay}ms"
	{@attach watch}
>
	{@render children()}
</svelte:element>

<style>
	.reveal {
		opacity: 0;
		transform: translateY(14px);
		transition:
			opacity 700ms var(--ease) var(--reveal-delay),
			transform 700ms var(--ease) var(--reveal-delay);
	}

	.shown {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.reveal {
			opacity: 1;
			transform: none;
		}
	}
</style>

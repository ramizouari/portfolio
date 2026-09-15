<script lang="ts">
	/**
	 * A mean-payoff game. Circles belong to the maximiser, squares to the
	 * minimiser, every edge carries an integer weight, and the value of a vertex
	 * is the long-run average weight the maximiser can guarantee from it.
	 * Positional strategies suffice; the pair drawn in gold is optimal for both
	 * players at every vertex (checked by enumeration), and from v₀ the play
	 * settles on the cycle B → D → E, whose mean weight 4/3 is the value.
	 */

	type Owner = 'max' | 'min';
	type Node = { id: string; x: number; y: number; owner: Owner };

	const W = 520;
	const H = 260;

	const nodes: Node[] = [
		{ id: 'A', x: 62, y: 118, owner: 'max' },
		{ id: 'B', x: 176, y: 62, owner: 'min' },
		{ id: 'C', x: 176, y: 174, owner: 'max' },
		{ id: 'D', x: 316, y: 62, owner: 'min' },
		{ id: 'E', x: 316, y: 174, owner: 'max' },
		{ id: 'F', x: 430, y: 118, owner: 'min' }
	];
	const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

	// Positive curvature bends the edge to the left of its direction of travel.
	const edges: { u: string; v: string; w: number; curve?: number }[] = [
		{ u: 'A', v: 'B', w: 2 },
		{ u: 'A', v: 'C', w: 2, curve: -16 },
		{ u: 'B', v: 'D', w: 4 },
		{ u: 'B', v: 'C', w: -1 },
		{ u: 'C', v: 'E', w: 4 },
		{ u: 'C', v: 'A', w: -1, curve: -16 },
		{ u: 'D', v: 'F', w: 3, curve: -16 },
		{ u: 'D', v: 'E', w: -1 },
		{ u: 'E', v: 'F', w: -1 },
		{ u: 'E', v: 'B', w: 1 },
		{ u: 'F', v: 'A', w: 0, curve: -178 },
		{ u: 'F', v: 'D', w: 0, curve: -16 }
	];

	// The optimal positional strategies, one successor per vertex.
	const strategy: Record<string, string> = { A: 'B', B: 'D', C: 'E', D: 'E', E: 'B', F: 'A' };
	const cycle = new Set(['B→D', 'D→E', 'E→B']);

	const R = 13;
	const TIP = 5;

	function geometry(e: (typeof edges)[number]) {
		const u = byId[e.u];
		const v = byId[e.v];
		const dx = v.x - u.x;
		const dy = v.y - u.y;
		const len = Math.hypot(dx, dy);
		const nx = -dy / len;
		const ny = dx / len;
		const c = e.curve ?? 0;
		const cx = (u.x + v.x) / 2 + nx * c;
		const cy = (u.y + v.y) / 2 + ny * c;

		const trim = (from: { x: number; y: number }, to: { x: number; y: number }, r: number) => {
			const ex = to.x - from.x;
			const ey = to.y - from.y;
			const l = Math.hypot(ex, ey);
			return { x: from.x + (ex / l) * r, y: from.y + (ey / l) * r };
		};
		const p0 = trim(u, { x: cx, y: cy }, R + 1);
		const p1 = trim(v, { x: cx, y: cy }, R + TIP);

		// The curve's midpoint, then a little further out on the bulging side.
		const mx = 0.25 * p0.x + 0.5 * cx + 0.25 * p1.x;
		const my = 0.25 * p0.y + 0.5 * cy + 0.25 * p1.y;
		const side = c === 0 ? -1 : Math.sign(c);
		const label = { x: mx + nx * 10 * side, y: my + ny * 10 * side + 3 };

		const key = `${e.u}→${e.v}`;
		return {
			key,
			d: `M ${p0.x.toFixed(1)},${p0.y.toFixed(1)} Q ${cx.toFixed(1)},${cy.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`,
			label,
			chosen: strategy[e.u] === e.v,
			onCycle: cycle.has(key),
			w: e.w
		};
	}

	const drawn = edges.map(geometry);
	const fmt = (w: number) => (w < 0 ? `−${-w}` : `${w}`);
</script>

<svg
	viewBox="0 0 {W} {H}"
	role="img"
	aria-label="A mean-payoff game with its optimal positional strategies"
>
	<defs>
		<marker
			id="mp-dim"
			viewBox="0 0 8 8"
			refX="6"
			refY="4"
			markerWidth="6"
			markerHeight="6"
			orient="auto"
		>
			<path d="M0.5 1 L 6.5 4 L 0.5 7 z" fill="var(--line-strong)" />
		</marker>
		<marker
			id="mp-gold"
			viewBox="0 0 8 8"
			refX="6"
			refY="4"
			markerWidth="6"
			markerHeight="6"
			orient="auto"
		>
			<path d="M0.5 1 L 6.5 4 L 0.5 7 z" fill="var(--gold)" />
		</marker>
	</defs>

	{#each drawn.filter((e) => !e.chosen) as e (e.key)}
		<path
			d={e.d}
			fill="none"
			stroke="var(--line-strong)"
			stroke-width="1.1"
			marker-end="url(#mp-dim)"
		/>
	{/each}
	{#each drawn.filter((e) => e.chosen) as e (e.key)}
		{#if e.onCycle}
			<path d={e.d} fill="none" stroke="var(--gold)" stroke-width="7" stroke-opacity="0.14" />
		{/if}
		<path d={e.d} fill="none" stroke="var(--gold)" stroke-width="1.7" marker-end="url(#mp-gold)" />
	{/each}

	{#each drawn as e (e.key)}
		<text x={e.label.x} y={e.label.y} class="weight" class:chosen={e.chosen}>{fmt(e.w)}</text>
	{/each}

	{#each nodes as n (n.id)}
		{#if n.owner === 'max'}
			<circle
				cx={n.x}
				cy={n.y}
				r={R}
				fill="var(--surface)"
				stroke="var(--accent)"
				stroke-width="1.6"
			/>
		{:else}
			<rect
				x={n.x - R + 1}
				y={n.y - R + 1}
				width={2 * R - 2}
				height={2 * R - 2}
				rx="2"
				fill="var(--surface)"
				stroke="var(--flow)"
				stroke-width="1.6"
			/>
		{/if}
		<text
			x={n.x}
			y={n.y + 3.5}
			class="node"
			class:max={n.owner === 'max'}
			class:min={n.owner === 'min'}
		>
			{n.id}
		</text>
	{/each}
	<text x={byId.A.x} y={byId.A.y - R - 8} class="label dim mid">v₀</text>

	<text x={14} y={H - 8} class="label">
		<tspan fill="var(--accent)">○ maximiser</tspan>
		<tspan dx="10" fill="var(--flow)">□ minimiser</tspan>
		<tspan dx="10" fill="var(--gold)">— optimal positional strategies</tspan>
	</text>
	<text x={W - 14} y={18} class="label gold end">ν(v₀) = (4 − 1 + 1) / 3 = 4/3</text>
</svg>

<style>
	svg {
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.label,
	.weight,
	.node {
		font-family: var(--font-mono);
		font-size: 9.5px;
		letter-spacing: 0.06em;
	}

	.weight {
		fill: var(--fg-4);
		text-anchor: middle;
	}

	.weight.chosen {
		fill: var(--gold);
	}

	.node {
		font-size: 10px;
		text-anchor: middle;
	}

	.node.max {
		fill: var(--accent);
	}

	.node.min {
		fill: var(--flow);
	}

	.dim {
		fill: var(--fg-4);
	}

	.gold {
		fill: var(--gold);
	}

	.end {
		text-anchor: end;
	}

	.mid {
		text-anchor: middle;
	}
</style>

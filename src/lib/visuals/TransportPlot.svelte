<script lang="ts">
	/**
	 * One-dimensional optimal transport between two Gaussians. For Gaussians the
	 * optimal map is the monotone rearrangement, which here is the affine map
	 *     T(x) = sqrt(v_nu / v_mu) * (x - m_mu) + m_nu
	 * — the same expectation-variance shift used when a target trial publishes a
	 * mean and a standard deviation and nothing else.
	 */

	const W = 520;
	const H = 260;
	const PAD = { l: 12, r: 12, t: 16, b: 26 };

	const mu = { m: -1.05, v: 0.92 ** 2 };
	const nu = { m: 0.95, v: 0.56 ** 2 };

	const xMin = -3.6;
	const xMax = 3.2;

	const sx = (x: number) => PAD.l + ((x - xMin) / (xMax - xMin)) * (W - PAD.l - PAD.r);

	const pdf = (x: number, m: number, v: number) =>
		Math.exp(-((x - m) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v);

	const peak = Math.max(pdf(nu.m, nu.m, nu.v), pdf(mu.m, mu.m, mu.v));
	const baseline = H - PAD.b;
	const sy = (d: number) => baseline - (d / peak) * (H - PAD.t - PAD.b);

	function curve(m: number, v: number) {
		const pts: string[] = [];
		for (let i = 0; i <= 120; i++) {
			const x = xMin + ((xMax - xMin) * i) / 120;
			pts.push(`${sx(x).toFixed(2)},${sy(pdf(x, m, v)).toFixed(2)}`);
		}
		return `M ${sx(xMin).toFixed(2)},${baseline} L ${pts.join(' L ')} L ${sx(xMax).toFixed(2)},${baseline} Z`;
	}

	const T = (x: number) => Math.sqrt(nu.v / mu.v) * (x - mu.m) + nu.m;

	// A few quantile-spaced sample points, so the arrows show the map, not noise.
	const samples = [-2.1, -1.5, -1.05, -0.6, 0.0];

	const arcs = samples.map((x) => {
		const y = T(x);
		const x0 = sx(x);
		const x1 = sx(y);
		const lift = 26 + Math.abs(x1 - x0) * 0.16;
		return {
			d: `M ${x0},${baseline - 4} Q ${(x0 + x1) / 2},${baseline - lift - 22} ${x1},${baseline - 4}`,
			x1
		};
	});

	const sourcePath = curve(mu.m, mu.v);
	const targetPath = curve(nu.m, nu.v);
</script>

<svg
	viewBox="0 0 {W} {H}"
	role="img"
	aria-label="Optimal transport between a source and a target distribution"
>
	<defs>
		<linearGradient id="src-fill" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="var(--accent)" stop-opacity="0.34" />
			<stop offset="100%" stop-color="var(--accent)" stop-opacity="0.02" />
		</linearGradient>
		<linearGradient id="tgt-fill" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="var(--flow)" stop-opacity="0.3" />
			<stop offset="100%" stop-color="var(--flow)" stop-opacity="0.02" />
		</linearGradient>
		<marker
			id="arrow"
			viewBox="0 0 8 8"
			refX="6"
			refY="4"
			markerWidth="6"
			markerHeight="6"
			orient="auto-start-reverse"
		>
			<path d="M0.5 1 L 6.5 4 L 0.5 7 z" fill="var(--gold)" />
		</marker>
	</defs>

	<line
		x1={PAD.l}
		y1={baseline}
		x2={W - PAD.r}
		y2={baseline}
		stroke="var(--line-strong)"
		stroke-width="1"
	/>

	<path d={sourcePath} fill="url(#src-fill)" stroke="var(--accent)" stroke-width="1.5" />
	<path
		d={targetPath}
		fill="url(#tgt-fill)"
		stroke="var(--flow)"
		stroke-width="1.5"
		stroke-dasharray="4 3"
	/>

	{#each arcs as arc, i (i)}
		<path
			d={arc.d}
			fill="none"
			stroke="var(--gold)"
			stroke-width="1"
			stroke-opacity="0.62"
			marker-end="url(#arrow)"
		/>
	{/each}

	{#each samples as x (x)}
		<circle cx={sx(x)} cy={baseline} r="2.4" fill="var(--accent)" />
	{/each}
	{#each samples as x (x)}
		<circle cx={sx(T(x))} cy={baseline} r="2.4" fill="var(--flow)" />
	{/each}

	<text x={sx(mu.m)} y={sy(pdf(mu.m, mu.m, mu.v)) - 9} class="label src">source · μ</text>
	<text x={sx(nu.m)} y={sy(pdf(nu.m, nu.m, nu.v)) - 9} class="label tgt">target · ν</text>
	<text x={W - PAD.r} y={H - 7} class="label map"
		>T = F<tspan dy="-4" font-size="7">−1</tspan><tspan dy="4">ν</tspan> ∘ F<tspan
			dy="3"
			font-size="7">μ</tspan
		></text
	>
</svg>

<style>
	svg {
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.label {
		font-family: var(--font-mono);
		font-size: 9.5px;
		letter-spacing: 0.06em;
		text-anchor: middle;
	}

	.src {
		fill: var(--accent);
	}

	.tgt {
		fill: var(--flow);
	}

	.map {
		fill: var(--fg-4);
		text-anchor: end;
	}
</style>

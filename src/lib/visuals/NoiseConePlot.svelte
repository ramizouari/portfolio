<script lang="ts">
	/**
	 * Why the reward is hostile, over time. A month of hourly bars: the
	 * cumulative edge of a policy with a few basis points of expected return per
	 * bar, the ±σ√t cone the noise puts around it, a handful of sample paths
	 * inside that cone, and beneath everything the straight line of what it
	 * costs to rebalance every bar. Midway through, the edge inverts — the
	 * relationship the policy learned stops holding — and nothing in the noise
	 * announces it. Seeded noise, so the picture is stable.
	 */

	const W = 520;
	const H = 260;
	const PAD = { l: 14, r: 14 };

	const N = 720; // one month of hourly bars
	const sigma = 0.0075; // per bar
	const edge = 0.0002; // a few basis points per bar
	const flipAt = 480; // …until the relationship inverts
	const feePerBar = 0.0005; // 10 bp per side, half the book turned over each bar

	const sx = (i: number) => PAD.l + (i / N) * (W - PAD.l - PAD.r);

	const yMin = -0.4;
	const yMax = 0.3;
	const top = 22;
	const bottom = 232;
	const sy = (v: number) => bottom - ((v - yMin) / (yMax - yMin)) * (bottom - top);

	const drift = (i: number) => (i <= flipAt ? edge * i : edge * flipAt - edge * (i - flipAt));

	const pt = (i: number, v: number) => `${sx(i).toFixed(2)},${sy(v).toFixed(2)}`;
	const line = (f: (i: number) => number, step = 8) => {
		const pts: string[] = [];
		for (let i = 0; i <= N; i += step) pts.push(pt(i, f(i)));
		if (N % step) pts.push(pt(N, f(N)));
		return `M ${pts.join(' L ')}`;
	};

	const upper: string[] = [];
	const lower: string[] = [];
	for (let i = 0; i <= N; i += 8) {
		const s = sigma * Math.sqrt(i);
		upper.push(pt(i, drift(i) + s));
		lower.unshift(pt(i, drift(i) - s));
	}
	const cone = `M ${upper.join(' L ')} L ${lower.join(' L ')} Z`;

	const edgePath = line(drift);
	const feePath = line((i) => -feePerBar * i);

	// mulberry32 — a small seeded PRNG, so SSR and the client agree.
	function mulberry32(seed: number) {
		let a = seed >>> 0;
		return () => {
			a = (a + 0x6d2b79f5) >>> 0;
			let t = a;
			t = Math.imul(t ^ (t >>> 15), t | 1);
			t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}
	const paths = [3, 11, 19].map((seed) => {
		const rand = mulberry32(20260915 + seed);
		const pts: string[] = [pt(0, 0)];
		let w = 0;
		for (let i = 1; i <= N; i++) {
			const u = Math.max(rand(), 1e-12);
			const v = rand();
			const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
			w += drift(i) - drift(i - 1) + sigma * z;
			if (i % 2 === 0) pts.push(pt(i, w));
		}
		return `M ${pts.join(' L ')}`;
	});

	const weeks = [168, 336, 504, 672];
	const pct = (v: number) => `${v > 0 ? '+' : ''}${Math.round(v * 100)} %`;
</script>

<svg
	viewBox="0 0 {W} {H}"
	role="img"
	aria-label="A month of hourly bars: the edge, the noise cone around it, and the cost of rebalancing every bar"
>
	<defs>
		<linearGradient id="cone-fill" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0%" stop-color="var(--fg-4)" stop-opacity="0.06" />
			<stop offset="100%" stop-color="var(--fg-4)" stop-opacity="0.16" />
		</linearGradient>
	</defs>

	{#each weeks as wk (wk)}
		<line x1={sx(wk)} y1={top} x2={sx(wk)} y2={bottom} stroke="var(--line-soft)" />
		<text x={sx(wk)} y={bottom + 12} class="label dim mid">week {wk / 168}</text>
	{/each}
	<line x1={PAD.l} y1={sy(0)} x2={W - PAD.r} y2={sy(0)} stroke="var(--line-strong)" />

	<!-- the noise -->
	<path d={cone} fill="url(#cone-fill)" />
	{#each paths as d, i (i)}
		<path {d} fill="none" stroke="var(--fg-4)" stroke-width="0.9" stroke-opacity="0.55" />
	{/each}

	<!-- the edge, and the fees -->
	<path d={edgePath} fill="none" stroke="var(--accent)" stroke-width="1.8" />
	<path d={feePath} fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="5 3" />
	<line
		x1={sx(flipAt)}
		y1={sy(drift(flipAt)) - 10}
		x2={sx(flipAt)}
		y2={sy(drift(flipAt)) + 10}
		stroke="var(--accent)"
		stroke-width="1"
	/>

	<text x={sx(N) - 4} y={sy(drift(N) + sigma * Math.sqrt(N)) - 6} class="label dim end">
		noise · ±σ√t
	</text>
	<text x={sx(300)} y={sy(drift(300)) - 9} class="label src mid">edge · a few bp per bar</text>
	<text x={sx(flipAt) + 6} y={sy(drift(flipAt)) - 14} class="label src">…until it inverts</text>
	<text x={sx(N) - 4} y={sy(-feePerBar * N) - 16} class="label gold end">
		fees · rebalancing every bar · {pct(-feePerBar * N)}
	</text>
	<text x={PAD.l} y={top - 8} class="label dim">a month of hourly bars · cumulative return</text>
	<text x={W - PAD.r} y={sy(0) - 5} class="label dim end">0</text>
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
	}

	.src {
		fill: var(--accent);
	}

	.gold {
		fill: var(--gold);
	}

	.dim {
		fill: var(--fg-4);
	}

	.end {
		text-anchor: end;
	}

	.mid {
		text-anchor: middle;
	}
</style>

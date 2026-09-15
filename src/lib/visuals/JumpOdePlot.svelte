<script lang="ts">
	/**
	 * A latent jump ODE, integrated. Between events the state follows a smooth
	 * vector field; at an event it is displaced by the jump map of the stream
	 * that fired. The solution is càdlàg: at each event time the open marker is
	 * the state the solver arrived with, the filled one is the state after the
	 * jump. Below, the counting process that drives it.
	 */

	const W = 520;
	const H = 260;
	const PAD = { l: 14, r: 14 };

	const T = 10;
	const sx = (t: number) => PAD.l + (t / T) * (W - PAD.l - PAD.r);

	// Top panel: the latent coordinate.
	const zTop = 20;
	const zBottom = 164;
	const zMin = -1.5;
	const zMax = 2.3;
	const sz = (z: number) => zBottom - ((z - zMin) / (zMax - zMin)) * (zBottom - zTop);

	// Bottom strip: the counting process.
	const nTop = 196;
	const nBottom = 238;

	type Stream = 1 | 2;
	const events: { t: number; k: Stream; h: number }[] = [
		{ t: 2.3, k: 1, h: 1.15 },
		{ t: 4.7, k: 2, h: -0.95 },
		{ t: 7.3, k: 1, h: 0.85 }
	];

	// A slow set-point the state relaxes towards between events.
	const setPoint = (t: number) => 0.25 * Math.sin(0.7 * t) - 0.1;
	const f = (t: number, z: number) => -0.8 * (z - setPoint(t));

	const dt = 0.01;
	const segments: string[] = [];
	const marks: { x: number; yPre: number; yPost: number; k: Stream }[] = [];

	let z = 0.35;
	let t = 0;
	let pts: string[] = [`${sx(0).toFixed(2)},${sz(z).toFixed(2)}`];
	for (const ev of [...events, { t: T, k: 1 as Stream, h: 0 }]) {
		while (t + dt <= ev.t + 1e-9) {
			z += dt * f(t, z);
			t += dt;
			pts.push(`${sx(t).toFixed(2)},${sz(z).toFixed(2)}`);
		}
		segments.push(`M ${pts.join(' L ')}`);
		if (ev.h !== 0) {
			marks.push({ x: sx(ev.t), yPre: sz(z), yPost: sz(z + ev.h), k: ev.k });
			z += ev.h;
			pts = [`${sx(t).toFixed(2)},${sz(z).toFixed(2)}`];
		}
	}

	// N(t): the total count, as a step function.
	const sn = (n: number) => nBottom - (n / events.length) * (nBottom - nTop);
	const stepPath =
		`M ${sx(0)},${sn(0)}` +
		events.map((ev, i) => ` H ${sx(ev.t).toFixed(2)} V ${sn(i + 1)}`).join('') +
		` H ${sx(T)}`;

	const colour = (k: Stream) => (k === 1 ? 'var(--accent)' : 'var(--gold)');
</script>

<svg viewBox="0 0 {W} {H}" role="img" aria-label="A latent trajectory with jumps at event times">
	<defs>
		<linearGradient id="jump-fill" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="var(--accent)" stop-opacity="0.18" />
			<stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
		</linearGradient>
	</defs>

	<!-- set-point, for reference -->
	<path
		d={`M ${Array.from({ length: 101 }, (_, i) => `${sx((T * i) / 100).toFixed(2)},${sz(setPoint((T * i) / 100)).toFixed(2)}`).join(' L ')}`}
		fill="none"
		stroke="var(--line-strong)"
		stroke-width="1"
		stroke-dasharray="2 4"
	/>

	{#each marks as m, i (i)}
		<line
			x1={m.x}
			y1={zTop}
			x2={m.x}
			y2={nBottom}
			stroke={colour(m.k)}
			stroke-width="1"
			stroke-opacity="0.22"
		/>
	{/each}

	{#each segments as d, i (i)}
		<path {d} fill="none" stroke="var(--accent)" stroke-width="1.6" />
	{/each}

	{#each marks as m, i (i)}
		<line
			x1={m.x}
			y1={m.yPre}
			x2={m.x}
			y2={m.yPost}
			stroke={colour(m.k)}
			stroke-width="1.2"
			stroke-dasharray="3 2.5"
		/>
		<circle
			cx={m.x}
			cy={m.yPre}
			r="3"
			fill="var(--surface)"
			stroke={colour(m.k)}
			stroke-width="1.4"
		/>
		<circle cx={m.x} cy={m.yPost} r="3" fill={colour(m.k)} />
	{/each}

	<!-- counting process -->
	<line x1={PAD.l} y1={nBottom} x2={W - PAD.r} y2={nBottom} stroke="var(--line-strong)" />
	<path d={stepPath} fill="none" stroke="var(--fg-4)" stroke-width="1.3" />
	{#each events as ev, i (i)}
		<text x={sx(ev.t) + 5} y={nBottom - 6} class="label tick" style:fill={colour(ev.k)}>
			dN<tspan dy="3" font-size="7">{ev.k}</tspan>
		</text>
	{/each}

	<text x={PAD.l} y={zTop - 6} class="label src">z(t) · latent, càdlàg</text>
	<text x={PAD.l} y={nTop - 6} class="label dim">N(t) · events</text>
	<text x={W - PAD.r} y={zTop - 6} class="label legend">
		<tspan fill="var(--accent)">● line of therapy</tspan>
		<tspan dx="10" fill="var(--gold)">● adverse event</tspan>
	</text>
	<text x={W - PAD.r} y={H - 7} class="label map">dy = f dt + h dN</text>
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

	.dim {
		fill: var(--fg-4);
	}

	.tick {
		font-size: 8.5px;
	}

	.legend,
	.map {
		text-anchor: end;
		fill: var(--fg-4);
	}
</style>

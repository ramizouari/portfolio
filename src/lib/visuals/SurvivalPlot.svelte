<script lang="ts">
	/**
	 * The hazard is a head on the integrated state, so the cumulative hazard
	 * comes out of the same solver call and S(t) = exp(-Λ(t)) follows. Two ways
	 * an observation can end are marked on the survival curve: an event at T,
	 * which contributes -log h(T) + Λ(T) to the loss, and censoring at C, which
	 * contributes only Λ(C).
	 */

	const W = 520;
	const H = 260;
	const PAD = { l: 14, r: 14 };

	const T = 10;
	const sx = (t: number) => PAD.l + (t / T) * (W - PAD.l - PAD.r);

	const hazard = (t: number) => 0.05 + 0.24 * Math.exp(-((t - 5.2) ** 2) / 2.2) + 0.012 * t;

	// Cumulative hazard by the trapezoid rule on a fine grid.
	const N = 400;
	const ts: number[] = [];
	const hs: number[] = [];
	const Ls: number[] = [];
	let L = 0;
	for (let i = 0; i <= N; i++) {
		const t = (T * i) / N;
		const h = hazard(t);
		if (i > 0) L += ((h + hs[i - 1]) * (T / N)) / 2;
		ts.push(t);
		hs.push(h);
		Ls.push(L);
	}
	const S = (i: number) => Math.exp(-Ls[i]);
	const at = (t: number) => Math.round((t / T) * N);

	// Top panel: the hazard.
	const hTop = 22;
	const hBottom = 104;
	const hMax = Math.max(...hs) * 1.12;
	const sh = (h: number) => hBottom - (h / hMax) * (hBottom - hTop);

	// Bottom panel: survival.
	const sTop = 130;
	const sBottom = 236;
	const ss = (s: number) => sBottom - s * (sBottom - sTop);

	const tEvent = 6.1;
	const tCensor = 8.2;

	const hazardLine = `M ${ts.map((t, i) => `${sx(t).toFixed(2)},${sh(hs[i]).toFixed(2)}`).join(' L ')}`;
	const hazardArea = (upTo: number) => {
		const k = at(upTo);
		const pts = ts.slice(0, k + 1).map((t, i) => `${sx(t).toFixed(2)},${sh(hs[i]).toFixed(2)}`);
		return `M ${sx(0)},${hBottom} L ${pts.join(' L ')} L ${sx(upTo).toFixed(2)},${hBottom} Z`;
	};
	const survivalLine = `M ${ts.map((t, i) => `${sx(t).toFixed(2)},${ss(S(i)).toFixed(2)}`).join(' L ')}`;
	const survivalArea = `${survivalLine} L ${sx(T)},${sBottom} L ${sx(0)},${sBottom} Z`;
</script>

<svg viewBox="0 0 {W} {H}" role="img" aria-label="A hazard and the survival curve it integrates to">
	<defs>
		<linearGradient id="haz-fill" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="var(--accent)" stop-opacity="0.36" />
			<stop offset="100%" stop-color="var(--accent)" stop-opacity="0.04" />
		</linearGradient>
		<linearGradient id="surv-fill" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="var(--flow)" stop-opacity="0.22" />
			<stop offset="100%" stop-color="var(--flow)" stop-opacity="0" />
		</linearGradient>
	</defs>

	<!-- hazard -->
	<line x1={PAD.l} y1={hBottom} x2={W - PAD.r} y2={hBottom} stroke="var(--line-strong)" />
	<path d={hazardArea(tEvent)} fill="url(#haz-fill)" />
	<path d={hazardLine} fill="none" stroke="var(--accent)" stroke-width="1.5" />
	<circle cx={sx(tEvent)} cy={sh(hazard(tEvent))} r="3" fill="var(--accent)" />
	<text x={sx(4.4)} y={hBottom - 8} class="label src mid">Λ(T) = ∫₀ᵀ h</text>
	<text x={sx(tEvent) + 6} y={sh(hazard(tEvent)) - 5} class="label src">h(T)</text>

	<!-- survival -->
	<line x1={PAD.l} y1={sBottom} x2={W - PAD.r} y2={sBottom} stroke="var(--line-strong)" />
	<line
		x1={PAD.l}
		y1={sTop}
		x2={W - PAD.r}
		y2={sTop}
		stroke="var(--line-strong)"
		stroke-dasharray="2 4"
	/>
	<path d={survivalArea} fill="url(#surv-fill)" />
	<path d={survivalLine} fill="none" stroke="var(--flow)" stroke-width="1.6" />

	<!-- event at T -->
	<line
		x1={sx(tEvent)}
		y1={hTop}
		x2={sx(tEvent)}
		y2={sBottom}
		stroke="var(--accent)"
		stroke-width="1"
		stroke-opacity="0.3"
	/>
	<circle cx={sx(tEvent)} cy={ss(S(at(tEvent)))} r="3.4" fill="var(--accent)" />
	<text x={sx(tEvent) - 8} y={ss(S(at(tEvent))) + 16} class="label src end">
		event at T · −log h(T) + Λ(T)
	</text>

	<!-- censoring at C -->
	<line
		x1={sx(tCensor)}
		y1={ss(S(at(tCensor))) - 9}
		x2={sx(tCensor)}
		y2={ss(S(at(tCensor))) + 9}
		stroke="var(--flow)"
		stroke-width="1.8"
	/>
	<text x={sx(tCensor) - 6} y={ss(S(at(tCensor))) - 30} class="label tgt end">censored at C</text>
	<text x={sx(tCensor) - 6} y={ss(S(at(tCensor))) - 18} class="label tgt end">· Λ(C)</text>

	<text x={PAD.l} y={hTop - 8} class="label src">h(t) · hazard head, ≥ 0</text>
	<text x={PAD.l} y={sTop - 8} class="label tgt"
		>S(t) = e<tspan dy="-4" font-size="7">−Λ(t)</tspan></text
	>
	<text x={W - PAD.r - 4} y={sTop + 10} class="label dim end">1</text>
	<text x={W - PAD.r - 4} y={sBottom - 4} class="label dim end">0</text>
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

	.tgt {
		fill: var(--flow);
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

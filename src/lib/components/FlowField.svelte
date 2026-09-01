<script lang="ts">
	import { theme } from '$lib/theme.svelte';

	type Props = {
		/** Particle density per million device-independent pixels. */
		density?: number;
		/** Mean number of seconds between jumps, per particle. */
		jumpPeriod?: number;
		class?: string;
	};

	let { density = 165, jumpPeriod = 15, class: className = '' }: Props = $props();

	type Particle = {
		x: number;
		y: number;
		px: number;
		py: number;
		age: number;
		life: number;
		clock: number;
		speed: number;
		hue: 0 | 1;
	};

	type Flash = { x: number; y: number; fx: number; fy: number; t: number };

	/* The field is the Hamiltonian flow of a stream function psi: u = d(psi)/dy,
	   v = -d(psi)/dx. That makes it divergence-free, so trajectories follow the
	   level sets of psi and particles never pile into a sink. psi drifts slowly
	   in time, so the portrait is never quite the same twice. */
	const A = 1.35,
		B = 1.15,
		C = 0.85,
		D = 1.6;

	function field(x: number, y: number, t: number): [number, number] {
		const s1 = Math.sin(A * x + 0.1 * t);
		const c1 = Math.cos(A * x + 0.1 * t);
		const s2 = Math.sin(B * y - 0.08 * t);
		const c2 = Math.cos(B * y - 0.08 * t);
		const p3 = C * (x + y) + 0.13 * t;
		const p4 = D * (x - 1.3 * y) - 0.07 * t;

		// u = d(psi)/dy
		const u = -B * s1 * s2 + 0.6 * C * Math.cos(p3) + 0.52 * D * Math.sin(p4);
		// v = -d(psi)/dx
		const v = -(A * c1 * c2 + 0.6 * C * Math.cos(p3) - 0.4 * D * Math.sin(p4));
		return [u, v];
	}

	/* The jump map. A bounded displacement, mostly across the local flow, so the
	   discontinuity is legible without the particle crossing the whole frame. */
	function jump(x: number, y: number, t: number): [number, number] {
		const [u, v] = field(x, y, t);
		const m = Math.hypot(u, v) || 1;
		const nx = -v / m;
		const ny = u / m;
		const side = Math.random() < 0.5 ? -1 : 1;
		const r = 0.26 + Math.random() * 0.36;
		const wobble = (Math.random() - 0.5) * 0.4;
		return [x + side * r * nx + wobble * (u / m), y + side * r * ny + wobble * (v / m)];
	}

	function rgba(hex: string, alpha: number): string {
		const h = hex.trim().replace('#', '');
		const full =
			h.length === 3
				? h
						.split('')
						.map((d) => d + d)
						.join('')
				: h;
		const n = parseInt(full, 16);
		return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
	}

	/* Dark and light need genuinely different numbers: on a light ground the same
	   trail alpha accumulates into a solid mat, and the same fade barely erases. */
	function tuning(light: boolean) {
		return light
			? { trail: 0.42, fade: 0.055, flash: 0.4, ring: 0.55, still: 0.16 }
			: { trail: 0.7, fade: 0.028, flash: 0.34, ring: 0.55, still: 0.2 };
	}

	function palette() {
		const s = getComputedStyle(document.documentElement);
		const get = (name: string, fallback: string) => (s.getPropertyValue(name) || fallback).trim();
		return {
			bg: get('--bg', '#08080c'),
			accent: get('--accent', '#9f86ff'),
			flow: get('--flow', '#4fd1c5'),
			gold: get('--gold', '#e3b25f')
		};
	}

	function run(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext('2d', { alpha: false });
		if (!ctx) return;

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		let w = 0;
		let h = 0;
		let dpr = 1;
		let scale = 1; // device px per field unit
		let particles: Particle[] = [];
		let flashes: Flash[] = [];
		let colours = palette();
		let tune = tuning(document.documentElement.dataset.theme === 'light');
		let raf = 0;
		let last = 0;
		let clock = 0;
		let visible = true;
		let running = false;

		const toScreen = (x: number, y: number): [number, number] => [
			w / 2 + x * scale,
			h / 2 - y * scale
		];

		const spawn = (p?: Particle): Particle => {
			const rx = (Math.random() - 0.5) * (w / scale) * 1.15;
			const ry = (Math.random() - 0.5) * (h / scale) * 1.15;
			const next = p ?? ({} as Particle);
			next.x = rx;
			next.y = ry;
			next.px = rx;
			next.py = ry;
			next.age = 0;
			next.life = 7 + Math.random() * 12;
			next.clock = -Math.log(1 - Math.random()) * jumpPeriod;
			next.speed = 0.6 + Math.random() * 0.5;
			next.hue = Math.random() < 0.3 ? 1 : 0;
			return next;
		};

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			if (rect.width === 0 || rect.height === 0) return;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			w = Math.round(rect.width * dpr);
			h = Math.round(rect.height * dpr);
			canvas.width = w;
			canvas.height = h;
			scale = Math.min(w, h) / 6.2;

			const target = Math.round((w * h) / (1_000_000 / density) / dpr);
			const count = Math.max(70, Math.min(560, target));
			particles = Array.from({ length: count }, () => spawn());
			flashes = [];

			ctx.fillStyle = colours.bg;
			ctx.fillRect(0, 0, w, h);
			if (reduced) drawStatic();
		};

		/* Reduced motion: integrate every particle once and draw the streamlines,
		   then stop. Same picture, no movement. */
		const drawStatic = () => {
			ctx.lineCap = 'round';
			for (const p of particles) {
				let { x, y } = p;
				const colour = p.hue ? colours.flow : colours.accent;
				ctx.beginPath();
				let started = false;
				for (let i = 0; i < 170; i++) {
					const [u, v] = field(x, y, 0);
					const m = Math.hypot(u, v) || 1;
					x += (u / m) * 0.032;
					y += (v / m) * 0.032;
					const [sx, sy] = toScreen(x, y);
					if (!started) {
						ctx.moveTo(sx, sy);
						started = true;
					} else {
						ctx.lineTo(sx, sy);
					}
				}
				ctx.strokeStyle = rgba(colour, tune.still);
				ctx.lineWidth = 1 * dpr;
				ctx.stroke();
			}
		};

		const step = (dt: number) => {
			clock += dt;

			// Fade the previous frame rather than clearing it: that is the trail.
			ctx.fillStyle = rgba(colours.bg, tune.fade);
			ctx.fillRect(0, 0, w, h);

			ctx.lineCap = 'round';
			const halfW = w / scale / 2 + 0.6;
			const halfH = h / scale / 2 + 0.6;

			for (const p of particles) {
				p.px = p.x;
				p.py = p.y;

				// Midpoint integration of the smooth part.
				const [u1, v1] = field(p.x, p.y, clock);
				const m1 = Math.hypot(u1, v1) || 1;
				const hx = p.x + (u1 / m1) * 0.5 * p.speed * dt;
				const hy = p.y + (v1 / m1) * 0.5 * p.speed * dt;
				const [u2, v2] = field(hx, hy, clock);
				const m2 = Math.hypot(u2, v2) || 1;
				p.x += (u2 / m2) * p.speed * dt;
				p.y += (v2 / m2) * p.speed * dt;

				p.age += dt;
				p.clock -= dt;

				const fade = Math.min(1, p.age * 2.2) * Math.min(1, (p.life - p.age) * 1.4);
				const colour = p.hue ? colours.flow : colours.accent;

				const [ax, ay] = toScreen(p.px, p.py);
				const [bx, by] = toScreen(p.x, p.y);
				ctx.strokeStyle = rgba(colour, tune.trail * Math.max(0, fade));
				ctx.lineWidth = (p.hue ? 1.2 : 0.9) * dpr;
				ctx.beginPath();
				ctx.moveTo(ax, ay);
				ctx.lineTo(bx, by);
				ctx.stroke();

				// dN fires: displace the state and mark the discontinuity.
				if (p.clock <= 0 && p.age > 0.6 && p.age < p.life - 0.6) {
					const from = toScreen(p.x, p.y);
					const [nx, ny] = jump(p.x, p.y, clock);
					p.x = nx;
					p.y = ny;
					p.px = nx;
					p.py = ny;
					p.clock = -Math.log(1 - Math.random()) * jumpPeriod;
					const to = toScreen(nx, ny);
					flashes.push({ x: from[0], y: from[1], fx: to[0], fy: to[1], t: 0 });
					if (flashes.length > 9) flashes.shift();
				}

				if (p.age > p.life || p.x < -halfW || p.x > halfW || p.y < -halfH || p.y > halfH) {
					spawn(p);
				}
			}

			for (let i = flashes.length - 1; i >= 0; i--) {
				const f = flashes[i];
				f.t += dt;
				const k = f.t / 1.15;
				if (k >= 1) {
					flashes.splice(i, 1);
					continue;
				}
				const a = (1 - k) ** 2;
				ctx.strokeStyle = rgba(colours.gold, tune.flash * a);
				ctx.lineWidth = 1 * dpr;
				ctx.setLineDash([2 * dpr, 3 * dpr]);
				ctx.beginPath();
				ctx.moveTo(f.x, f.y);
				ctx.lineTo(f.fx, f.fy);
				ctx.stroke();
				ctx.setLineDash([]);

				ctx.strokeStyle = rgba(colours.gold, tune.ring * a);
				ctx.lineWidth = 1.1 * dpr;
				ctx.beginPath();
				ctx.arc(f.fx, f.fy, (1.6 + k * 6) * dpr, 0, Math.PI * 2);
				ctx.stroke();
			}
		};

		const frame = (now: number) => {
			raf = requestAnimationFrame(frame);
			if (!visible) {
				last = now;
				return;
			}
			const dt = Math.min((now - last) / 1000, 0.05);
			last = now;
			if (dt > 0) step(dt);
		};

		const start = () => {
			if (running || reduced) return;
			running = true;
			last = performance.now();
			raf = requestAnimationFrame(frame);
		};

		const stop = () => {
			running = false;
			cancelAnimationFrame(raf);
		};

		const ro = new ResizeObserver(resize);
		ro.observe(canvas);

		const io = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				if (visible) start();
				else stop();
			},
			{ threshold: 0 }
		);
		io.observe(canvas);

		const onVisibility = () => {
			if (document.hidden) stop();
			else if (visible) start();
		};
		document.addEventListener('visibilitychange', onVisibility);

		resize();
		start();

		// Repaint the background and refresh the palette when the theme flips.
		$effect(() => {
			const mode = theme.current;
			colours = palette();
			tune = tuning(mode === 'light');
			if (w && h) {
				ctx.fillStyle = colours.bg;
				ctx.fillRect(0, 0, w, h);
				if (reduced) drawStatic();
			}
		});

		return () => {
			stop();
			ro.disconnect();
			io.disconnect();
			document.removeEventListener('visibilitychange', onVisibility);
		};
	}
</script>

<canvas class="flow {className}" aria-hidden="true" {@attach run}></canvas>

<style>
	.flow {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		background: var(--bg);
		--field-mask: radial-gradient(
			76% 88% at 74% 47%,
			#000 0%,
			#000 30%,
			rgba(0, 0, 0, 0.55) 60%,
			transparent 84%
		);
		-webkit-mask-image: var(--field-mask);
		mask-image: var(--field-mask);
	}
</style>

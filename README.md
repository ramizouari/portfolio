# Portfolio — Rami Zouari

A statically-generated portfolio site: research threads, work history, project
write-ups, and the competitive-programming record.

Built with **SvelteKit 2 + Svelte 5 (runes)**, prerendered to plain HTML by
`adapter-static`. No runtime server, no client-side data fetching, no analytics.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script            | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Dev server with HMR                             |
| `npm run build`   | Prerenders every route into `build/`            |
| `npm run preview` | Serves the production build locally             |
| `npm run check`   | `svelte-check` — TypeScript and Svelte analysis |
| `npm run format`  | Prettier                                        |

---

## Editing the content

Every word on the site comes from one of six typed modules. Nothing is hardcoded
in markup, so adding a project or a role is a data edit, not a layout edit.

| File                         | Drives                                                            |
| ---------------------------- | ----------------------------------------------------------------- |
| `src/lib/data/profile.ts`    | Name, role, tagline, contact, hero stats, nav                     |
| `src/lib/data/research.ts`   | The four research threads: abstracts, equations, artifacts        |
| `src/lib/data/projects.ts`   | Project index and every `/projects/<slug>` page                   |
| `src/lib/data/experience.ts` | Work timeline and education                                       |
| `src/lib/data/algorithms.ts` | ICPC medals, contests set, topic taxonomy, judging infrastructure |
| `src/lib/data/skills.ts`     | Toolkit groups and languages                                      |

### Adding a project

Append an entry to `projects` in `src/lib/data/projects.ts`. The `slug` becomes
the URL, `featured: true` promotes it to the home page, and the detail page is
prerendered automatically — `entries()` in `src/routes/projects/[slug]/+page.ts`
enumerates the array at build time.

### Equations

Written as raw LaTeX in `research.ts` and rendered by KaTeX at build time.
Use `String.raw` so backslashes survive. Each thread carries a `signature` — a
short form used in the narrow column on the home page — alongside the full
`equations` array.

`<Tex>` shrinks the type until the equation fits its column, so long expressions
stay whole on a phone rather than being cut off.

---

## Design notes

**The hero.** A canvas rendering the Hamiltonian flow of a stream function
`psi`, so `u = ∂psi/∂y` and `v = -∂psi/∂x`. Because the field is
divergence-free, trajectories follow the level sets of `psi` and particles never
pile into a sink — the picture stays a phase portrait instead of degenerating
into a few blobs. Each particle carries an exponential clock; when it fires the
particle is displaced across the level sets and the discontinuity is marked in
gold. That is `dz = f dt + h dN`, the model the site is about.

It pauses when scrolled out of view or when the tab is hidden, and under
`prefers-reduced-motion` it draws the streamlines once, statically, and stops.

**Type.** Newsreader for display, Inter for text, JetBrains Mono for labels and
code — self-hosted via `@fontsource-variable`, so no third-party font requests.

**Colour.** Violet for the primary accent, teal for flow, gold for events and
awards. Every foreground tier clears WCAG AA (4.5:1) against both the page and
card backgrounds, in both themes. The theme is applied before first paint by a
small inline script in `src/app.html` and remembered in `localStorage`.

---

## Deploying

The build output in `build/` is a plain static site — any host will serve it.

### GitHub Pages

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
Two optional repository variables (Settings → Secrets and variables → Actions →
Variables):

- `BASE_PATH` — set to `/<repo-name>` when serving from a project page. Leave
  unset for `<user>.github.io`.
- `PUBLIC_SITE_URL` — the absolute origin, used for canonical links, the
  sitemap and the social card. Defaults to `https://ramizouari.github.io`.

### Netlify / Vercel / Cloudflare Pages

Build command `npm run build`, publish directory `build`. Set
`PUBLIC_SITE_URL` to the deployed origin.

### Anywhere else

```bash
npm run build
# serve ./build with nginx, Caddy, `python3 -m http.server`, …
```

`404.html` is the SPA fallback, so client-side routing still works on hosts that
do not rewrite unknown paths.

---

## Structure

```
src/
├── app.css                  design tokens, reset, base typography
├── app.html                 shell + pre-paint theme script
├── lib/
│   ├── data/                all site content (see above)
│   ├── components/          Nav, Footer, FlowField, Tex, Code, Reveal, …
│   ├── visuals/             TransportPlot — the 1-D optimal transport figure
│   ├── theme.svelte.ts      theme state (runes)
│   └── site.ts              SITE_URL
└── routes/
    ├── +layout.svelte       shell, head tags
    ├── +page.svelte         home
    ├── research/            the four threads
    ├── work/                timeline + project index
    ├── projects/[slug]/     per-project pages
    ├── algorithms/          medals, contests, CPLibrary, infrastructure
    ├── about/               bio, education, toolkit
    ├── sitemap.xml/         prerendered
    └── robots.txt/          prerendered
```

## Regenerating the social card

`static/og.png` is a one-off render. If the tagline or palette changes, redraw
it at 1200×630 and keep the filename — `src/routes/+layout.svelte` points at it.

<script lang="ts">
	/**
	 * A deliberately small C++ highlighter. Enough to give the snippet on this
	 * site some shape; not a general-purpose lexer.
	 */
	type Props = { code: string; caption?: string; lang?: string };
	let { code, caption, lang = 'cpp' }: Props = $props();

	type Tok = { t: string; k: string };

	const KEYWORDS = new Set([
		'template',
		'typename',
		'struct',
		'class',
		'const',
		'auto',
		'return',
		'while',
		'for',
		'if',
		'else',
		'using',
		'namespace',
		'public',
		'private',
		'static',
		'inline',
		'concept',
		'requires',
		'int',
		'void',
		'bool',
		'true',
		'false',
		'std',
		'constexpr',
		'virtual',
		'override',
		'operator'
	]);

	const PATTERN =
		/(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|(\b\d+\b)|([A-Za-z_][A-Za-z0-9_]*)|([{}()<>[\];,.:&*=+\-/|!?])/g;

	function tokenize(src: string): Tok[] {
		const out: Tok[] = [];
		let last = 0;
		for (const m of src.matchAll(PATTERN)) {
			const i = m.index ?? 0;
			if (i > last) out.push({ t: src.slice(last, i), k: 'plain' });
			const [full, comment, str, num, word, punct] = m;
			if (comment) out.push({ t: full, k: 'comment' });
			else if (str) out.push({ t: full, k: 'string' });
			else if (num) out.push({ t: full, k: 'number' });
			else if (word) out.push({ t: full, k: KEYWORDS.has(full) ? 'keyword' : 'name' });
			else if (punct) out.push({ t: full, k: 'punct' });
			last = i + full.length;
		}
		if (last < src.length) out.push({ t: src.slice(last), k: 'plain' });
		return out;
	}

	const tokens = $derived(tokenize(code.trim()));
</script>

<figure class="code">
	<div class="chrome">
		<span class="mono lang">{lang}</span>
	</div>
	<pre><code
			>{#each tokens as tok, i (i)}<span class={tok.k}>{tok.t}</span>{/each}</code
		></pre>
	{#if caption}<figcaption>{caption}</figcaption>{/if}
</figure>

<style>
	.code {
		margin: 0;
		min-width: 0;
		max-width: 100%;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--bg-sink);
		overflow: hidden;
	}

	.chrome {
		display: flex;
		justify-content: flex-end;
		padding: 0.4rem var(--space-s);
		border-bottom: 1px solid var(--line-soft);
	}

	.lang {
		font-size: var(--step--2);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-4);
	}

	pre {
		margin: 0;
		padding: var(--space-m);
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		line-height: 1.75;
		tab-size: 2;
	}

	code {
		font-size: inherit;
	}

	figcaption {
		padding: 0.7rem var(--space-m) var(--space-s);
		border-top: 1px solid var(--line-soft);
		font-size: var(--step--1);
		color: var(--fg-3);
		line-height: 1.5;
	}

	.comment {
		color: var(--fg-4);
		font-style: italic;
	}

	.keyword {
		color: var(--accent);
	}

	.name {
		color: var(--fg-2);
	}

	.number {
		color: var(--gold);
	}

	.string {
		color: var(--flow);
	}

	.punct {
		color: var(--fg-4);
	}

	.plain {
		color: var(--fg-3);
	}
</style>

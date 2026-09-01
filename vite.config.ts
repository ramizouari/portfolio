import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// Expose PUBLIC_* to client code, matching SvelteKit's public-env convention.
	envPrefix: ['VITE_', 'PUBLIC_']
});

import { browser } from '$app/environment';

export type Theme = 'dark' | 'light';

const KEY = 'rz-theme';

function read(): Theme {
	if (!browser) return 'dark';
	const attr = document.documentElement.dataset.theme;
	return attr === 'light' ? 'light' : 'dark';
}

class ThemeState {
	current = $state<Theme>(read());

	toggle() {
		this.set(this.current === 'dark' ? 'light' : 'dark');
	}

	set(next: Theme) {
		this.current = next;
		if (!browser) return;
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem(KEY, next);
		} catch {
			/* storage unavailable — the choice just will not persist */
		}
	}
}

export const theme = new ThemeState();

// src/lib/stores/colorStore.ts

import { writable, type Writable } from 'svelte/store';

// --- Type Definitions ---
// We explicitly define that our store will hold an array of strings.
type ColorPalette = string[];

// --- Constants ---
const defaultColors: ColorPalette = [
	'#D92121', // Red
	'#3366E6', // Blue
	'#248F24', // Green
	'#FAC400', // Yellow
	'#FFFFFF', // White
	'#000000', // Black
	'#8E44AD', // Purple
	'#E67E22'  // Orange
];

const localStorageKey = 'custom-weaving-colors';

/**
 * Interface for our store's public API. This tells TypeScript
 * what methods our store will expose.
 */
interface ColorStore extends Writable<ColorPalette> {
	addColor: (newColor: string) => void;
	resetToDefaults: () => void;
}

/**
 * Creates a custom Svelte store to manage the color palette.
 * It automatically syncs with the browser's localStorage.
 */
function createColorStore(): ColorStore {
	// --- Initialization ---
	let initialColors: ColorPalette = [...defaultColors];

	if (typeof window !== 'undefined') {
		try {
			const savedColorsJSON = window.localStorage.getItem(localStorageKey);
			if (savedColorsJSON) {
				const savedColors: ColorPalette = JSON.parse(savedColorsJSON);
				initialColors = [...new Set([...defaultColors, ...savedColors])];
			}
		} catch (e) {
			console.error('Could not load colors from localStorage', e);
		}
	}

	const { subscribe, set, update } = writable<ColorPalette>(initialColors);

	// --- Store Logic ---
	subscribe((currentColors: ColorPalette) => {
		if (typeof window !== 'undefined') {
			try {
				window.localStorage.setItem(localStorageKey, JSON.stringify(currentColors));
			} catch (e) {
				console.error('Could not save colors to localStorage', e);
			}
		}
	});

	// --- Public API for the Store ---
	return {
		subscribe,
		set, // Expose set for full Writable compatibility
		update, // Expose update for full Writable compatibility

		addColor: (newColor: string) => {
			if (!newColor) return;
			update((currentColors: ColorPalette) => {
				const newSet = new Set(currentColors);
				newSet.add(newColor.toUpperCase()); // Store colors in a consistent format
				return [...newSet];
			});
		},

		resetToDefaults: () => {
			set([...defaultColors]);
		}
	};
}

// Export a single, type-safe instance of our store.
export const colors = createColorStore();
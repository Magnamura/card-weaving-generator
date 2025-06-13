<!-- src/lib/components/ColorPalette.svelte -->

<script lang="ts">
	import { colors } from '$lib/stores/colorStore';

	// --- Props ---
	// `export let` defines a component property.
	// This will be a two-way binding, so the parent component knows which color is selected.
	export let selectedColor: string;

	// --- State ---
	// Local state for the color picker input. Initialize to a default.
	let newColorValue = '#1a1a1a';

	// --- Event Handlers ---
	function handleAddColor() {
		colors.addColor(newColorValue);
	}

	function handleResetColors() {
		if (confirm('Are you sure you want to reset your custom colors?')) {
			colors.resetToDefaults();
			// Also reset the selected color if it's no longer in the default palette
			selectedColor = '#FFFFFF';
		}
	}
</script>

<div class="p-4 border rounded-lg shadow-sm">
	<h3 class="text-lg font-bold mb-3">Color Palette</h3>

	<!-- Displaying the color swatches from our store -->
	<!-- `$colors` is Svelte's magic auto-subscription syntax.
       It automatically unwraps the store's value. -->
	<div class="flex flex-wrap gap-2 mb-4">
		{#each $colors as color (color)}
			<button
				aria-label="Select color {color}"
				class="w-10 h-10 rounded-full border-2 transition-transform duration-150"
				class:ring-4={selectedColor === color}
				class:ring-primary={selectedColor === color}
				class:ring-offset-2={selectedColor === color}
				style="background-color: {color};"
				on:click={() => (selectedColor = color)}
			></button>
		{/each}
	</div>

	<!-- Interface for adding new colors -->
	<div class="flex flex-wrap items-center gap-4">
		<div class="form-control">
			<label class="label cursor-pointer flex gap-2">
				<span class="label-text">Add New:</span>
				<!-- Using a native HTML color input -->
				<input type="color" bind:value={newColorValue} class="w-10 h-10 p-0 border-none" />
			</label>
		</div>
		<button class="btn btn-sm btn-primary" on:click={handleAddColor}>Add Color</button>
		<button class="btn btn-sm btn-ghost" on:click={handleResetColors}>Reset</button>
	</div>
</div>
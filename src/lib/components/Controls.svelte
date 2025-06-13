<!-- src/lib/components/Controls.svelte -->

<script lang="ts">
	export let numberOfCards: number;
	export let numberOfTurns: number;

	// These props are now functions passed from the parent to handle the clicks.
	export let onAddTurns: (amount: number) => void;
	export let onRemoveTurns: (amount: number) => void;
</script>

<div class="p-4 border rounded-lg shadow-sm">
	<h3 class="text-lg font-bold mb-3">Pattern Controls</h3>
	<div class="grid grid-cols-2 gap-4">
		<!-- Number of Cards Input -->
		<div class="form-control">
			<label class="label" for="cards-input">
				<span class="label-text">Number of Cards</span>
			</label>
			<input
				id="cards-input"
				type="number"
				bind:value={numberOfCards}
				min="1"
				max="100"
				class="input input-bordered w-full"
			/>
		</div>

		<!-- New Turn Controls -->
		<div class="form-control">
			<span class="label-text">Number of Turns: {numberOfTurns}</span>
			<div class="join">
				<button class="btn btn-secondary join-item flex-grow" on:click={() => onRemoveTurns(4)}>-4</button>
				<button class="btn btn-primary join-item flex-grow" on:click={() => onAddTurns(4)}>+4</button>
			</div>
		</div>
	</div>
</div>
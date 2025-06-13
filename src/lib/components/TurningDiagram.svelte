<!-- src/lib/components/TurningDiagram.svelte -->

<script lang="ts">
	import type { TurningSequence, Turn } from '$lib/types';

	export let turningSequence: TurningSequence = [];
	export let onTurnChange: (rowIndex: number, cardIndex: number, newTurn: Turn) => void;

	let isPainting = false;
	let paintTurnState: Turn | null = null;

	function handleMouseDown(rowIndex: number, cardIndex: number, currentTurn: Turn) {
		isPainting = true;
		if (currentTurn === 'F') {
			paintTurnState = 'B';
		} else if (currentTurn === 'B') {
			paintTurnState = 'I';
		} else {
			paintTurnState = 'F';
		}
		onTurnChange(rowIndex, cardIndex, paintTurnState);
	}

	function handleMouseOver(rowIndex: number, cardIndex: number) {
		if (isPainting && paintTurnState !== null) {
			onTurnChange(rowIndex, cardIndex, paintTurnState);
		}
	}
	
	function stopPainting() {
		isPainting = false;
		paintTurnState = null;
	}
</script>

<div class="p-4 border rounded-lg shadow-sm">
	<h3 class="text-lg font-bold mb-4">Turning Diagram</h3>
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="overflow-x-auto"
		on:mouseup={stopPainting}
		on:mouseleave={stopPainting}
		role="group"
	>
		<div class="inline-flex flex-row items-start gap-2">
			<!-- Column 1: Row Numbers -->
			<div class="flex flex-col-reverse text-center pt-px">
				{#each turningSequence as _, rowIndex (rowIndex)}
					<div
						class="w-7 h-7 flex items-center justify-center text-xs font-mono text-base-content/60"
						class:mt-2={rowIndex > 0 && (rowIndex + 1) % 4 === 0}
					>
						{rowIndex + 1}
					</div>
				{/each}
			</div>

			<!-- Column 2: The Interactive Grid -->
			<div class="inline-flex flex-col-reverse">
				{#each turningSequence as row, rowIndex (rowIndex)}
					<div
						class="flex flex-row gap-px"
						class:mt-2={rowIndex > 0 && (rowIndex + 1) % 4 === 0}
					>
						<!-- svelte-ignore a11y_mouse_events_have_key_events -->
						{#each row as turn, cardIndex (`${rowIndex}-${cardIndex}`)}
							<button
								class="w-7 h-7 flex items-center justify-center font-mono text-xs font-bold"
								class:bg-blue-200={turn === 'F'}
								class:text-blue-800={turn === 'F'}
								class:bg-red-200={turn === 'B'}
								class:text-red-800={turn === 'B'}
								class:bg-gray-200={turn === 'I'}
								class:text-gray-500={turn === 'I'}
								on:mousedown={() => handleMouseDown(rowIndex, cardIndex, turn)}
								on:mouseover={() => handleMouseOver(rowIndex, cardIndex)}
							>
								{turn}
							</button>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
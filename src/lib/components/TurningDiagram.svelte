<!-- src/lib/components/TurningDiagram.svelte -->

<script lang="ts">
	import type { TurningSequence, Turn } from '$lib/types';

	export let turningSequence: TurningSequence = [];
	export let onTurnChange: (rowIndex: number, cardIndex: number, newTurn: Turn) => void;

	let isPainting = false;
	let paintTurnState: Turn | null = null;

	// This is a reactive variable that is a reversed copy for display purposes.
	$: reversedSequence = [...turningSequence].reverse();

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
		<!-- This is the main container that builds from the bottom up -->
		<div class="inline-flex flex-col-reverse">
			<!-- A SINGLE LOOP now builds the entire diagram row-by-row -->
			{#each reversedSequence as row, i (i)}
				{@const originalRowIndex = turningSequence.length - 1 - i}
				{@const displayNumber = originalRowIndex + 1}
				
				<!-- Each "meta-row" is a flex container for the number and the buttons -->
				<div 
					class="flex flex-row items-start gap-2"
					class:mt-2={displayNumber > 1 && displayNumber % 4 === 1}
				>
					<!-- The Number Cell -->
					<div class="w-7 h-7 flex items-center justify-center text-xs font-mono text-base-content/60 pt-px">
						{displayNumber}
					</div>

					<!-- The Button Row -->
					<div class="flex flex-row gap-px">
						<!-- svelte-ignore a11y_mouse_events_have_key_events -->
						{#each row as turn, cardIndex (`${originalRowIndex}-${cardIndex}`)}
							<button
								class="w-7 h-7 flex items-center justify-center font-mono text-xs font-bold"
								class:bg-blue-200={turn === 'F'}
								class:text-blue-800={turn === 'F'}
								class:bg-red-200={turn === 'B'}
								class:text-red-800={turn === 'B'}
								class:bg-gray-200={turn === 'I'}
								class:text-gray-500={turn === 'I'}
								on:mousedown={() => handleMouseDown(originalRowIndex, cardIndex, turn)}
								on:mouseover={() => handleMouseOver(originalRowIndex, cardIndex)}
							>
								{turn}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
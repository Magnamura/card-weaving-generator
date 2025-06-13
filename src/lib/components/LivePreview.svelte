<!-- src/lib/components/LivePreview.svelte -->

<script lang="ts">
	import type { Pattern, Threading, TurningSequence, Turn } from '$lib/types';

	export let pattern: Pattern = [];
	export let threading: Threading = [];
	export let turningSequence: TurningSequence = [];
	export let onTurnChange: (rowIndex: number, cardIndex: number, newTurn: Turn) => void;

	// Create reactive reversed copies for display purposes
	$: reversedPattern = [...pattern].reverse();

	let isPainting = false;
	let paintTurnState: Turn | null = null;

	function handleMouseDown(rowIndex: number, cardIndex: number) {
		isPainting = true;
		const currentTurn = turningSequence[rowIndex]?.[cardIndex] || 'F';
		paintTurnState = currentTurn === 'F' ? 'B' : 'F';
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
	<h3 class="text-lg font-bold mb-4">Live Preview & Turning</h3>
	<p class="text-sm text-base-content/70 -mt-2 mb-4">Click and drag on the pattern to change turns (Forward/Backward).</p>

	{#if pattern.length > 0 && pattern[0].length > 0}
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="overflow-x-auto"
			on:mouseup={stopPainting}
			on:mouseleave={stopPainting}
			role="group"
		>
			<div class="inline-flex flex-col">
				<!-- Header Row: Card Numbers -->
				<div class="flex flex-row gap-px ml-[36px]">
					{#each pattern[0] as _, cardIndex (cardIndex)}
						<div class="w-7 h-7 flex items-center justify-center text-xs font-bold text-base-content/80">
							{cardIndex + 1}
						</div>
					{/each}
				</div>
				
				<!-- Main Content Row -->
				<div class="flex flex-row items-end gap-2">
					<!-- Column 1: Row Numbers (bottom-to-top) -->
					<div class="flex flex-col-reverse text-center gap-px">
						{#each pattern as _, rowIndex (rowIndex)}
							<div class="w-7 h-7 flex items-center justify-center text-xs font-mono text-base-content/60">
								{rowIndex + 1}
							</div>
						{/each}
					</div>

					<!-- Column 2: The Interactive Pattern (bottom-to-top) -->
					<div class="inline-flex flex-col gap-px">
						{#each reversedPattern as row, i (i)}
							{@const originalRowIndex = pattern.length - 1 - i}
							<div class="flex flex-row gap-px">
								{#each row as color, cardIndex (`${originalRowIndex}-${cardIndex}`)}
									{@const s_or_z = threading[cardIndex]?.direction || 'S'}
									{@const turn = turningSequence[originalRowIndex]?.[cardIndex] || 'F'}
									
									{@const rotation = (() => {
										if (turn === 'I') return 0;
										if (turn === 'F') return s_or_z === 'S' ? 25 : -25;
										if (turn === 'B') return s_or_z === 'S' ? -25 : 25;
										return 0;
									})()}

									<!-- svelte-ignore a11y_mouse_events_have_key_events -->
									<button
										class="w-7 h-7 p-0.5"
										class:bg-white={turn === 'F'}
										class:bg-gray-200={turn === 'B'}
										class:bg-gray-400={turn === 'I'}
										on:mousedown={() => handleMouseDown(originalRowIndex, cardIndex)}
										on:mouseover={() => handleMouseOver(originalRowIndex, cardIndex)}
										aria-label="Toggle turn for row {originalRowIndex + 1}, card {cardIndex + 1}. Current turn is {turn === 'F' ? 'Forward' : 'Backward'}."
									>
										<svg viewBox="0 0 24 24" class="w-full h-full" aria-hidden="true">
											<ellipse cx="12" cy="12" rx="6" ry="11" fill={color} stroke="#00000033" stroke-width="2" transform="rotate({rotation}, 12, 12)"></ellipse>
										</svg>
									</button>
								{/each}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<p class="text-base-content/70">The pattern will appear here once configured.</p>
	{/if}
</div>
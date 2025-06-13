<!-- src/lib/components/ThreadingDiagram.svelte -->

<script lang="ts">
	import type { Threading } from '$lib/types';

	export let threading: Threading = [];
	export let selectedColor: string;
	export let onCellClick: (cardIndex: number, holeIndex: number) => void;
	export let onDirectionToggle: (cardIndex: number) => void;

	let isPainting = false;
	// The labels are reversed to ensure 'A' (the last item) is placed at the bottom by flex-col-reverse.
	const holeLabels = ['D', 'C', 'B', 'A'];

	function handleMouseDown(cardIndex: number, holeIndex: number) {
		isPainting = true;
		onCellClick(cardIndex, holeIndex);
	}

	function handleMouseOver(cardIndex: number, holeIndex: number) {
		if (isPainting) {
			onCellClick(cardIndex, holeIndex);
		}
	}
</script>

<div class="p-4 border rounded-lg shadow-sm">
	<h3 class="text-lg font-bold mb-1">Threading Diagram</h3>
	<p class="text-sm text-base-content/70 mb-4">
		Click and drag to paint colors. Set S/Z direction below.
	</p>
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="overflow-x-auto"
		on:mouseup={() => (isPainting = false)}
		on:mouseleave={() => (isPainting = false)}
		role="group"
	>
		<div class="inline-flex flex-col">
			
			<!-- Meta-Row 1: Card Numbers -->
			<div class="flex flex-row">
				<div class="w-7 shrink-0"></div> 
				<div class="flex flex-row gap-px ml-1">
					{#each threading as _, cardIndex (cardIndex)}
						<div class="w-7 h-7 flex items-center justify-center text-xs font-mono text-base-content/60">{cardIndex + 1}</div>
					{/each}
				</div>
			</div>

			<!-- Meta-Row 2: The Main Grid -->
			<div class="flex flex-row">
				<!-- This column now correctly renders D,C,B,A from top to bottom -->
				<div class="flex flex-col-reverse gap-px mr-1">
					{#each holeLabels as label (label)}
						<div class="w-7 h-7 flex items-center justify-center text-xs font-mono text-base-content/60">{label}</div>
					{/each}
				</div>

				<!-- The Color Grid itself -->
				<div class="inline-grid gap-px p-px bg-base-300" style="grid-template-columns: repeat({threading.length}, 1fr);">
					{#each threading as cardSetup, cardIndex (cardIndex)}
						<!-- This individual card column also renders D,C,B,A from top to bottom -->
						<div class="flex flex-col-reverse gap-px">
							{#each cardSetup.colors as color, holeIndex (holeIndex)}
								{@const direction = cardSetup.direction}
								<!-- svelte-ignore a11y_mouse_events_have_key_events -->
								<button
									aria-label="Set color for card {cardIndex + 1} hole {holeIndex}"
									class="w-7 h-7 p-0.5 hover:ring-2 hover:ring-primary hover:z-10 bg-white"
									on:mousedown={() => handleMouseDown(cardIndex, holeIndex)}
									on:mouseover={() => handleMouseOver(cardIndex, holeIndex)}
								>
									<svg viewBox="0 0 24 24" class="w-full h-full">
										<ellipse cx="12" cy="12" rx="6" ry="11" fill={color} stroke="#00000033" stroke-width="2" transform="rotate({direction === 'S' ? 25 : -25}, 12, 12)"></ellipse>
									</svg>
								</button>
							{/each}
						</div>
					{/each}
				</div>
			</div>

			<!-- Meta-Row 3: S/Z Toggles -->
			<div class="flex flex-row mt-px">
				<div class="w-7 shrink-0"></div>
				<div class="flex flex-row gap-px ml-1">
					{#each threading as cardSetup, cardIndex (cardIndex)}
						<button
							class="w-7 h-7 flex items-center justify-center font-bold text-sm"
							class:text-primary-content={cardSetup.direction === 'S'}
							class:bg-primary={cardSetup.direction === 'S'}
							class:text-secondary-content={cardSetup.direction === 'Z'}
							class:bg-secondary={cardSetup.direction === 'Z'}
							on:click={() => onDirectionToggle(cardIndex)}
						>
							{cardSetup.direction}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
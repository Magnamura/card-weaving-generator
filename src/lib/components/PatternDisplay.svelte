<!-- src/lib/components/PatternDisplay.svelte -->

<script lang="ts">
	import type { Pattern, Threading, TurningSequence } from '$lib/types';

	export let pattern: Pattern = [];
	export let threading: Threading = [];
	export let turningSequence: TurningSequence = [];
</script>

<div class="p-4 border rounded-lg shadow-sm">
	<h3 class="text-lg font-bold mb-4">Resulting Pattern</h3>

	{#if pattern.length > 0 && pattern[0].length > 0}
		<div class="overflow-x-auto">
			<div class="inline-flex flex-row items-start gap-2">
				<!-- Column 1: Row Numbers -->
				<div class="flex flex-col text-center pt-[20px]">
					{#each pattern as _, rowIndex (rowIndex)}
						<div class="w-5 h-5 flex items-center justify-center text-xs font-mono text-base-content/60">
							{rowIndex + 1}
						</div>
					{/each}
				</div>

				<!-- Column 2: The Pattern Grid (New Structure) -->
				<div class="inline-flex flex-col">
					<!-- Header Row: Card Numbers -->
					<div class="flex flex-row gap-px">
						{#each pattern[0] as _, cardIndex (cardIndex)}
							<div class="w-5 h-5 flex items-center justify-center text-xs font-mono text-base-content/60">
								{cardIndex + 1}
							</div>
						{/each}
					</div>

					<!-- The Grid itself (renders naturally top-to-bottom) -->
					<div class="grid gap-px mt-px" style="grid-template-columns: repeat({pattern[0].length}, 1fr);">
						{#each pattern as row, rowIndex (rowIndex)}
							{#each row as color, cardIndex (`${rowIndex}-${cardIndex}`)}
								{@const s_or_z = threading[cardIndex]?.direction || 'S'}
								{@const turn = turningSequence[rowIndex]?.[cardIndex] || 'I'}
								
								{@const rotation = (() => {
									if (turn === 'I') return 0;
									if (turn === 'F') return s_or_z === 'S' ? 25 : -25;
									if (turn === 'B') return s_or_z === 'S' ? -25 : 25;
									return 0;
								})()}

								<div class="w-5 h-5 p-px bg-white">
									<svg viewBox="0 0 24 24" class="w-full h-full">
										<ellipse
											cx="12" cy="12" rx="6" ry="11"
											fill={color}
											stroke="#00000033" stroke-width="2"
											transform="rotate({rotation}, 12, 12)"
										></ellipse>
									</svg>
								</div>
							{/each}
						{/each}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<p class="text-base-content/70">The pattern will appear here once configured.</p>
	{/if}
</div>
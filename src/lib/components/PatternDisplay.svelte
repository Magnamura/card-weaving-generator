<!-- src/lib/components/PatternDisplay.svelte -->

<script lang="ts">
	import type { Pattern, Threading } from '$lib/types';

	export let pattern: Pattern = [];
	export let threading: Threading = [];

	// Create a reactive variable that is a reversed copy of the pattern for display purposes.
	$: reversedPattern = [...pattern].reverse();
</script>

<div class="p-4 border rounded-lg shadow-sm">
	<h3 class="text-lg font-bold mb-4">Resulting Pattern</h3>

	{#if pattern.length > 0 && pattern[0].length > 0}
		<div class="overflow-x-auto">
			<div class="inline-flex flex-row items-end gap-2">

				<!-- Column 1: Row Numbers (Now starts from 1 at the bottom) -->
				<div class="flex flex-col-reverse text-center">
					{#each pattern as _, rowIndex (rowIndex)}
						<div class="w-5 h-5 flex items-center justify-center text-xs font-mono text-base-content/60">
							{rowIndex + 1}
						</div>
					{/each}
				</div>

				<!-- Column 2: The Pattern Block (Renders bottom-to-top) -->
				<div class="inline-flex flex-col-reverse">
					{#each reversedPattern as row, i (i)}
						{@const originalRowIndex = pattern.length - 1 - i}
						<div class="flex flex-row gap-px">
							{#each row as color, cardIndex (`${originalRowIndex}-${cardIndex}`)}
								{@const direction = threading[cardIndex]?.direction || 'S'}
								<div class="w-5 h-5 p-px bg-white">
									<svg viewBox="0 0 24 24" class="w-full h-full">
										<ellipse
											cx="12" cy="12" rx="6" ry="11"
											fill={color}
											stroke="#00000033"
											stroke-width="2"
											transform="rotate({direction === 'S' ? 25 : -25}, 12, 12)"
										></ellipse>
									</svg>
								</div>
							{/each}
						</div>
					{/each}
				</div>

			</div>
		</div>
	{:else}
		<p class="text-base-content/70">The pattern will appear here once configured.</p>
	{/if}
</div>
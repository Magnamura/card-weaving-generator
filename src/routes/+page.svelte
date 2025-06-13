<!-- src/routes/+page.svelte -->

<script lang="ts">
	import type { Threading, Pattern, CardColors, TurningSequence, Turn } from '$lib/types';
	import { generatePattern } from '$lib/logic/weavingEngine';
	import Controls from '$lib/components/Controls.svelte';
	import ColorPalette from '$lib/components/ColorPalette.svelte';
	import ThreadingDiagram from '$lib/components/ThreadingDiagram.svelte';
	import PatternDisplay from '$lib/components/PatternDisplay.svelte';
	import TurningDiagram from '$lib/components/TurningDiagram.svelte';
	import ShareAndLoad from '$lib/components/ShareAndLoad.svelte';

	const DEFAULT_CARDS = 12;
	const DEFAULT_TURNS = 20;
	const defaultCardColors: CardColors = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'];

	type ShareData = { threading: Threading; turningSequence: TurningSequence; };

	let numberOfCards = $state(DEFAULT_CARDS);
	let numberOfTurns = $state(DEFAULT_TURNS);
	let selectedColor = $state('#FFFFFF');
	let threading = $state<Threading>([]);
	let turningSequence = $state<TurningSequence>([]);
	let pattern = $state<Pattern>([]);

	let turningDiagramEl: HTMLElement | undefined;
	let patternDisplayEl: HTMLElement | undefined;

	// --- FINAL, State-Preserving Effect to Sync Grids ---
	// This effect intelligently adds or removes rows/columns without resetting the user's work.
	$effect(() => {
		const targetCards = numberOfCards;
		const targetTurns = numberOfTurns;

		// --- Sync Threading Diagram Columns ---
		const currentCardCount = threading.length;
		if (targetCards > currentCardCount) {
			// Add new cards to the end
			for (let i = currentCardCount; i < targetCards; i++) {
				threading.push({ colors: [...defaultCardColors], direction: 'S' });
			}
		} else if (targetCards < currentCardCount) {
			// Truncate the array
			threading.length = targetCards;
		}

		// --- Sync Turning Diagram Rows ---
		const currentTurnCount = turningSequence.length;
		if (targetTurns > currentTurnCount) {
			// Add new rows to the end
			for (let i = currentTurnCount; i < targetTurns; i++) {
				turningSequence.push(Array(targetCards).fill('F'));
			}
		} else if (targetTurns < currentTurnCount) {
			// Truncate the array
			turningSequence.length = targetTurns;
		}

		// --- Sync Turning Diagram Columns for Every Row ---
		// This ensures that when you add a card, every row gets the new column.
		for (const row of turningSequence) {
			const currentColCount = row.length;
			if (targetCards > currentColCount) {
				row.push(...Array(targetCards - currentColCount).fill('F'));
			} else if (targetCards < currentColCount) {
				row.length = targetCards;
			}
		}
		
		// Signal to Svelte that the arrays have been mutated "deeply".
		threading = threading;
		turningSequence = turningSequence;
	});

	// --- Pattern Generation Effect ---
	$effect(() => {
		if (threading.length > 0 && turningSequence.length > 0) {
			pattern = generatePattern(threading, turningSequence);
		}
	});
	
	// --- Height Synchronization Effect ---
	$effect(() => {
		const _turningData = turningSequence;
		setTimeout(() => {
			if (turningDiagramEl && patternDisplayEl) {
				turningDiagramEl.style.height = 'auto';
				patternDisplayEl.style.height = 'auto';
				const maxHeight = Math.max(turningDiagramEl.offsetHeight, patternDisplayEl.offsetHeight);
				turningDiagramEl.style.height = `${maxHeight}px`;
				patternDisplayEl.style.height = `${maxHeight}px`;
			}
		}, 0);
	});

	// --- Event Handlers ---
	function handleCellUpdate(cardIndex: number, holeIndex: number) {
		threading[cardIndex].colors[holeIndex] = selectedColor;
		threading = threading;
	}
	function handleDirectionToggle(cardIndex: number) {
		threading[cardIndex].direction = threading[cardIndex].direction === 'S' ? 'Z' : 'S';
		threading = threading;
	}
	function handleTurnChange(rowIndex: number, cardIndex: number, newTurn: Turn) {
		turningSequence[rowIndex][cardIndex] = newTurn;
		turningSequence = turningSequence;
	}
	function addTurns(amount: number) { numberOfTurns += amount; }
	function removeTurns(amount: number) { numberOfTurns = Math.max(4, numberOfTurns - amount); }

	// --- Action Handlers ---
	function resetState() {
		if (confirm('Are you sure you want to reset the pattern?')) {
			// To force a full reset, we empty the arrays before setting the default dimensions.
			// This tells the main effect to build completely fresh grids.
			threading = [];
			turningSequence = [];
			numberOfCards = DEFAULT_CARDS;
			numberOfTurns = DEFAULT_TURNS;
		}
	}
	function loadState(loadedData: ShareData) {
		if (loadedData.threading && loadedData.turningSequence) {
			threading = loadedData.threading;
			turningSequence = loadedData.turningSequence;
			numberOfCards = threading.length;
			numberOfTurns = turningSequence.length;
			(document.getElementById('load_modal') as HTMLDialogElement)?.close();
		} else {
			throw new Error("Data structure is invalid.");
		}
	}
</script>

<svelte:head>
	<title>Card Weaving Pattern Generator</title>
</svelte:head>

<main class="container mx-auto p-4 md:p-8">
	<header class="text-center mb-8 print-hidden">
		<h1 class="text-4xl font-bold text-primary">Card Weaving Pattern Generator</h1>
	</header>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 printable-area">
		<!-- Left Column (unchanged) -->
		<div class="flex flex-col gap-6 print-hidden">
			<ShareAndLoad {threading} {turningSequence} onReset={resetState} onLoad={loadState} />
			<Controls 
				bind:numberOfCards 
				bind:numberOfTurns 
				onAddTurns={addTurns} 
				onRemoveTurns={removeTurns} 
			/>
			<ColorPalette bind:selectedColor />
			<ThreadingDiagram {threading} {selectedColor} onCellClick={handleCellUpdate} onDirectionToggle={handleDirectionToggle} />
		</div>

		<!-- Right Column (Now with separate Screen and Print views) -->
		<div class="flex flex-col gap-6">
			
			<!-- 1. SCREEN-ONLY VIEW -->
			<!-- This container holds the side-by-side layout for the screen and is hidden on print -->
			<div class="flex flex-col md:flex-row items-start gap-6 print-hidden">
				<div class="print-no-style" bind:this={turningDiagramEl}>
					<TurningDiagram {turningSequence} onTurnChange={handleTurnChange} />
				</div>
				<div class="print-no-style" bind:this={patternDisplayEl}>
					<PatternDisplay {pattern} {threading} />
				</div>
			</div>

			<!-- 2. PRINT-ONLY VIEW -->
			<!-- This container is hidden on screen and becomes a vertical block for printing -->
			<div class="hidden print-block">
				<!-- We render clean, non-interactive versions of all three diagrams -->
				<div class="print-no-style mb-6">
					<!-- The ThreadingDiagram is now included in the printout -->
					<ThreadingDiagram {threading} {selectedColor} onCellClick={handleCellUpdate} onDirectionToggle={handleDirectionToggle} />
				</div>
				<div class="print-no-style mb-6">
					<TurningDiagram {turningSequence} onTurnChange={handleTurnChange} />
				</div>
				<div class="print-no-style">
					<PatternDisplay {pattern} {threading} />
				</div>
			</div>

		</div>
	</div>
</main>


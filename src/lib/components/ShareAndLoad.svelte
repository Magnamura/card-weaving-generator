<!-- src/lib/components/ShareAndLoad.svelte -->

<script lang="ts">
	import type { Threading, TurningSequence } from '$lib/types';
	// Import the Base64 functions
	import lz from 'lz-string';
	const { compressToBase64, decompressFromBase64 } = lz;

	// This is the data structure we expect to find inside the share code
	type ShareData = {
		threading: Threading;
		turningSequence: TurningSequence;
	};

	export let threading: Threading;
	export let turningSequence: TurningSequence;
	export let onReset: () => void;
	// THE FIX: The onLoad prop now expects a fully parsed object, not a string.
	export let onLoad: (data: ShareData) => void;

	let shareCode = '';
	let codeToLoad = '';
	let loadError = '';
	let copyButtonText = 'Copy';

	function generateShareCode() {
		try {
			const dataToSave: ShareData = { threading, turningSequence };
			const jsonString = JSON.stringify(dataToSave);
			shareCode = compressToBase64(jsonString);
			(document.getElementById('share_modal') as HTMLDialogElement)?.showModal();
		} catch (e) {
			console.error("Error generating share code", e);
		}
	}

	async function copyCodeToClipboard() {
		// This function is correct and remains the same
		if (!navigator.clipboard) { copyButtonText = 'Error!'; return; }
		try {
			await navigator.clipboard.writeText(shareCode);
			copyButtonText = 'Copied!';
			setTimeout(() => { copyButtonText = 'Copy'; }, 2000);
		} catch (err) {
			copyButtonText = 'Failed!';
		}
	}
	
	function handleLoad() {
		loadError = '';
		if (!codeToLoad) return;
		try {
			// THE FIX: Decompression and parsing now happen HERE.
			const decompressed = decompressFromBase64(codeToLoad);
			if (!decompressed) {
				throw new Error("Could not decompress code.");
			}
			const loadedData: ShareData = JSON.parse(decompressed);

			// Call the parent's onLoad function with the clean object.
			onLoad(loadedData);

			codeToLoad = '';
		} catch(e: any) {
			loadError = e.message || "Invalid or corrupt code.";
		}
	}
    
</script>

<!-- The HTML template for this component is unchanged -->
<div class="p-4 border rounded-lg shadow-sm print-no-style print-hidden">
	<h3 class="text-lg font-bold mb-3">Actions</h3>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
		<button class="btn btn-primary" on:click={generateShareCode}>Save/Share</button>
		<button class="btn btn-secondary" on:click={() => window.print()}>Print</button>
		<button class="btn btn-accent" on:click={() => (document.getElementById('load_modal') as HTMLDialogElement)?.showModal()}>Load</button>
		<button class="btn btn-error" on:click={onReset}>Reset All</button>
	</div>
</div>

<dialog id="share_modal" class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Share Your Pattern</h3>
		<p class="py-2">Copy this compact code to save or share your pattern.</p>
		<textarea readonly class="textarea textarea-bordered w-full h-32 my-2 font-mono text-xs">{shareCode}</textarea>
		<div class="modal-action">
			<form method="dialog"><button class="btn">Close</button></form>
			<button class="btn btn-success ml-2" on:click={copyCodeToClipboard}>{copyButtonText}</button>
		</div>
	</div>
</dialog>

<dialog id="load_modal" class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Load Pattern from Code</h3>
		<p class="py-2">Paste a previously saved code below to load the pattern.</p>
		<textarea class="textarea textarea-bordered w-full h-32 my-2 font-mono text-xs" bind:value={codeToLoad} placeholder="Paste compact code here..."></textarea>
		{#if loadError}<p class="text-error text-sm">{loadError}</p>{/if}
		<div class="modal-action">
			<form method="dialog"><button class="btn">Cancel</button></form>
			<button class="btn btn-primary ml-2" on:click={handleLoad}>Load</button>
		</div>
	</div>
</dialog>
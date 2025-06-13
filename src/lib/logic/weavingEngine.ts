// src/lib/logic/weavingEngine.ts

import type { Pattern, Threading, TurningSequence } from '$lib/types';

/**
 * The core algorithm, with the final and physically correct rotation logic.
 *
 * @param threading The array of CardSetup objects.
 * @param turningSequence The 2D grid of turning instructions ('F', 'B', or 'I').
 * @returns A 2D array of color strings representing the final pattern.
 */
export function generatePattern(
	threading: Threading,
	turningSequence: TurningSequence
): Pattern {
	if (!threading || threading.length === 0 || !turningSequence || turningSequence.length === 0) {
		return [];
	}

	const numberOfCards = threading.length;
	const numberOfTurns = turningSequence.length;
	const finalPattern: Pattern = [];
	const cardRotations = new Array(numberOfCards).fill(0);

	for (let turnIndex = 0; turnIndex < numberOfTurns; turnIndex++) {
		const currentRow: string[] = [];
		const turnRow = turningSequence[turnIndex] || [];

		// Step 1: Build the current row based on the current state of all card rotations.
		for (let cardIndex = 0; cardIndex < numberOfCards; cardIndex++) {
			const currentCardSetup = threading[cardIndex];
			const topHoleIndex = (cardRotations[cardIndex] % 4 + 4) % 4;
			const color = currentCardSetup.colors[topHoleIndex];
			currentRow.push(color);
		}
		console.log(`Turn ${turnIndex}`, currentRow.join(' '));
		finalPattern.push(currentRow);

		// Step 2: After the row is complete, update all card rotations for the NEXT turn.
		for (let cardIndex = 0; cardIndex < numberOfCards; cardIndex++) {
			const turnDirection = cardIndex < turnRow.length ? turnRow[cardIndex] : 'I';
			const cardThreadingDirection = threading[cardIndex].direction;

			// --- THIS IS THE CORRECT, PHYSICALLY ACCURATE LOGIC ---
			if (turnDirection === 'F') {
				// On a FORWARD turn:
				// S-threaded cards rotate one way (+1).
				// Z-threaded cards rotate the OPPOSITE way (-1).
				if (cardThreadingDirection === 'S') {
					cardRotations[cardIndex]++;
				} else { // 'Z'
					cardRotations[cardIndex]--;
				}
			} else if (turnDirection === 'B') {
				// On a BACKWARD turn:
				// S-threaded cards rotate the other way (-1).
				// Z-threaded cards rotate the OPPOSITE way (+1).
				if (cardThreadingDirection === 'S') {
					cardRotations[cardIndex]--;
				} else { // 'Z'
					cardRotations[cardIndex]++;
				}
			}
			// If turnDirection is 'I', the rotation does not change.
		}
	}

	return finalPattern;
}
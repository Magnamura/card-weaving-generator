// src/lib/logic/weavingEngine.ts

import type { Pattern, Threading, TurningSequence } from '$lib/types';

/**
 * The core algorithm, now using a 2D turning grid for individual card control.
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

		for (let cardIndex = 0; cardIndex < numberOfCards; cardIndex++) {
			const currentCardSetup = threading[cardIndex];
			const topHoleIndex = (cardRotations[cardIndex] % 4 + 4) % 4;
			const color = currentCardSetup.colors[topHoleIndex];
			currentRow.push(color);

			// --- ROTATION LOGIC IS NOW INSIDE THE CARD LOOP ---
			const turnDirection = turnRow[cardIndex] || 'I'; // Default to Idle if undefined
			const cardDirection = currentCardSetup.direction;

			if (turnDirection === 'F') {
				if (cardDirection === 'S') cardRotations[cardIndex]++; else cardRotations[cardIndex]--;
			} else if (turnDirection === 'B') {
				if (cardDirection === 'S') cardRotations[cardIndex]--; else cardRotations[cardIndex]++;
			}
			// If turnDirection is 'I', we do nothing to the rotation.
		}
		finalPattern.push(currentRow);
	}

	return finalPattern;
}
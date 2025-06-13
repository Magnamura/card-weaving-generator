// src/lib/types.ts

export type CardColors = [string, string, string, string];

export interface CardSetup {
	colors: CardColors;
	direction: 'S' | 'Z';
}

export type Threading = CardSetup[];

export type Pattern = string[][];

// --- NEW TYPES ---
// A Turn can be Forward, Backward, or Idle.
export type Turn = 'F' | 'B' | 'I';

// A Turning Sequence is now a 2D array (a grid).
// Each inner array represents one row of turns.
export type TurningSequence = Turn[][];
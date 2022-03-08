import { writable } from "svelte/store";

function scoreCount() {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		increment: () => update((n) => n + 1),
		decrement: () => update((n) => n - 1),
		reset: () => set(0),
	};
}

function scores() {
	const { subscribe, set, update } = writable([]);

	return {
		subscribe,
		set: (input) => set(input),
		reset: () => set(),
	};
}

function update() {
	const { subscribe, set, update } = writable(false);

	return {
		subscribe,
		set: (n) => set(n),
		reset: () => set(false),
	};
}

export const count = scoreCount();
export const score = scores();
export const hasUpdated = update();

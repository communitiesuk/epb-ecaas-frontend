import { defineNuxtPlugin } from "#app";

// Developer note: This plugin suppresses Vue Suspense warnings in tests by overriding console.info.
// Suspense is still technically experimental so could change however,
// this warning shows after every unit test that interacts with a Suspense component. 
// This fills the stdout with hundreds of repetitive warnings during tests.

export default defineNuxtPlugin(() => {
	// Suppress Vue Suspense warnings in tests
	const originalWarn = console.info;
	console.info = (...args: unknown[]) => {
		if (typeof args[0] === "string" && args[0].startsWith("<Suspense>")) {
			return;
		}
		originalWarn(...args);
	};
});
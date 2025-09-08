import { isEcaasForm } from "./ecaasStore.schema";

export type Resolved<T> = { readonly [P in keyof T]: T[P] extends EcaasForm<infer U> ? U : Resolved<T[P]> } & {};

export function resolveState<T extends object>(state: T): Resolved<T> {
	const resolvedState: Partial<Resolved<T>> = {};

	for (const key in state) {
		const value = state[key];

		if (key.startsWith("$") || key.startsWith("_") || typeof value === "function") {
			continue;
		}

		if (isEcaasForm(value)) {
			if (value.complete) {
				resolvedState[key] = value.data as Resolved<T>[typeof key];
			}
		} else if (typeof value === "object" && value !== null) {
			resolvedState[key] = resolveState(value) as Resolved<T>[typeof key];
		} else {
			resolvedState[key] = value as Resolved<T>[typeof key];
		}
	}

	return resolvedState as Resolved<T>;
}

import { isEcaasForm, type EcaasForm } from "./ecaasStore.schema";

export type Resolved<T> = { readonly [P in keyof T]: T[P] extends EcaasForm<infer U> ? (U extends Array<EcaasForm<infer V>> ? V[] : U) : Resolved<T[P]> } & {};

export function resolveState<T extends object>(state: T): Resolved<T> {
	const resolvedState: Partial<Resolved<T>> = {};

	for (const key in state) {
		const value = state[key];

		if (key.startsWith("$") || key.startsWith("_") || typeof value === "function") {
			continue;
		}

		if (isEcaasForm(value)) {
			if (value.complete) {
				if (Array.isArray(value.data)) {
					resolvedState[key] = value.data.reduce((acc, form) => {
						// backwards compatible check - can remove else clause when lists within forms all contain forms
						if (isEcaasForm(form)) {
							if (!form.complete) {
								return acc;
							}
							acc.push(form.data);
						} else {
							acc.push(form);
						}
						return acc;
					}, []);
				} else {
					resolvedState[key] = value.data as Resolved<T>[typeof key];
				}
			}
		} else if (typeof value === "object" && value !== null) {
			resolvedState[key] = resolveState(value) as Resolved<T>[typeof key];
		} else {
			resolvedState[key] = value as Resolved<T>[typeof key];
		}
	}

	return resolvedState as Resolved<T>;
}

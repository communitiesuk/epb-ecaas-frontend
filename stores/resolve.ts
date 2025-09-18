import type { ResolvedState } from "~/mapping/fhsInputMapper";
import { isEcaasForm, type EcaasForm, type EcaasFormList, type EcaasState } from "./ecaasStore.schema";

export type Resolved<T> = {
	readonly [P in keyof T]: T[P] extends EcaasFormList<infer U>
		? (U & { complete: true })[] : T[P] extends EcaasForm<infer V>
			? V : Resolved<T[P]>
};

export function resolveState(state: EcaasState): ResolvedState {
	return resolveStateTree(state);
}

function resolveStateTree<T extends object>(state: T): Resolved<T> {
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
			resolvedState[key] = resolveStateTree(value) as Resolved<T>[typeof key];
		} else {
			resolvedState[key] = value as Resolved<T>[typeof key];
		}
	}

	return resolvedState as Resolved<T>;
}

export const _private = {
	resolveStateTree,
};

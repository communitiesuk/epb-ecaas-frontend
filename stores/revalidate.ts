import type { ZodError } from "zod";
import { isEcaasForm, type EcaasForm, type EcaasFormPath } from "./ecaasStore.schema";

type RevalidateResult = {
	newState: Record<string, unknown>;
} & ({
	changed: false;
} | {
	changed: true;
	errors: ZodError<unknown>[];
});

export function revalidateState(state: Record<string, unknown>, path: string[] = []): RevalidateResult {
	const newState = {...state};
	const errors: ZodError<unknown>[] = [];
    
	for (const key in state) {
		const value = state[key];

		if (key.startsWith('$') || key.startsWith('_') || typeof value === 'function') {
			continue;
		}

		if (isEcaasForm(value)) {
			if (!value.complete) {
				continue;
			}
			const [formIsInvalid, formErrors] = revalidateForm(value, formPath(path, key));
			if (formIsInvalid) {
				errors.push(...formErrors);
			}
		} else if (typeof value === 'object' && value !== null) {
			const nodeResult = revalidateState(value as Record<string, unknown>, [...path, key]);
			if (nodeResult.changed) {
				errors.push(...nodeResult.errors);
				newState[key] = nodeResult.newState;
			}
		}
	}

	if (errors.length === 0) {
		return {
			newState: state,
			changed: false,
		};
	} else {
		return {
			newState,
			changed: true,
			errors,
		};
	}
}

function formPath(path: string[], currentKey: string): EcaasFormPath {
	return [...path, currentKey].join('/') as EcaasFormPath;
}

function revalidateForm(form: EcaasForm<unknown>, path: EcaasFormPath): [true, ZodError<unknown>[]] | [false] {
	const formSchema = formSchemas[path];
	// following could happen if state contains nodes no longer in the schema, but if so we should just ignore these nodes
	if (!formSchema) {
		return [false];
	}
	const formData = form.data;
	if (!Array.isArray(formData)) {
		const validationResult = formSchema.safeParse(formData);
		if (validationResult.success) {
			return [false];
		} else {
			console.log(`revalidation found invalid form at path ${path}:`, validationResult.error);
			form.complete = false;
			return [true, [validationResult.error]];
		}
	} else if (formData.every(isEcaasForm)) {
		// it could be an array of sub-forms
		const [changed, errors]: [boolean, ZodError<unknown>[]] = formData.reduce(([changed, errors], current) => {
			const validationResult = formSchema.safeParse(current.data);
			if (!validationResult.success) {
				current.complete = false;
			}
            
			return [!validationResult.success || changed, validationResult.error ? [...errors, validationResult.error] : errors];
		}, [false as boolean, [] as ZodError<unknown>[]]);

		if (changed) {
			form.complete = false;
			return [changed, errors];
		} else {
			return [false];
		}
	} else {
		// it could also be an array of data
		const [changed, errors]: [boolean, ZodError<unknown>[]] = formData.reduce(([changed, errors], current) => {
			const validationResult = formSchema.safeParse(current);
            
			return [!validationResult.success || changed, validationResult.error ? [...errors, validationResult.error] : errors];
		}, [false, []]);

		if (changed) {
			form.complete = false;
			return [changed, errors];
		} else {
			return [false];
		}
	}
}
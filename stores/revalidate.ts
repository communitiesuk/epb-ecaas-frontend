import type { ZodError } from "zod";
import { isEcaasForm, type EcaasForm, type EcaasFormPath } from "./ecaasStore.schema";

type RevalidateError = ZodError<unknown> | string;

type RevalidateResult = {
	newState: Record<string, unknown>;
} & ({
	changed: false;
} | {
	changed: true;
	errors: RevalidateError[];
});

export function revalidateState(state: Record<string, unknown>, path: string[] = []): RevalidateResult {
	const newState = { ...state };
	const errors: RevalidateError[] = [];
    
	for (const key in state) {
		const value = state[key];

		if (key.startsWith("$") || key.startsWith("_") || typeof value === "function") {
			continue;
		}

		if (isEcaasForm(value)) {
			reformatForm(value);

			if (!value.complete) {
				continue;
			}

			const [formIsInvalid, formErrors] = revalidateForm(value, formPath(path, key));

			if (formIsInvalid) {
				errors.push(...formErrors);
			}
		} else if (typeof value === "object" && value !== null) {
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
	}

	return {
		newState,
		changed: true,
		errors,
	};
}

function formPath(path: string[], currentKey: string): EcaasFormPath {
	return [...path, currentKey].join("/") as EcaasFormPath;
}

function reformatForm(form: EcaasForm<unknown>) {
	// Form data is a single data object
	if (!Array.isArray(form.data)) {
		return;
	}

	// Form data is an array
	const allEcaasForms = form.data.every(isEcaasForm);
	let ecaasFormData: EcaasForm<unknown>[] = allEcaasForms ? form.data : [];

	// Check for any non-EcaasForm objects in array
	if (!allEcaasForms) {
		
		// Extract form data which are EcaasForms
		const ecaasForms = form.data.filter(isEcaasForm);

		// Extract form data which are not EcaasForms
		const nonEcaasForms = form.data.filter(x => !isEcaasForm(x));

		// Wrap form data in an array of EcaasForms and join with EcaasForms
		ecaasFormData = ecaasForms.concat(nonEcaasForms.map(x => ({
			data: x,
			complete: true,
		})));

		// Update form data reference
		form.data = ecaasFormData;
	}
}

function handleInvalidForm(form: EcaasForm<unknown>, path: EcaasFormPath, error: unknown) {
	console.log(`revalidation found invalid form at path ${path}:`, error);
	form.complete = false;
}

function revalidateForm(form: EcaasForm<unknown>, path: EcaasFormPath): [true, RevalidateError[]] | [false] {
	const formSchema = formSchemas[path];

	// following could happen if state contains nodes no longer in the schema, but if so we should just ignore these nodes
	if (!formSchema) {
		return [false];
	}

	// Form data is a single data object
	if (!Array.isArray(form.data)) {
		try {
			const validationResult = formSchema.safeParse(form.data);

			if (validationResult.success) {
				return [false];
			}

			handleInvalidForm(form, path, validationResult.error);

			return [true, [validationResult.error]];
		} catch (error) {
			handleInvalidForm(form, path, error);

			return [true, [error as string]];
		}
	}

	// // Form data is an array - validate data in each EcaasForm
	const [changed, errors]: [boolean, RevalidateError[]] = form.data.reduce(([changed, errors], current) => {
		try {
			const validationResult = formSchema.safeParse(current.data);

			current.complete = validationResult.success;
			
			return [!validationResult.success || changed, validationResult.error ? [...errors, validationResult.error] : errors];
		} catch (error) {
			handleInvalidForm(form, path, error);

			return [true, [...errors, error]];
		}
	}, [false as boolean, [] as RevalidateError[]]);

	if (changed) {
		form.complete = false;
		return [changed, errors];
	}

	return [false];
}
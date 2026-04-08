import type { CheckSchema } from "../server.types";
import { ajv, humanReadable } from "~/schema/validator";

export default defineEventHandler(async (event): Promise<CheckSchema> => {
	const inputBody = await readBody(event);
	
	const validate = ajv.getSchema("fhs")!;
	const isValid = validate(inputBody);
	if (!isValid) {
		const validationErrors = validate.errors!;
		const readableErrors = humanReadable(validationErrors, inputBody);
		reportErrors(inputBody, readableErrors, "Schema validation error");

		return {
			success: false,
			error: readableErrors,
		};
	} else {
		return { success: true };
	}
});

function reportErrors(_requestData: object, _validationErrors: string, _errorMessage: string) {
	console.log("complete this by sending error to sentry!");
}
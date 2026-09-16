import { ajv, humanReadable } from "~/schema/validator";
import type { CheckSchema } from "../server.types";

export default defineEventHandler(async (event): Promise<CheckSchema> => {
	const inputBody = await readBody(event);
	
	const validate = ajv.getSchema("fhs")!;
	const isValid = validate(inputBody);
	if (!isValid) {
		const validationErrors = validate.errors!;
		const readableErrors = humanReadable(validationErrors, inputBody);
		reportSchemaCheckErrors(inputBody, readableErrors, "Schema validation error");

		return {
			success: false,
			error: readableErrors,
		};
	} else {
		return { success: true };
	}
});

function reportSchemaCheckErrors(requestData: object, validationErrors: string, errorMessage: string) {
	return reportErrors(requestData, validationErrors, errorMessage, "schemaCheck", "schemaCheck");
}

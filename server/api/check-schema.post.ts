import type { CheckSchema } from "../server.types";
import { ajv, humanReadable } from "~/schema/validator";
import * as Sentry from "@sentry/nuxt";

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

function reportErrors(requestData: object, validationErrors: string, errorMessage: string) {
	Sentry.withScope(scope => {
		scope.setExtra("validationErrors", validationErrors);
		scope.setExtra("requestBody", JSON.stringify(requestData));
		scope.setFingerprint([errorMessage]);
		Sentry.captureException(new Error(errorMessage));
	});
}
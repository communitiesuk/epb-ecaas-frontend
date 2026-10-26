import * as Sentry from "@sentry/nuxt";

export function reportErrors(validatedData: object, validatorErrors: unknown, error: string | Error, dataDescriptor: string = "request", validatedDataDescriptor: string = "response"): void {
	const dataAsJsonString = JSON.stringify(validatedData);

	Sentry.withScope(scope => {
		if (validatorErrors) {
			scope.setExtra(`${validatedDataDescriptor}Errors`, validatorErrors);
		}

		// Add the request/response body as an attachment, so we can see the full body in Sentry.
		// Note: Attachments are retained for 90 days, and if our total storage quota is exceeded,
		// attachments will not be stored. Sentry allows at most 40MB for a compressed request,
		// and at most 200MB of uncompressed attachments per event.
		Sentry.getCurrentScope().addAttachment({
			filename: `${dataDescriptor}Body`,
			data: dataAsJsonString,
			contentType: "application/json",
		});

		// Clear attachments
		// Sentry.getCurrentScope().clearAttachments();

		scope.setFingerprint([error instanceof Error ? error.message : error]);
		Sentry.captureException(error instanceof Error ? error : new Error(error));
	});
}
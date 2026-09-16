import * as Sentry from "@sentry/nuxt";
import zlib from "zlib";

export function reportErrors(validatedData: object, validatorErrors: unknown, error: string | Error, dataDescriptor: string = "request", validatedDataDescriptor: string = "response"): void {
	const dataAsJsonString = JSON.stringify(validatedData);

	Sentry.withScope(scope => {
		if (validatorErrors) {
			scope.setExtra(`${validatedDataDescriptor}Errors`, validatorErrors);
		}
		scope.setExtra(`${dataDescriptor}Body`, dataAsJsonString);

		// compress with brotli if we can
		const bufferForCompression = Buffer.from(dataAsJsonString, "utf-8");
		zlib.brotliCompress(bufferForCompression, (err, compressedBuffer) => {
			if (err) {
				console.log(`Unable to compress the ${dataDescriptor} JSON using brotli.`);
				return;
			}

			scope.setExtra(`${dataDescriptor}Body with brotli compression in base64`, compressedBuffer.toString("base64"));
		});

		scope.setFingerprint([error instanceof Error ? error.message : error]);
		Sentry.captureException(error instanceof Error ? error : new Error(error));
	});
}
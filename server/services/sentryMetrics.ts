import * as Sentry from "@sentry/nuxt";
import { createHash } from "node:crypto";

export function reportCalculateMetric(requestData: object, success: boolean) {
	Sentry.withScope(scope => {
		scope.setAttribute("success", success);
		scope.setAttribute("requestHash", hashForData(requestData));

		Sentry.metrics.count("press_calculate");
	});
}

function hashForData(data: object): string {
	const shasum = createHash("sha1");
	shasum.update(JSON.stringify(data));

	return shasum.digest("hex");
}

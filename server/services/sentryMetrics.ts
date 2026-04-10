import * as Sentry from "@sentry/nuxt";

export function reportCalculateMetric(requestData: object, success: boolean) {
	Sentry.withScope(scope => {
		scope.setAttribute("success", success);
		scope.setAttribute("requestHash", hashForData(requestData));

		Sentry.metrics.count("press_calculate");
	});
}

// we'll just use the length of the stringified data to give a rough measure of whether the data is a duplicate, without needing to use crypto stuff for hashing
function hashForData(data: object): string {
	return btoa(JSON.stringify(data).length.toString());
}

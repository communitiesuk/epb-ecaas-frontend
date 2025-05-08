export default defineNuxtPlugin(() => {
	if (usesXRayInLambda()) {
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const { captureFetchGlobal } = require('aws-xray-sdk-fetch');
		globalThis.fetch = captureFetchGlobal();
	}
});

function usesXRayInLambda(): boolean {
	return !!process.env.AWS_LAMBDA_FUNCTION_NAME && !!process.env._X_AMZN_TRACE_ID;
}

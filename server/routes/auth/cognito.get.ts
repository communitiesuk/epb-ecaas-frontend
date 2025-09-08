import type { H3Error, H3Event } from "h3";
import parameterStore from "~/server/services/parameterStore";

export default defineEventHandler(async event => {
	const clientId = import.meta.dev ? process.env.NUXT_OAUTH_COGNITO_CLIENT_ID :
		(await parameterStore.getParameter("nuxt_oauth_cognito_client_id")).Parameter.Value;

	const clientSecret = import.meta.dev ? process.env.NUXT_OAUTH_COGNITO_CLIENT_SECRET :
		(await parameterStore.getParameter("nuxt_oauth_cognito_client_secret")).Parameter.Value;

	return defineOAuthCognitoEventHandler({
		config: {
			clientId,
			clientSecret,
			userPoolId: process.env.COGNITO_USER_POOL_ID,
			region: process.env.AWS_DEFAULT_REGION,
			scope: ["openid"]
		},
		async onSuccess(event: H3Event, { user }: { user: { id: unknown } }) {
			await setUserSession(event, {
				user: {
					id: user.id
				}
			});

			return sendRedirect(event, "/");
		},
		onError(_: H3Event, error: H3Error) {
			console.error("Cognito OAuth error:", error);

			throw createError({
				statusCode: 401,
				statusMessage: "Authentication error"
			});
		}
	})(event);
});
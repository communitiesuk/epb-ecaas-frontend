import type { H3Error, H3Event } from "h3";
import parameterStore from "~/server/services/parameterStore";

export default defineOAuthCognitoEventHandler({
	config: {
		clientId: import.meta.dev ? process.env.NUXT_OAUTH_COGNITO_CLIENT_ID :
			(await parameterStore.getParameter('nuxt_oauth_cognito_client_id')).Parameter.Value,

		clientSecret: import.meta.dev ? process.env.NUXT_OAUTH_COGNITO_CLIENT_SECRET :
			(await parameterStore.getParameter('nuxt_oauth_cognito_client_secret')).Parameter.Value,

		userPoolId: process.env.COGNITO_USER_POOL_ID,
		region: process.env.AWS_DEFAULT_REGION,
		scope: ['openid']
	},
	async onSuccess(event: H3Event, { user }: unknown) {
		await setUserSession(event, {
			user: {
				id: user.id
			}
		});

		return sendRedirect(event, '/');
	},
	onError(event: H3Event, error: H3Error) {
		console.error('Cognito OAuth error:', error);
		return sendRedirect(event, '/error');
	}
});
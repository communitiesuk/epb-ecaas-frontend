import ecaasApi from "./ecaasApi";
import parameterStore from "./parameterStore";

const session = () => {
	const get = async () => {
		// Get access token and expiry from session

		// Check if access token has expired

		// If access token has expired, create new session
		return create();

		// Otherwise return session data
	};

	const create = async () => {
		// Get client ID from environment variable
		const clientId = import.meta.dev ?
			process.env.CLIENT_ID :
			(await parameterStore.getParameter('client_id')).Parameters[0].Value;

		// Get client secret from environment variable
		const clientSecret = import.meta.dev ?
			process.env.CLIENT_SECRET :
			(await parameterStore.getParameter('client_secret')).Parameters[0].Value;

		// Authenticate with backend
		const tokenResponse = await ecaasApi.getToken(clientId!, clientSecret!);

		// Store token response in session

		// Return response
		return tokenResponse;
	};

	return { get };
};

export default session();
import dayjs from "dayjs";
import type { ClientSession } from "../server.types";
import ecaasApi from "./ecaasApi";
import parameterStore from "./parameterStore";

const clientSession = () => {
	const get = async () => {
		// Get client data from session
		const session = await useStorage().getItem<ClientSession>('client_session');

		// Create new session if client data doesn't exist or access token has expired
		if (!session || session.expires < new Date()) {
			return create();
		}

		// Otherwise return existing session data
		return session;
	};

	const create = async () => {
		// Get client ID from environment variable
		const clientId = import.meta.dev ?
			process.env.CLIENT_ID :
			(await parameterStore.getParameter('client_id')).Parameter.Value;

		// Get client secret from environment variable
		const clientSecret = import.meta.dev ?
			process.env.CLIENT_SECRET :
			(await parameterStore.getParameter('client_secret')).Parameter.Value;

		// Authenticate with backend
		const tokenResponse = await ecaasApi.getToken(clientId!, clientSecret!);

		// Store access token and expiry in session
		const sessionData: ClientSession = {
			accessToken: tokenResponse.access_token,
			expires: dayjs().add(tokenResponse.expires_in, 'second').toDate()
		};

		await useStorage().setItem('client_session', sessionData);

		// Return client session data
		return sessionData;
	};

	return { get };
};

export default clientSession();
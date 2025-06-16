export interface TokenResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
}

export interface ClientSession {
	accessToken: string;
	expires: Date;
}

export interface ParameterStoreResponse {
	Parameter: ParameterData;
}

export interface ParameterData {
	Name: string;
	Type: string;
	Value: string;
}

export interface ApiInfoResponse {
	links: {
		describedBy: string;
	};
	title: string;
	version: string;
}
export interface TokenResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
}

export interface ApiInfoResponse {
	links: {
		describedBy: string;
	};
	title: string;
	version: string;
}

export interface ParameterStoreResponse {
	Parameter: ParameterData;
}

export interface ParameterData {
	Name: string;
	Type: string;
	Value: string;
}
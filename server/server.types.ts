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
	Parameters: Array<SsmParameter>
}

export interface SsmParameter {
	Name: string;
	Type: string;
	Value: string;
}
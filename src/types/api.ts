// Requests
export type RegistrationRequest = {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
};

export type LoginCredentials = {
	email: string;
	password: string;
};

// Responses
export type NoContentResponse = object;

export type ApiErrorResponse = {
	message?: string;
	errors?: Record<string, string[]>;
};

// Resources
export type BearerTokenResource = {
	access_token: string;
	token_type: string;
};

export type User = {
	id: string;
	name: string;
	email: string;
};

export type Competition = {
	id: string;
	name: string;
	description: string;
	logo: string;
};

export type Settings = Record<string, unknown>;

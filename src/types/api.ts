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

export type CreateCompetitionRequest = {
	name: string;
	description: string;
	logo: FileList | null;
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

export type Link = {
	url: string | null;
	label: string;
	active: boolean;
};

export type PaginationLinks = {
	first: string;
	last: string;
	prev: string | null;
	next: string | null;
};

export type PaginationMeta = {
	current_page: number;
	from: number;
	last_page: number;
	per_page: number;
	to: number;
	total: number;
	path: string;
	links: Link[];
};

export type PaginatedData<T> = {
	data: T[];
	links: PaginationLinks;
	meta: PaginationMeta;
};

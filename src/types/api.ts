// Requests
export type LoginCredentials = {
    email: string;
    password: string;
};

// Responses
export type NoContentResponse = {};

export type LoginResponse = {
    access_token: string;
    token_type: string;
};

export type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

// Resources
export type User = {
    id: string;
    name: string;
    email: string;
};

export type Settings = Record<string, unknown>;
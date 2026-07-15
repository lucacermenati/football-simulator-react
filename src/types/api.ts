export type LoginCredentials = {
    email: string;
    password: string;
};

export type LoginResponse = {
    access_token: string;
    token_type: string;
};

export type User = {
    id: number;
    name: string;
    email: string;
};

export type Settings = Record<string, unknown>;

export type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};
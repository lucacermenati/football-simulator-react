import type { ApiErrorResponse } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL;

type ApiRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: unknown;
	token?: string | null;
	headers?: Record<string, string>;
};

export class ApiError extends Error {
	status: number;
	data: ApiErrorResponse | null;

	constructor(
		message: string,
		status: number,
		data: ApiErrorResponse | null = null,
	) {
		super(message);

		this.name = 'ApiError';
		this.status = status;
		this.data = data;
	}
}

export async function apiRequest<T>(
	path: string,
	options: ApiRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, token, headers = {} } = options;

	const response = await fetch(`${API_URL}${path}`, {
		method,
		headers: {
			Accept: 'application/json',

			...(body !== undefined
				? {
						'Content-Type': 'application/json',
					}
				: {}),

			...(token
				? {
						Authorization: `Bearer ${token}`,
					}
				: {}),

			...headers,
		},

		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	const contentType = response.headers.get('content-type');

	const hasJsonResponse = contentType?.includes('application/json');

	const data: unknown = hasJsonResponse ? await response.json() : null;

	if (response.status === 401) {
		window.dispatchEvent(new CustomEvent('auth:unauthorized'));
	}

	if (!response.ok) {
		const errorData = data as ApiErrorResponse | null;

		const message =
			errorData?.message ?? `Request failed with status ${response.status}.`;

		throw new ApiError(message, response.status, errorData);
	}

	return data as T;
}

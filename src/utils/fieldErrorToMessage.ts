import type { FieldError } from 'react-hook-form';

export const fieldErrorToMessage = (
	error: FieldError | undefined,
): string | string[] => {
	if (!error) return undefined;

	const server = error.types?.server;

	if (Array.isArray(server)) {
		return server;
	}

	if (typeof server === 'string') {
		return server;
	}

	return error.message;
};

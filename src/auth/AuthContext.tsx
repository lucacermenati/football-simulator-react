import {
	createContext,
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from 'react';
import type {
	LoginCredentials,
	BearerTokenResource,
	User,
	RegistrationRequest,
	NoContentResponse,
} from '../types/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '../api/apiClient';

const TOKEN_STORAGE_KEY = 'football-app-simulator-token';

export type AuthContextValue = {
	token: string | null;
	isAuthenticated: boolean;

	user?: User;
	isUserPending: boolean;
	isUserFailed: boolean;

	handleRegistration: (registrationData: RegistrationRequest) => void;
	isRegistrationPending: boolean;
	isRegistrationFailed: boolean;

	handleLogin: (credentials: LoginCredentials) => void;
	isLoginPending: boolean;
	isLoginFailed: boolean;

	handleLogout: () => void;
	isLogoutPending: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(() => {
		return localStorage.getItem(TOKEN_STORAGE_KEY);
	});

	const {
		mutateAsync: registerAsync,
		isPending: isRegistrationPending,
		isError: isRegistrationFailed,
	} = useMutation<BearerTokenResource, Error, RegistrationRequest>({
		mutationFn: (registrationData: RegistrationRequest) =>
			apiRequest<BearerTokenResource>('/api/register', {
				method: 'POST',
				body: registrationData,
			}),

		onSuccess: (data) => {
			const receivedToken = data.access_token;

			if (!receivedToken) {
				throw new Error('The backend did not return a token.');
			}

			localStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);

			setToken(receivedToken);
		},

		onError: (error) => {
			console.log(error);
			localStorage.removeItem(TOKEN_STORAGE_KEY);
			setToken(null);
		},
	});

	const handleRegistration = useCallback(
		async (registrationData: RegistrationRequest) => {
			await registerAsync(registrationData);
		},
		[registerAsync],
	);

	const {
		mutateAsync: loginAsync,
		isPending: isLoginPending,
		isError: isLoginFailed,
	} = useMutation<BearerTokenResource, Error, LoginCredentials>({
		mutationFn: (credentials: LoginCredentials) =>
			apiRequest<BearerTokenResource>('/api/token', {
				method: 'POST',
				body: credentials,
			}),

		onSuccess: (data) => {
			const receivedToken = data.access_token;

			if (!receivedToken) {
				throw new Error('The backend did not return a token.');
			}

			localStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);

			setToken(receivedToken);
		},

		onError: (error) => {
			console.log(error);
			localStorage.removeItem(TOKEN_STORAGE_KEY);
			setToken(null);
		},
	});

	const handleLogin = useCallback(
		async (credentials: LoginCredentials) => {
			await loginAsync(credentials);
		},
		[loginAsync],
	);

	const { mutateAsync: logoutAsync, isPending: isLogoutPending } = useMutation<
		NoContentResponse,
		Error,
		void
	>({
		mutationFn: () =>
			apiRequest<NoContentResponse>('/api/token', {
				method: 'DELETE',
			}),

		onSuccess: () => {
			localStorage.setItem(TOKEN_STORAGE_KEY, '');
			setToken(null);
		},

		onError: (error) => {
			console.log(error);
			localStorage.removeItem(TOKEN_STORAGE_KEY);
			setToken(null);
		},
	});

	const handleLogout = useCallback(async () => {
		await logoutAsync();
	}, [logoutAsync]);

	const userQuery = useQuery<User, Error>({
		queryKey: ['user', token],

		queryFn: () => apiRequest<User>('user', { token }),

		enabled: token !== null,
	});

	// useEffect(() => {
	// 	window.addEventListener('auth:unauthorized', logoutAsync);

	// 	return () => {
	// 		window.removeEventListener('auth:unauthorized', logoutAsync);
	// 	};
	// }, [logoutAsync]);

	const value = useMemo<AuthContextValue>(
		() => ({
			token,
			user: userQuery.data,
			isAuthenticated: token !== null,
			isUserPending: userQuery.isPending,
			isUserFailed: userQuery.isError,
			handleRegistration,
			isRegistrationPending,
			isRegistrationFailed,
			handleLogin,
			isLoginPending,
			isLoginFailed,
			handleLogout,
			isLogoutPending,
		}),
		[
			token,
			userQuery.data,
			userQuery.isPending,
			userQuery.isError,
			handleLogin,
			isLoginPending,
			isLoginFailed,
			handleRegistration,
			isRegistrationPending,
			isRegistrationFailed,
			handleLogout,
			isLogoutPending,
		],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

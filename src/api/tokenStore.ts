const TOKEN_STORAGE_KEY = 'football-app-simulator-token';

let token: string | null = localStorage.getItem(TOKEN_STORAGE_KEY);

export const tokenStore = {
	get: () => token,
	set: (newToken: string) => {
		token = newToken;
		localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
	},
	clear: () => {
		token = null;
		localStorage.removeItem(TOKEN_STORAGE_KEY);
	},
};

import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

const TOKEN_STORAGE_KEY = "football-app-simulator-token";

export type AuthContextValue = {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
};

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthContext =
    createContext<AuthContextValue | null>(null);

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    });

    const login = useCallback((newToken: string) => {
        localStorage.setItem(
            TOKEN_STORAGE_KEY,
            newToken,
        );

        setToken(newToken);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);

        setToken(null);
    }, []);

    useEffect(() => {
        window.addEventListener(
            "auth:unauthorized",
            logout,
        );

        return () => {
            window.removeEventListener(
                "auth:unauthorized",
                logout,
            );
        };
    }, [logout]);

    const value = useMemo<AuthContextValue>(
        () => ({
            token,
            isAuthenticated: token !== null,
            login,
            logout,
        }),
        [token, login, logout],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
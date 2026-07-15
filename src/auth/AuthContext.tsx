import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { User } from "../types/api";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../api/apiClient";

const TOKEN_STORAGE_KEY = "football-app-simulator-token";

export type AuthContextValue = {
    token: string | null;
    user?: User;
    isAuthenticated: boolean;
    isLoadingUser: boolean;
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

    const userQuery = useQuery<User, Error>({
        queryKey: ["user", token],

        queryFn: () =>
            apiRequest<User>("/api/user", {
                token,
            }),

        enabled: token !== null,
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
            user: userQuery.data,
            isAuthenticated: token !== null,
            isLoadingUser: userQuery.isPending,
            login,
            logout,
        }),
        [
            token,

            userQuery.data,
            userQuery.isPending,
            login,
            logout,
        ],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
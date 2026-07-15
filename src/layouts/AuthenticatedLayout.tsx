import {
    NavLink,
    Outlet,
    useNavigate,
} from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import { apiRequest } from "../api/apiClient";
import type { NoContentResponse } from "../types/api";
import styles from "./AuthenticatedLayout.module.scss";

export default function AuthenticatedLayout() {
    const { token, logout } = useAuth();

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    async function logoutRequest(): Promise<NoContentResponse> {
        return apiRequest<NoContentResponse>("/api/logout", {
            method: "DELETE",
            token: token
        });
    }

    const logoutMutation = useMutation({
        mutationFn: logoutRequest,

        onSuccess: () => {
            queryClient.clear();
            logout();

            navigate("/login", {
                replace: true,
            });
        },
    });

    async function handleLogout(): Promise<void> {
        await logoutMutation.mutateAsync();
    }

    return (
        <>
            <header className={styles.header}>
                <strong>Simple Auth App</strong>

                <nav className={styles.navigation}>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.link} ${styles.activeLink}`
                                : styles.link
                        }
                    >
                        Profile
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.link} ${styles.activeLink}`
                                : styles.link
                        }
                    >
                        Settings
                    </NavLink>

                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => handleLogout()}
                        disabled={logoutMutation.isPending}
                    >
                        Logout
                    </button>
                </nav>
            </header>

            <main className={styles.content}>
                <Outlet />
            </main>
        </>
    );
}
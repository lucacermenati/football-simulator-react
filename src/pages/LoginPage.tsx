import {
    Navigate,
    useLocation,
    useNavigate,
} from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { apiRequest } from "../api/apiClient";
import { useAuth } from "../auth/useAuth";
import type {
    LoginCredentials,
    LoginResponse,
} from "../types/api";
import styles from "./LoginPage.module.scss";

async function loginRequest(
    credentials: LoginCredentials,
): Promise<LoginResponse> {
    return apiRequest<LoginResponse>("/api/login", {
        method: "POST",
        body: credentials,
    });
}

export default function LoginPage() {
    const { isAuthenticated, login } = useAuth();

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<LoginCredentials>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const loginMutation = useMutation<
        LoginResponse,
        Error,
        LoginCredentials
    >({
        mutationFn: loginRequest,

        onSuccess: (data) => {
            const receivedToken =
                data.token ?? data.access_token;

            if (!receivedToken) {
                throw new Error(
                    "The backend did not return a token.",
                );
            }

            login(receivedToken);
        },
    });

    async function onSubmit(
        credentials: LoginCredentials,
    ): Promise<void> {
        await loginMutation.mutateAsync(credentials);
    }

    if (isAuthenticated) {
        return <Navigate to="/profile" replace />;
    }

    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <h1>Login</h1>

                <form
                    className={styles.form}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <label className={styles.field}>
                        Email

                        <input
                            type="email"
                            className={styles.input}
                            autoComplete="email"
                            {...register("email", {
                                required:
                                    "Email is required.",

                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message:
                                        "Enter a valid email address.",
                                },

                                onChange: (event) => {
                                    console.log(
                                        "Email field changed.",
                                        event.target.value
                                    );
                                },
                            })}
                        />

                        {errors.email && (
                            <p className={styles.fieldError}>
                                {errors.email.message}
                            </p>
                        )}
                    </label>

                    <label className={styles.field}>
                        Password

                        <input
                            type="password"
                            className={styles.input}
                            autoComplete="current-password"
                            {...register("password", {
                                required:
                                    "Password is required.",

                                minLength: {
                                    value: 6,
                                    message:
                                        "Password must contain at least 6 characters.",
                                },
                            })}
                        />

                        {errors.password && (
                            <p className={styles.fieldError}>
                                {errors.password.message}
                            </p>
                        )}
                    </label>

                    {loginMutation.isError && (
                        <div
                            className={styles.error}
                            role="alert"
                        >
                            {loginMutation.error.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={
                            isSubmitting ||
                            loginMutation.isPending
                        }
                    >
                        {loginMutation.isPending
                            ? "Logging in..."
                            : "Login"}
                    </button>
                </form>
            </section>
        </main>
    );
}
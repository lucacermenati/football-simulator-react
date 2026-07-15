import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../api/apiClient";
import { useAuth } from "../auth/useAuth";
import type { User } from "../types/api";
import styles from "./JsonPage.module.scss";

export default function ProfilePage() {
    const { token } = useAuth();

    const userQuery = useQuery<User, Error>({
        queryKey: ["user", token],

        queryFn: () =>
            apiRequest<User>("/api/user", {
                token,
            }),

        enabled: token !== null,
    });

    return (
        <section className={styles.card}>
            <h1 className={styles.heading}>
                Profile
            </h1>

            {userQuery.isPending && (
                <span className={styles.loader} aria-label="Loading" />
            )}

            {userQuery.data && <pre className={styles.json}>
                {JSON.stringify(
                    userQuery.data,
                    null,
                    2,
                )}
            </pre>}

            {userQuery.isError && (
                <p className={styles.error}>
                    {userQuery.error.message}
                </p>
            )}
        </section>
    );
}
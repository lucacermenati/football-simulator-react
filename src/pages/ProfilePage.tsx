import { useAuth } from "../auth/useAuth";
import styles from "./JsonPage.module.scss";

export default function ProfilePage() {
    const { user, isLoadingUser } = useAuth();

    return (
        <section className={styles.card}>
            <h1 className={styles.heading}>
                Profile
            </h1>

            {isLoadingUser && (
                <span className={styles.loader} aria-label="Loading" />
            )}

            {user && <pre className={styles.json}>
                {JSON.stringify(
                    user,
                    null,
                    2,
                )}
            </pre>}

            {!user && (
                <p className={styles.error}>
                    Something went wrong while fetching the user data. Please try again later.
                </p>
            )}
        </section>
    );
}
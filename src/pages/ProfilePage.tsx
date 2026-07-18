import { useAuth } from '../auth/useAuth';
import styles from './JsonPage.module.scss';

export default function ProfilePage() {
	const { user, isUserPending, isUserFailed } = useAuth();

	const content = isUserPending ? (
		<span className={styles.loader} aria-label='Loading' />
	) : isUserFailed ? (
		<p className={styles.error}>
			Something went wrong while fetching the user data. Please try again later.
		</p>
	) : user ? (
		<pre className={styles.json}>{JSON.stringify(user, null, 2)}</pre>
	) : null;

	return (
		<section className={styles.card}>
			<h1 className={styles.heading}>Profile</h1>
			{content}
		</section>
	);
}

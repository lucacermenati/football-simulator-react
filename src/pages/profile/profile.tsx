import { useAuth } from '../../auth/useAuth';
import Loader from '../../components/loader/loader';
import styles from './profile.module.scss';

export default function Profile() {
	const { user, isUserPending, isUserFailed } = useAuth();

	const content = isUserPending ? (
		<Loader />
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

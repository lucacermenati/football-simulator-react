import { Link } from 'react-router';
import styles from './NotFoundPage.module.scss';

export default function NotFoundPage() {
	return (
		<main className={styles.page}>
			<section className={styles.content}>
				<p className={styles.code}>404</p>

				<h1>Page not found</h1>

				<p>The page you are looking for does not exist.</p>

				<Link to='/profile' className={styles.link}>
					Go to homepage
				</Link>
			</section>
		</main>
	);
}

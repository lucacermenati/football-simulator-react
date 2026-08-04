import { Link } from 'react-router';
import styles from './not-available.module.scss';

export default function NotAvailable() {
	return (
		<main className={styles.page}>
			<section className={styles.content}>
				<p className={styles.code}>404</p>

				<h1>Page not available</h1>

				<p>
					The page you are looking for is not available yet. Luca is working
					hard to bring it to you soon.
				</p>

				<Link to='/profile' className={styles.link}>
					Go to homepage
				</Link>
			</section>
		</main>
	);
}

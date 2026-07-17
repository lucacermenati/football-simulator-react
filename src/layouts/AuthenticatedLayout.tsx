import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../auth/useAuth';
import styles from './AuthenticatedLayout.module.scss';

export default function AuthenticatedLayout() {
	const { handleLogout, isLogoutPending } = useAuth();

	return (
		<>
			<header className={styles.header}>
				<strong>Simple Auth App</strong>

				<nav className={styles.navigation}>
					<NavLink
						to='/profile'
						className={({ isActive }) =>
							isActive ? `${styles.link} ${styles.activeLink}` : styles.link
						}
					>
						Profile
					</NavLink>

					<NavLink
						to='/settings'
						className={({ isActive }) =>
							isActive ? `${styles.link} ${styles.activeLink}` : styles.link
						}
					>
						Settings
					</NavLink>

					<button
						type='button'
						className={styles.button}
						onClick={() => handleLogout()}
						disabled={isLogoutPending}
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

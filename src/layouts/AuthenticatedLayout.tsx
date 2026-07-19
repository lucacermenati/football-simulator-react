import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth';
import styles from './AuthenticatedLayout.module.scss';
import { LogOut, ShieldHalf, Trophy, UserCircle, Users } from 'lucide-react';

export default function AuthenticatedLayout() {
	const { handleLogout, isLogoutPending } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const logout = () => {
		if (isLogoutPending) return;

		handleLogout();
	};

	return (
		<section className={styles.layout}>
			<aside className={styles.sidebar}>
				<div className={styles.iconsContainer}>
					<Trophy
						className={
							location.pathname === '/competitions'
								? styles.activeIcon
								: styles.icon
						}
						onClick={() => navigate('/competitions')}
					/>
					<ShieldHalf
						className={
							location.pathname === '/teams' ? styles.activeIcon : styles.icon
						}
						onClick={() => navigate('/teams')}
					/>
					<Users
						className={
							location.pathname === '/players' ? styles.activeIcon : styles.icon
						}
						onClick={() => navigate('/players')}
					/>
				</div>
				<div className={styles.iconsContainer}>
					<UserCircle
						className={
							location.pathname === '/profile' ? styles.activeIcon : styles.icon
						}
						onClick={() => navigate('/profile')}
					/>
					<LogOut
						className={
							location.pathname === '/logout' ? styles.activeIcon : styles.icon
						}
						onClick={() => logout()}
					/>
				</div>
			</aside>

			<main className={styles.main}>
				<Outlet />
			</main>
		</section>
	);
}

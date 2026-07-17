import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth';
import styles from './AuthenticatedLayout.module.scss';
import { LogOut, ShieldHalf, Trophy, UserCircle, Users } from 'lucide-react';

export default function AuthenticatedLayout() {
	const { handleLogout, isLogoutPending } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	console.log(location);

	const logout = () => {
		if (isLogoutPending) return;

		handleLogout();
	};

	return (
		<section className={styles.container}>
			<div className={styles.verticalMenu}>
				<div>
					<div className={styles.linksContainer}>
						<Trophy
							className={
								location.pathname === '/competitions'
									? styles.activeLink
									: styles.link
							}
							onClick={() => navigate('/competitions')}
						/>
						<ShieldHalf
							className={
								location.pathname === '/teams' ? styles.activeLink : styles.link
							}
							onClick={() => navigate('/teams')}
						/>
						<Users
							className={
								location.pathname === '/players'
									? styles.activeLink
									: styles.link
							}
							onClick={() => navigate('/players')}
						/>
					</div>
				</div>

				<div className={styles.linksContainer}>
					<UserCircle
						className={
							location.pathname === '/profile' ? styles.activeLink : styles.link
						}
						onClick={() => navigate('/profile')}
					/>
					<LogOut
						className={
							location.pathname === '/logout' ? styles.activeLink : styles.link
						}
						onClick={() => logout()}
					/>
				</div>
			</div>

			<main className={styles.content}>
				<Outlet />
			</main>
		</section>
	);
}

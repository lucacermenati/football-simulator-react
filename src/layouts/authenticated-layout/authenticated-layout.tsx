import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import styles from './authenticated-layout.module.scss';
import { LogOut, ShieldHalf, Trophy, UserCircle, Users } from 'lucide-react';
import MenuItem from '../../components/menu-item/menu-item';

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
					<MenuItem
						isActive={location.pathname.startsWith('/competitions')}
						onClick={() => navigate('/competitions')}
					>
						<Trophy />
					</MenuItem>
					<MenuItem
						isActive={location.pathname === '/teams'}
						onClick={() => navigate('/teams')}
					>
						<ShieldHalf />
					</MenuItem>
					<MenuItem
						isActive={location.pathname === '/players'}
						onClick={() => navigate('/players')}
					>
						<Users />
					</MenuItem>
				</div>
				<div className={styles.iconsContainer}>
					<MenuItem
						isActive={location.pathname === '/profile'}
						onClick={() => navigate('/profile')}
					>
						<UserCircle />
					</MenuItem>
					<MenuItem isActive={false} onClick={logout}>
						<LogOut />
					</MenuItem>
				</div>
			</aside>

			<main className={styles.main}>
				<Outlet />
			</main>
		</section>
	);
}

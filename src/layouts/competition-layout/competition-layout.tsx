import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';
import type { Competition } from '../../types/api';
import { useAuth } from '../../auth/useAuth';
import { NavLink, Outlet, useParams } from 'react-router';
import styles from './competition-layout.module.scss';
import clsx from 'clsx';
import { Edit, Trash } from 'lucide-react';

export default function CompetitionLayout() {
	const { competitionId } = useParams();
	const { isAuthenticated } = useAuth();

	const competitionQuery = useQuery({
		queryKey: ['competition', competitionId],
		queryFn: () => apiRequest<Competition>(`competitions/${competitionId}`),
		enabled: isAuthenticated && !!competitionId,
	});

	const competition = competitionQuery.data;

	if (competitionQuery.isPending) {
		return <div>Loading...</div>;
	}

	if (!competitionQuery.isPending && !competition) {
		return <div>Competition not found</div>;
	}

	return (
		<section className={styles.competitionHome}>
			<div className={styles.header}>
				<div className={styles.leftHeader}>
					<div className={styles.logoContainer}>
						<img
							src={competition.logo}
							alt={competition.name}
							className={styles.competitionLogo}
						/>
					</div>
					<div className={styles.menuContainer}>
						<div className={styles.competitionName}>{competition.name}</div>
						<div className={styles.menu}>
							<NavLink
								to={`/competitions/${competitionId}`}
								className={({ isActive }) =>
									clsx(styles.menuItem, isActive && styles.activeMenuItem)
								}
							>
								History
							</NavLink>
							<NavLink
								to={`/competitions/${competitionId}/standings`}
								className={({ isActive }) =>
									clsx(styles.menuItem, isActive && styles.activeMenuItem)
								}
							>
								Standings
							</NavLink>
							<NavLink
								to={`/competitions/${competitionId}/statistics`}
								className={({ isActive }) =>
									clsx(styles.menuItem, isActive && styles.activeMenuItem)
								}
							>
								Statistics
							</NavLink>
							<NavLink
								to={`/competitions/${competitionId}/matches`}
								className={({ isActive }) =>
									clsx(styles.menuItem, isActive && styles.activeMenuItem)
								}
							>
								Matches
							</NavLink>
							<NavLink
								to={`/competitions/${competitionId}/teams`}
								className={({ isActive }) =>
									clsx(styles.menuItem, isActive && styles.activeMenuItem)
								}
							>
								Teams
							</NavLink>
						</div>
					</div>
				</div>
				<div className={styles.rightHeader}>
					<Edit />
					<Trash />
				</div>
			</div>
			<main className={styles.content}>
				<Outlet context={{ competition }} />
			</main>
		</section>
	);
}

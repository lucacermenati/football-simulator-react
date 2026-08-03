import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';
import type { Competition } from '../../types/api';
import { useAuth } from '../../auth/useAuth';
import { useParams } from 'react-router';
import styles from './competition-home.module.scss';
import clsx from 'clsx';
import {
	Delete,
	Edit,
	ListSortDescending,
	Podium,
	ScrollText,
	Shield,
	ShieldHalf,
	Trash,
	Volleyball,
} from 'lucide-react';

export default function CompetitionHome() {
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
							<nav className={clsx(styles.menuItem, styles.activeMenuItem)}>
								History
							</nav>
							<nav className={styles.menuItem}>Standings</nav>
							<nav className={styles.menuItem}>Statistics</nav>
							<nav className={styles.menuItem}>Matches</nav>
							<nav className={styles.menuItem}>Teams</nav>
						</div>
					</div>
				</div>
				<div className={styles.rightHeader}>
					<Edit />
					<Trash />
				</div>
			</div>
			<div>Content</div>
		</section>
	);
}

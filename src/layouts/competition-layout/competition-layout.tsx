import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';
import type { Competition } from '../../types/api';
import { useAuth } from '../../auth/useAuth';
import { NavLink, Outlet, useParams } from 'react-router';
import styles from './competition-layout.module.scss';
import clsx from 'clsx';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import CompetitionDelete from './components/competition-delete/competition-delete';
import CompetitionEdit from './components/competition-edit/competition-edit';
import ImageBox from '../../components/image-box/image-box';
import Loader from '../../components/loader/loader';
import ErrorText from '../../components/form/error-text/error-text';

export default function CompetitionLayout() {
	const { competitionId } = useParams();
	const { isAuthenticated } = useAuth();

	const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

	const {
		data: competition,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ['competitions', competitionId],
		queryFn: () => apiRequest<Competition>(`competitions/${competitionId}`),
		enabled: isAuthenticated && !!competitionId,
	});

	if (isPending) {
		return <Loader />;
	}

	if (isError) {
		return (
			<ErrorText>
				{error?.message || 'Something went wrong. Please try again.'}
			</ErrorText>
		);
	}

	return (
		<section className={styles.competitionHome}>
			<div className={styles.header}>
				<div className={styles.leftHeader}>
					<ImageBox
						src={competition.logo}
						alt={competition.name}
						className={styles.boxLogoSize}
					/>
					<div className={styles.menuContainer}>
						<div className={styles.competitionName}>{competition.name}</div>
						<div className={styles.menu}>
							<NavLink
								to={`/competitions/${competitionId}`}
								end
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
					<Edit
						className={styles.actionIcon}
						onClick={() => setIsEditOpen(true)}
					/>
					<Trash
						className={styles.destructiveActionIcon}
						onClick={() => setIsDeleteOpen(true)}
					/>
				</div>
			</div>
			<main className={styles.content}>
				<Outlet context={{ competition }} />
			</main>
			{isEditOpen && (
				<CompetitionEdit
					competition={competition}
					onCancel={() => setIsEditOpen(false)}
				/>
			)}
			{isDeleteOpen && (
				<CompetitionDelete
					competition={competition}
					onCancel={() => setIsDeleteOpen(false)}
				/>
			)}
		</section>
	);
}

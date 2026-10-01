import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';
import type { NoContentResponse, Team } from '../../types/api';
import { useAuth } from '../../auth/useAuth';
import { NavLink, Outlet, useParams } from 'react-router';
import styles from './team-layout.module.scss';
import clsx from 'clsx';
import { Edit, Trash, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import ImageBox from '../../components/image-box/image-box';
import Loader from '../../components/loader/loader';
import ErrorText from '../../components/form/error-text/error-text';

import TeamLogoUpload from './components/team-logo-upload/team-logo-upload';

export default function TeamLayout() {
	const { teamId } = useParams();
	const { isAuthenticated } = useAuth();

	const queryClient = useQueryClient();

	const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
	const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

	const {
		data: team,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ['teams', teamId],
		queryFn: () => apiRequest<Team>(`teams/${teamId}`), // TODO: use a proper type>(`teams/${teamId}`),
		enabled: isAuthenticated && !!teamId,
	});

	const { mutate: removeLogoMutation, isPending: isRemovingLogo } =
		useMutation<NoContentResponse>({
			mutationFn: () =>
				apiRequest<NoContentResponse>(`teams/${teamId}/logo`, {
					method: 'DELETE',
				}),
			onSuccess: async () => {
				await queryClient.invalidateQueries(['teams', teamId]);
			},
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
		<section className={styles.teamHome}>
			<div className={styles.header}>
				<div className={styles.leftHeader}>
					<div className={styles.logoContainer}>
						<ImageBox
							src={team.logo}
							alt={team.name}
							className={styles.boxLogoSize}
						/>
						<div className={styles.logoActions}>
							<button
								className={styles.logoActionTop}
								disabled={isRemovingLogo || isUploadOpen}
								onClick={() => setIsUploadOpen(true)}
							>
								<UploadCloud />
							</button>
							<button
								className={styles.logoActionBottom}
								disabled={isRemovingLogo || isUploadOpen || !team.logo}
								onClick={() => removeLogoMutation()}
							>
								<Trash />
							</button>
						</div>
					</div>
					<div className={styles.menuContainer}>
						<div className={styles.teamName}>{team.name}</div>
						<div className={styles.menu}>
							<NavLink
								to={`/teams/${teamId}`}
								end
								className={({ isActive }) =>
									clsx(styles.menuItem, isActive && styles.activeMenuItem)
								}
							>
								Profile
							</NavLink>
							<NavLink
								to={`/teams/${teamId}/players`}
								className={({ isActive }) =>
									clsx(styles.menuItem, isActive && styles.activeMenuItem)
								}
							>
								Players
							</NavLink>
							<NavLink
								to={`/teams/${teamId}/on-the-field`}
								className={({ isActive }) =>
									clsx(styles.menuItem, isActive && styles.activeMenuItem)
								}
							>
								On the field
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
				<Outlet context={{ team }} />
			</main>
			{/* {isEditOpen && (
				<TeamEdit
					team={team}
					onCancel={() => setIsEditOpen(false)}
				/>
			)}
			{isDeleteOpen && (
				<TeamDelete
					team={team}
					onCancel={() => setIsDeleteOpen(false)}
				/>
			)}
			{isUploadOpen && (
				<TeamLogoUpload
					team={team}
					onCancel={() => setIsUploadOpen(false)}
				/>
			)} */}
		</section>
	);
}

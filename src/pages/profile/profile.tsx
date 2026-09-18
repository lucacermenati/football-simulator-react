import { ArrowRight, Edit } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import ErrorText from '../../components/form/error-text/error-text';
import Loader from '../../components/loader/loader';
import styles from './profile.module.scss';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';
import type { PaginatedData, ReadyCompetition } from '../../types/api';
import ImageBox from '../../components/image-box/image-box';
import { useNavigate } from 'react-router';

export default function Profile() {
	const { user, isUserPending, isUserFailed } = useAuth();
	const navigate = useNavigate();

	const { 
		data: readyCompetitionsPaginated, 
		isPending: isReadyCompetitionsPending, 
		isError: isReadyCompetitionsFailed, 
		error: readyCompetitionsError
	} = useQuery({
		queryKey: ['upcomingMatches'],
		queryFn: async () => apiRequest<PaginatedData<ReadyCompetition>>('user/next-to-play')
	});

	const content = isUserPending ? (
		<Loader />
	) : isUserFailed ? (
		<ErrorText>An error occurred while fetching your profile information. Please try again later.</ErrorText>
	) : user ? (
		<div className={styles.profileInfo}>
			<div className={styles.header}>
				<div className={styles.salutation}>Welcome back, {user?.name}</div>
				<Edit className={styles.icon} />
			</div>
			<p>
				<strong>Name:</strong> {user.name}
			</p>
			<p>
				<strong>Email:</strong> {user.email}
			</p>
			<div className={styles.upcomingMatchesContainer}>
				<div>Next to play</div>
				{isReadyCompetitionsPending ? (
					<Loader />
				) : isReadyCompetitionsFailed ? (
					<ErrorText>
						{readyCompetitionsError?.message ?? 'Something went wrong. Please try again.'}
					</ErrorText>
				) : readyCompetitionsPaginated?.data.length === 0 ? (
					<ErrorText>No upcoming matches found.</ErrorText>
				) : (
					<ul>
						{readyCompetitionsPaginated?.data.map((competition) => (
							<li key={competition.id} className={styles.readyToPlayItem}>
								<ImageBox
									src={competition.logo}
									alt={competition.name}
									className={styles.boxLogoSize}
								/>
								<div>{competition.name}</div>
								<div>{new Date(competition.next_match_date).toLocaleDateString()}</div>
								<ArrowRight className={styles.icon} onClick={() => (navigate(`/competitions/${competition.id}/matches`))}/>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	) : null;

	return (
		<section className={styles.card}>
			<div>{content}</div>
		</section>
	);
}

import { Edit } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import ErrorText from '../../components/form/error-text/error-text';
import Loader from '../../components/loader/loader';
import styles from './profile.module.scss';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';
import type { PaginatedData, ReadyCompetition } from '../../types/api';

export default function Profile() {
	const { user, isUserPending, isUserFailed } = useAuth();

	const { 
		data: upcomingMatchesPaginated, 
		isPending: isUpcomingMatchesPending, 
		isError: isUpcomingMatchesFailed, 
		error: upcomingMatchesError
	} = useQuery({
		queryKey: ['upcomingMatches'],
		queryFn: async () => apiRequest<PaginatedData<ReadyCompetition>>('user/next-to-play', {
			
		})
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
				{isUpcomingMatchesPending ? (
					<Loader />
				) : isUpcomingMatchesFailed ? (
					<ErrorText>
						{upcomingMatchesError?.message ?? 'Something went wrong. Please try again.'}
					</ErrorText>
				) : upcomingMatchesPaginated?.data.length === 0 ? (
					<ErrorText>No upcoming matches found.</ErrorText>
				) : (
					<ul>
						{upcomingMatchesPaginated?.data.map((match) => (
							<li key={match.id}>
								{match.name} - {match.next_match_date}
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

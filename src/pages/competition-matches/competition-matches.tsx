import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';
import { useCompetition } from '../../hooks/useCompetition';
import { useAuth } from '../../auth/useAuth';
import type { Match, PaginatedData } from '../../types/api';
import style from './competition-matches.module.scss';
import MatchCard from './components/match-card';
import { FastForward, SkipForward } from 'lucide-react';
import Loader from '../../components/loader/loader';
import ErrorText from '../../components/form/error-text/error-text';

export default function CompetitionMatches() {
	const { competition } = useCompetition();
	const { isAuthenticated } = useAuth();

	const {
		data: paginatedMatches,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ['competitions', competition.id, 'matches'],
		queryFn: () =>
			apiRequest<PaginatedData<Match>>(
				`competitions/${competition.id}/matches`,
			),
		enabled: isAuthenticated && !!competition.id,
	});

	return (
		<section>
			<div className={style.actionContainer}>
				<SkipForward className={style.icon} />
				<FastForward className={style.icon} />
			</div>
			<div className={style.matchesGrid}>
				{paginatedMatches?.data.map((match) => (
					<MatchCard key={match.id} match={match} />
				))}
				{isPending && <Loader />}
				{isError && <ErrorText>{error?.message ?? 'Something went wrong. Please try again.'}</ErrorText>}
			</div>
		</section>
	);
}

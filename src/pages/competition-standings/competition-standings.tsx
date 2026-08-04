import { useCompetition } from '../../hooks/useCompetition';
import style from './competition-standings.module.scss';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';
import type { Standings } from '../../types/api';
import { useAuth } from '../../auth/useAuth';

export default function CompetitionStandings() {
	const { competition } = useCompetition();
	const { isAuthenticated } = useAuth();

	const standingsQuery = useQuery({
		queryKey: ['competitions', 'standings', competition.id],
		queryFn: () =>
			apiRequest<Standings>(`competitions/${competition.id}/standings`),
		enabled: isAuthenticated && !!competition.id,
	});

	const standings = standingsQuery.data || [];

	return (
		<section className={style.content}>{JSON.stringify(standings)}</section>
	);
}

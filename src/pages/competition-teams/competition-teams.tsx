import { useQuery } from '@tanstack/react-query';
import { useCompetition } from '../../hooks/useCompetition';
import style from './competition-teams.module.scss';
import { apiRequest } from '../../api/apiClient';
import type { Team } from '../../types/api';
import { useAuth } from '../../auth/useAuth';

export default function CompetitionTeams() {
	const { competition } = useCompetition();
	const { isAuthenticated } = useAuth();

	const {
		data: teams,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ['competitions', competition?.id, 'teams'],
		queryFn: () => apiRequest<Team[]>(`competitions/${competition?.id}/teams`),
		enabled: isAuthenticated && !!competition?.id,
	});

	return <div className={style.container}>{JSON.stringify(teams)}</div>;
}

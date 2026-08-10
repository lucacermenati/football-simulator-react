import { useQuery } from '@tanstack/react-query';
import style from './competition-statistics.module.scss';
import { useCompetition } from '../../hooks/useCompetition';
import { useAuth } from '../../auth/useAuth';
import { apiRequest } from '../../api/apiClient';
import type { PlayerStatistic, Statistics } from '../../types/api';
export default function CompetitionStatistics() {
    const { competition } = useCompetition();
    const { isAuthenticated } = useAuth();

    const { data: statistics, isError, isPending } = useQuery({
        queryKey: ['competitions', competition.id, 'statistics'],
        queryFn: () => apiRequest<Statistics>(`competitions/${competition.id}/statistics`),
        enabled: isAuthenticated && !!competition.id
    });

    return (
        <section className={style.content}>
            <div className={style.statisticTable}>
                <div className={style.statisticHeaderRow}>
                    <div>Player</div>
                    <div>Team</div>
                    <div className={style.goalColumn}>Goals</div>
                </div>
                {statistics?.map((player: PlayerStatistic) => (
                    <div key={player.id} className={style.statisticRow}>
                        <div>{player.full_name}</div>
                        <div>{player.team.name}</div>
                        <div className={style.goalColumn}>{player.goals}</div>
                    </div>
                ))}
        </div>
    </section>
  );
}
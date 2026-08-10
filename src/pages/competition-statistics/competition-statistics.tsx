import { useQuery } from '@tanstack/react-query';
import style from './competition-statistics.module.scss';
import { useCompetition } from '../../hooks/useCompetition';
import { useAuth } from '../../auth/useAuth';
import { apiRequest } from '../../api/apiClient';
import type { PlayerStatistic, Statistics } from '../../types/api';
import ImageBox from '../../components/image-box/image-box';
import PositionBadge from '../../components/position-badge/position-badge';
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
                        <div className={style.playerNameColumn}>
                            <PositionBadge position={player.position} className={style.positionBadgeSize} />
                            <div>{player.full_name}</div>
                        </div>
                        <div className={style.teamNameColumn}>
                            <ImageBox className={style.imageBoxSize} src={player.team.logo} alt={player.team.name} />
                            <div>{player.team.name}</div>
                        </div>
                        <div className={style.goalColumn}>{player.goals}</div>
                    </div>
                ))}
        </div>
    </section>
  );
}
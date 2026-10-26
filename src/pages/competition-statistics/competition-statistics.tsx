import { useQuery } from '@tanstack/react-query';
import style from './competition-statistics.module.scss';
import { useCompetition } from '../../hooks/useCompetition';
import { useAuth } from '../../auth/useAuth';
import { apiRequest } from '../../api/apiClient';
import type { PlayerStatistic, Statistics } from '../../types/api';
import TeamLogo from '../../components/team-logo/team-logo';
import PositionBadge from '../../components/position-badge/position-badge';
import { useNavigate } from 'react-router';
import Card from '../../components/card/card';
import Loader from '../../components/loader/loader';
import ErrorText from '../../components/form/error-text/error-text';

export default function CompetitionStatistics() {
    const { competition } = useCompetition();
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();

    const { data: statistics, isError, error, isPending } = useQuery({
        queryKey: ['competitions', competition.id, 'statistics'],
        queryFn: () => apiRequest<Statistics>(`competitions/${competition.id}/statistics`),
        enabled: isAuthenticated && !!competition.id
    });

    return (
        <Card>
            <div className={style.statisticTable}>
                <div className={style.statisticHeaderRow}>
                    <div>Player</div>
                    <div>Team</div>
                    <div className={style.goalColumn}>Goals</div>
                </div>
                {isPending && (
                    <div className={style.statusRow}>
                        <Loader />
                    </div>
                )}
                {isError && (
                    <div className={style.statusRow}>
                        <ErrorText>{error?.message}</ErrorText>
                    </div>
                )}
                {statistics?.map((player: PlayerStatistic) => (
                    <div key={player.id} className={style.statisticRow}>
                        <div className={style.playerNameColumn}>
                            <PositionBadge position={player.position} className={style.positionBadgeSize} />
                            <div
                                className={style.playerName}
                                onClick={() => navigate(`/players/${player.id}`)}
                            >
                                {player.full_name}
                            </div>
                        </div>
                        <div className={style.teamNameColumn}>
                            <TeamLogo team={player.team} size="sm" />
                            <div>{player.team.name}</div>
                        </div>
                        <div className={style.goalColumn}>{player.goals}</div>
                    </div>
                ))}
        </div>
    </Card>
  );
}
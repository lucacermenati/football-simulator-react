import { useNavigate, useParams } from "react-router";
import style from "./match.module.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, apiRequest } from "../../api/apiClient";
import { useAuth } from "../../auth/useAuth";
import type { Match, NoContentResponse } from "../../types/api";
import Loader from "../../components/loader/loader";
import ErrorText from "../../components/form/error-text/error-text";
import { ArrowLeft, Lock, Play, Volleyball } from "lucide-react";
import clsx from "clsx";
import ImageBox from "../../components/image-box/image-box";
import { Fragment } from "react/jsx-runtime";

export default function Match() {
    const { competitionId, matchId } = useParams();
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
		data: match,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ['competitions', competitionId, 'matches', matchId],
		queryFn: () => apiRequest<Match>(`competitions/${competitionId}/matches/${matchId}`),
		enabled: isAuthenticated && !!matchId && !!competitionId,
	});

    const matchDate = new Date(match?.date);

    const { mutateAsync: playMatchAsync } = useMutation<
		NoContentResponse,
		ApiError,
		string
	>({
		mutationFn: (matchId) =>
			apiRequest<NoContentResponse>(`competitions/${competitionId}/matches/play?match_id=${matchId}`, {
				method: 'POST',
			}),

			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: ['competitions', competitionId, 'matches', matchId],
				});
			},

			onError: (error) => {
				console.error('Error playing match:', error);
			}
	});

    return <section>
            {match && <div className={style.actionBox}>
                <ArrowLeft className={style.icon} onClick={() => navigate(`/competitions/${competitionId}/matches?day=${match.day}`)} />
                <span>Back to match day {match.day}</span>
            </div>}
            <div className={style.content}>
                {isPending ? <Loader /> : (
                    isError ? <ErrorText>{error?.message ?? 'Something went wrong. Try again later.'}</ErrorText>
                        : <div>
                            <div className={style.matchHeader}>
                                <div className={clsx(style.teamNameBox, style.homeBox)}>
                                    <ImageBox
                                        src={match.home_team.logo}
                                        alt={match.home_team.name}
                                        className={style.imageBoxSize}
                                    />
                                    <div>{match.home_team.name}</div>
                                </div>
                                <div className={style.scoreBox}>
                                    <span>{match.goal_home}</span>
                                    <span>-</span>
                                    <span>{match.goal_away}</span>
                                </div>
                                <div className={clsx(style.teamNameBox, style.awayBox)}>
                                    <div>{match.away_team.name}</div>
                                    <ImageBox
                                        src={match.away_team.logo}
                                        alt={match.away_team.name}
                                        className={style.imageBoxSize}
                                    />
                                </div>
                            </div>
                            <div className={style.matchInfo}>
                                <div>{new Date(match.date).toLocaleDateString()}</div>
                                <div>{match.home_team.stadium}</div>
                            </div>
                            <div className={style.verticalDivider}>
                                {match.played ?
                                    (<div className={style.matchEvents}>
                                        {match.scorers.map((event) => {
                                            const player = event.player;
                                            const minute = event.minute;
                                            const isHomeEvent = player.team_id === match.home_team.id;

                                            return <Fragment key={player.id + minute}>
                                                <div className={clsx(style.event, style.homeEvent)}>
                                                    {isHomeEvent && (
                                                        <>
                                                            <Volleyball />
                                                            <span>
                                                                {player.first_name}{" "}
                                                                {player.last_name}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                <span className={style.displayMinute}>
                                                    {minute}'
                                                </span>

                                                <div className={clsx(style.event, style.awayEvent)}>
                                                    {!isHomeEvent && (
                                                        <>
                                                            <span>
                                                                {player.first_name}{" "}
                                                                {player.last_name}
                                                            </span>
                                                            <Volleyball />
                                                        </>
                                                    )}
                                                </div>
                                            </Fragment>
                                        })}
                                    </div>)
                                    : <div className={style.notPlayed}>
                                        { new Date() >= matchDate 
                                            ? <Play className={style.icon} onClick={async () => {await playMatchAsync(matchId)}}/>
                                            : <div className={style.lockBox}>
                                                <Lock className={style.lockIcon} />
                                                <span>{matchDate.toLocaleDateString()}</span>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                )}
            </div>
    </section>
}
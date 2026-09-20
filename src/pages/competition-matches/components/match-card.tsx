import { Eye, Lock, Play } from 'lucide-react';
import type { Match, NoContentResponse } from '../../../types/api';
import style from './match-card.module.scss';
import ImageBox from '../../../components/image-box/image-box';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, type ApiError } from '../../../api/apiClient';
import { useCompetition } from '../../../hooks/useCompetition';
import { useNavigate } from 'react-router';

export default function MatchCard({ match }: { match: Match }) {
	const date = new Date(match.date);
	const today = new Date();

	const {competition} = useCompetition();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { mutateAsync: playMatchAsync } = useMutation<
		NoContentResponse,
		ApiError,
		string
	>({
		mutationFn: (matchId) =>
			apiRequest<NoContentResponse>(`competitions/${competition.id}/matches/play?match_id=${matchId}`, {
				method: 'POST',
			}),

			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: ['competitions', competition.id, 'matches'],
				});
			},

			onError: (error) => {
				console.error('Error playing match:', error);
			}
	});

	return (
		<div className={style.matchCard}>
			<div className={style.teamsAndResultBox} onClick={() => navigate(`${match.id}`)}>
				<div className={style.teamBox}>
					<ImageBox
						src={match.home_team.logo}
						alt={match.home_team.name}
						className={style.imageBox}
					/>
					<div className={style.teamName}>{match.home_team.name}</div>
				</div>
				<div className={style.resultBox}>{match.goal_home}</div>
				<div className={style.teamBox}>
					<ImageBox
						src={match.away_team.logo}
						alt={match.away_team.name}
						className={style.imageBox}
					/>
					<div className={style.teamName}>{match.away_team.name}</div>
				</div>
				<div className={style.resultBox}>{match.goal_away}</div>
			</div>
			<div className={style.verticalSeparator} />
			<div className={style.actionBox}>
				{match.played 
					? <Eye className={style.icon} onClick={() => navigate(`${match.id}`)} /> 
					: (date <= today 
						? <Play className={style.icon} onClick={() => playMatchAsync(match.id)}/> 
						: <div className={style.lockBox}><Lock className={style.lockIcon} /><span className={style.lockText}>{date.toLocaleDateString()}</span></div>
		)}
			</div>
		</div>
	);
}

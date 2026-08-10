import { useCompetition } from '../../hooks/useCompetition';
import style from './competition-standings.module.scss';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';
import type { Standings } from '../../types/api';
import { useAuth } from '../../auth/useAuth';
import clsx from 'clsx';
import ImageBox from '../../components/image-box/image-box';

export default function CompetitionStandings() {
	const { competition } = useCompetition();
	const { isAuthenticated } = useAuth();

	const {
		data: teams,
		isPending,
		error,
	} = useQuery({
		queryKey: ['competitions', 'standings', competition.id],
		queryFn: () =>
			apiRequest<Standings>(`competitions/${competition.id}/standings`),
		enabled: isAuthenticated && !!competition.id,
	});

	if (!isPending && error) {
		return <div>{JSON.stringify(error)}</div>;
	}

	return (
		<section className={style.content}>
			<div className={style.standings}>
				<div className={style.headerRow}>
					<div>Team</div>
					<div>M</div>
					<div>W</div>
					<div>D</div>
					<div>L</div>
					<div>G</div>
					<div>GA</div>
					<div>GD</div>
					<div className={style.pointsColumn}>Pts</div>
				</div>
				{teams &&
					teams.map((team, position) => (
						<div key={team.id} className={style.teamRow}>
							<div
								className={clsx(
									style.teamColumn,
									position < 4 && style.championsLeague,
									position >= 4 && position < 6 && style.europaLeague,
									position === 6 && style.conferenceLeague,
									position > 12 && position <= 14 && style.playout,
									position > 14 && style.relegation,
								)}
							>
								<div>{position + 1}</div>
								<ImageBox src={team.logo} alt={team.name} className={style.imageBoxSize}/>
								<span>{team.name}</span>
							</div>
							<div>{team.matches}</div>
							<div>{team.win}</div>
							<div>{team.draw}</div>
							<div>{team.loss}</div>
							<div>{team.goals}</div>
							<div>{team.goals_against}</div>
							<div>{team.goal_difference}</div>
							<div className={style.pointsColumn}>{team.points}</div>
						</div>
					))}
			</div>
		</section>
	);
}

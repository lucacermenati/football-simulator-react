import { Eye, Lock, Play } from 'lucide-react';
import type { Match } from '../../../types/api';
import style from './match-card.module.scss';
import ImageBox from '../../../components/image-box/image-box';

export default function MatchCard({ match }: { match: Match }) {
	const date = new Date(match.date);
	const today = new Date();

	return (
		<div className={style.matchCard}>
			<div className={style.teamsAndResultBox}>
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
				{match.played ? <Eye className={style.icon}/> : (date <= today ? <Play className={style.icon} /> : <div className={style.lockBox}><Lock className={style.lockIcon} /><span className={style.lockText}>{date.toLocaleDateString()}</span></div>)}
			</div>
		</div>
	);
}

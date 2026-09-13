import type { Match } from '../../../types/api';
import style from './match-card.module.scss';

export default function MatchCard({ match }: { match: Match }) {
	return (
		<div className={style.matchCard}>
			<div>{match.home_team?.name}</div>
			<div>{match.away_team?.name}</div>
		</div>
	);
}

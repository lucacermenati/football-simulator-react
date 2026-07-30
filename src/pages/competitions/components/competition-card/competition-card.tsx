import type { Competition } from '../../../types/api';
import styles from './competition-card.module.scss';

export default function CompetitionCard({
	competition,
}: {
	competition: Competition;
}) {
	return (
		<div className={styles.competitionCard}>
			<div className={styles.logoContainer}>
				<img
					className={styles.competitionLogo}
					src={competition.logo}
					alt={`${competition.name} logo`}
				/>
			</div>

			<div className={styles.competitionName}>{competition.name}</div>
		</div>
	);
}

import CompetitionLogo from '../../../../components/competition-logo/competition-logo';
import type { Competition } from '../../../types/api';
import styles from './competition-card.module.scss';
import Card from '../../../../components/card/card';

export default function CompetitionCard({
	competition,
	onClick,
}: {
	competition: Competition;
	onClick?: () => void;
}) {
	return (
		<Card className={styles.competitionCard} onClick={onClick}>
			<CompetitionLogo competition={competition} size="fill" />
			<div className={styles.competitionName}>{competition.name}</div>
		</Card>
	);
}

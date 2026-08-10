import ImageBox from '../../../../components/image-box/image-box';
import type { Competition } from '../../../types/api';
import styles from './competition-card.module.scss';

export default function CompetitionCard({
	competition,
	onClick,
}: {
	competition: Competition;
	onClick?: () => void;
}) {
	return (
		<div className={styles.competitionCard} onClick={onClick}>
			<ImageBox
				src={competition.logo}
				alt={`${competition.name} logo`}
			/>
			<div className={styles.competitionName}>{competition.name}</div>
		</div>
	);
}

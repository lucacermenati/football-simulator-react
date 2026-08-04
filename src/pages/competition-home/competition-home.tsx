import { useCompetition } from '../../hooks/useCompetition';
import styles from './competition-home.module.scss';

export default function CompetitionHome() {
	const { competition } = useCompetition();

	return (
		<section className={styles.content}>{competition.description}</section>
	);
}

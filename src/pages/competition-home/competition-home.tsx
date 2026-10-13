import { useCompetition } from '../../hooks/useCompetition';
import styles from './competition-home.module.scss';
import Card from '../../components/card/card';

export default function CompetitionHome() {
	const { competition } = useCompetition();

	return (
		<Card className={styles.content}>{competition.description}</Card>
	);
}

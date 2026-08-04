import { useCompetition } from '../../hooks/useCompetition';

export default function CompetitionHome() {
	const { competition } = useCompetition();

	return <section>{competition.description}</section>;
}

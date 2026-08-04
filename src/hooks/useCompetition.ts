import { useOutletContext } from 'react-router';
import type { Competition } from '../types/api';

export function useCompetition() {
	return useOutletContext<{ competition: Competition }>();
}

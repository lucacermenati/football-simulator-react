import { useOutletContext } from 'react-router';
import type { Team } from '../types/api';

export function useTeam() {
	return useOutletContext<{ team: Team }>();
}
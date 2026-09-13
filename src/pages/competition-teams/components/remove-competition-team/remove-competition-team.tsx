import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../../../../components/modal/modal';
import { useCompetition } from '../../../../hooks/useCompetition';
import type {
	ManageCompetitionTeamsRequest,
	NoContentResponse,
	Team,
} from '../../../../types/api';
import { apiRequest, type ApiError } from '../../../../api/apiClient';

export default function RemoveCompetitionTeam({
	team,
	setIsModalOpen,
}: {
	team: Team;
	setIsModalOpen: (value: boolean) => void;
}) {
	const { competition } = useCompetition();

	const queryClient = useQueryClient();

	const { mutate: removeTeamFromCompetition } = useMutation<
		NoContentResponse,
		ApiError,
		ManageCompetitionTeamsRequest
	>({
		mutationFn: (data: ManageCompetitionTeamsRequest) =>
			apiRequest(`competitions/${competition?.id}/teams`, {
				method: 'DELETE',
				body: data,
			}),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['competitions', competition?.id, 'teams'],
			});

			setIsModalOpen(false);
		},

		onError: () => {
			setIsModalOpen(false);
		},
	});

	return (
		<Modal
			title='Remove team'
			description={`Are you sure you want to remove ${team.name} from ${competition.name}?`}
			submitText='Remove'
			onCancel={() => setIsModalOpen(false)}
			onSubmit={() => {
				removeTeamFromCompetition({
					teams: [team.id],
				});
			}}
		>
			<p>
				The action is not reversible and you will lose all data including
				matches, and statistics.
			</p>
		</Modal>
	);
}

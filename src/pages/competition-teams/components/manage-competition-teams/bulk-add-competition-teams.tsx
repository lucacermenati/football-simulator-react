import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Modal from '../../../../components/modal/modal';
import { useCompetition } from '../../../../hooks/useCompetition';
import { apiRequest } from '../../../../api/apiClient';
import type { PaginatedData, Team } from '../../../../types/api';
import { useAuth } from '../../../../auth/useAuth';
import { useState } from 'react';
import style from './bulk-add-competition-teams.module.scss';
import ImageBox from '../../../../components/image-box/image-box';
import { TextInput } from '../../../../components/form';
import { Cross, CrossIcon, X } from 'lucide-react';

export default function BulkAddCompetitionTeams({
	setIsModalOpen,
}: {
	setIsModalOpen: (state: boolean) => void;
}) {
	const { competition } = useCompetition();
	const { isAuthenticated } = useAuth();

	const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
	const [searchTerm, setSearchTerm] = useState('');

	const queryClient = useQueryClient();

	const {
		data: paginatedAvailableTeams,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: [
			'competitions',
			competition?.id,
			'available-teams',
			searchTerm,
			selectedTeams,
		],
		queryFn: () =>
			apiRequest<PaginatedData<Team>>(
				`competitions/${competition?.id}/available-teams?search=${searchTerm}&except=${selectedTeams.map((team) => team.id).join(',')}`,
			),
		enabled: isAuthenticated && !!competition?.id,
	});

	const availableTeams = paginatedAvailableTeams?.data;

	const selectableTeams = availableTeams?.filter(
		(team) =>
			!selectedTeams.some((selectedTeam) => selectedTeam.id === team.id),
	);

	const { mutateAsync: addSelectedTeams } = useMutation({
		mutationFn: () =>
			apiRequest(`competitions/${competition?.id}/teams`, {
				method: 'POST',
				body: selectedTeams.map((team) => team.id),
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
			title='Add multiple teams'
			description='Search for teams and add them to your competition.'
			submitText='Add selected'
			onCancel={() => setIsModalOpen(false)}
			onSubmit={addSelectedTeams}
		>
			<div>
				<TextInput
					id='team-search'
					placeholder='Search for teams'
					className={style.search}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<div className={style.selectableTeamsList}>
					{selectableTeams &&
						selectableTeams.map((team) => (
							<div
								key={team.id}
								className={style.teamItem}
								onClick={() => setSelectedTeams([...selectedTeams, team])}
							>
								{team.logo ? (
									<ImageBox
										src={team.logo}
										alt={team.name}
										className={style.imageBoxSize}
									/>
								) : (
									team.name
								)}
								<div>{team.name}</div>
							</div>
						))}
				</div>
				<p className={style.text}>Selected teams</p>
				<div className={style.selectableTeamsList}>
					{selectedTeams &&
						selectedTeams.map((team) => (
							<div key={team.id} className={style.selectedTeamItem}>
								{team.logo ? (
									<ImageBox
										src={team.logo}
										alt={team.name}
										className={style.imageBoxSize}
									/>
								) : (
									team.name
								)}
								<div>{team.name}</div>
								<X
									className={style.unselectIcon}
									onClick={() =>
										setSelectedTeams(
											selectedTeams.filter((t) => t.id !== team.id),
										)
									}
								/>
							</div>
						))}
				</div>
			</div>
		</Modal>
	);
}

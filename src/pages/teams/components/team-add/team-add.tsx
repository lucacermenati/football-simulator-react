import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Modal from '../../../../components/modal/modal';
import { ApiError, apiRequest } from '../../../../api/apiClient';
import type {
    Competition,
	ManageCompetitionTeamsRequest,
	NoContentResponse,
	PaginatedData,
	Team,
} from '../../../../types/api';
import { useAuth } from '../../../../auth/useAuth';
import { useState } from 'react';
import style from './team-add.module.scss';
import ImageBox from '../../../../components/image-box/image-box';
import { TextInput } from '../../../../components/form';
import Loader from '../../../../components/loader/loader';
import ErrorText from '../../../../components/form/error-text/error-text';
import clsx from 'clsx';

export default function AddTeam({
    team,
	onCancel,
}: {
    team: Team,
	onCancel: () => void;
}) {
	const { isAuthenticated } = useAuth();

	const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

	const queryClient = useQueryClient();

	const {
		data: paginatedAvailableCompetitions,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: [
			'teams',
			team?.id,
			'available-teams',
			searchTerm,
		],
		queryFn: () =>
			apiRequest<PaginatedData<Competition>>(
				`teams/${team?.id}/available-competitions?search=${searchTerm}`,
			),
		enabled: isAuthenticated && !!team?.id,
	});

	const selectableCompetitions = paginatedAvailableCompetitions?.data;

	const { mutateAsync: addToCompetition } = useMutation<
		NoContentResponse,
		ApiError,
		{ competitionId: string, data: ManageCompetitionTeamsRequest }
	>({
		mutationFn: ({ competitionId, data }) =>
			apiRequest(`competitions/${competitionId}/teams`, {
				method: 'POST',
				body: data,
			}),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['competitions', selectedCompetition?.id, 'teams'],
			});

			onCancel();
		},

		onError: () => {
			onCancel();
		},
	});

	return (
		<Modal
			title='Add team to competition'
			description={`Search for a competition and add ${team?.name} to it.`}
			submitText='Add selected'
			onCancel={onCancel}
			onSubmit={() => {
				addToCompetition({ competitionId: selectedCompetition?.id, data: { teams: [team.id] } });
			}}
		>
			<div>
				<TextInput
					id='competition-search'
					placeholder='Search for competitions'
					className={style.search}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<div className={style.selectableTeamsList}>
					{isPending && <Loader />}
					{isError && <ErrorText>{error?.message}</ErrorText>}
					{!isError &&
						!isPending &&
						selectableCompetitions &&
						selectableCompetitions.map((competition) => (
							<div
								key={competition.id}
								className={clsx(style.teamItem, {
									[style.selectedCompetition]: selectedCompetition?.id === competition.id,
								})}
								onClick={() => setSelectedCompetition(competition)}
							>
								{competition.logo ? (
									<ImageBox
										src={competition.logo}
										alt={competition.name}
										className={style.imageBoxSize}
									/>
								) : (
									competition.name
								)}
								<div>{competition.name}</div>
							</div>
						))}
				</div>
			</div>
		</Modal>
	);
}

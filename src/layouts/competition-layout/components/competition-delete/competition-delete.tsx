import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, type ApiError } from '../../../../api/apiClient';
import Modal from '../../../../components/modal/modal';
import type { Competition, NoContentResponse } from '../../../../types/api';
import styles from './competition-delete.module.scss';
import { useNavigate } from 'react-router';
import ErrorText from '../../../../components/form/error-text/error-text';
import { useState } from 'react';

export default function CompetitionDelete({
	competition,
	onCancel,
}: {
	competition: Competition;
	onCancel: () => void;
}) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	const {
		mutateAsync: deleteCompetitionAsync,
		isPending,
		isError,
	} = useMutation<NoContentResponse, ApiError, string>({
		mutationFn: (id: string) =>
			apiRequest<NoContentResponse>(`competitions/${id}`, {
				method: 'DELETE',
			}),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['competitions'],
			});

			onCancel();

			navigate('/competitions');
		},

		onError: (error) => {
			setError(error.message);
		},
	});

	return (
		<Modal
			title='Delete competition'
			description={`Are you sure you want to delete ${competition.name}?`}
			submitText='Delete'
			onCancel={() => {
				onCancel();
			}}
			isSubmitting={isPending}
			onSubmit={() => {
				deleteCompetitionAsync(competition.id);
			}}
		>
			<div className={styles.deleteWarning}>
				<p>The action is not reversible and you will lose all data including</p>
				<p>matches, teams, and statistics.</p>
			</div>
			{isError && error && <ErrorText>{error}</ErrorText>}
		</Modal>
	);
}

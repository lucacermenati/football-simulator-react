import { useState } from "react";
import ErrorText from "../../../../components/form/error-text/error-text";
import Modal from "../../../../components/modal/modal";
import type { NoContentResponse, Team } from "../../../../types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, type ApiError } from "../../../../api/apiClient";
import { useNavigate } from "react-router";
import style from './team-delete.module.scss';

export default function TeamDelete({team, onCancel}: {team: Team, onCancel: () => void}) {
    const [error, setError] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
		mutateAsync: deleteTeamAsync,
		isPending,
		isError,
	} = useMutation<NoContentResponse, ApiError, string>({
		mutationFn: (id: string) =>
			apiRequest<NoContentResponse>(`teams/${id}`, {
				method: 'DELETE',
			}),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['teams'],
			});

			onCancel();

			navigate('/teams');
		},

		onError: (error) => {
			setError(error.message);
		},
	});

    return (
        <Modal
            title={`Delete team`}
            description={`Are you sure you want to delete ${team.name}?`}
            onCancel={onCancel}
            isSubmitting={isPending}
            onSubmit={async () => { await deleteTeamAsync(team.id); }}
        >
            <div className={style.deleteWarning}>
				<p>The action is not reversible and you will lose all data including</p>
				<p>matches, players and statistics.</p>
			</div>
			{isError && error && <ErrorText>{error}</ErrorText>}
        </Modal>
    )
}
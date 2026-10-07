import { useState } from "react";
import ErrorText from "../../../../components/form/error-text/error-text";
import Modal from "../../../../components/modal/modal";
import type { NoContentResponse, Player } from "../../../../types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, type ApiError } from "../../../../api/apiClient";
import { useNavigate } from "react-router";
import style from './player-delete.module.scss';

export default function PlayerDelete({player, onCancel}: {player: Player, onCancel: () => void}) {
    const [error, setError] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
		mutateAsync: deletePlayerAsync,
		isPending,
		isError,
	} = useMutation<NoContentResponse, ApiError, string>({
		mutationFn: (id: string) =>
			apiRequest<NoContentResponse>(`players/${id}`, {
				method: 'DELETE',
			}),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['players'],
			});

			onCancel();

			navigate('/players');
		},

		onError: (error) => {
			setError(error.message);
		},
	});

    return (
        <Modal
            title={`Delete player`}
            description={`Are you sure you want to delete ${player.full_name}?`}
            onCancel={onCancel}
            isSubmitting={isPending}
            onSubmit={async () => { await deletePlayerAsync(player.id); }}
        >
            <div className={style.deleteWarning}>
				<p>The action is not reversible and you will lose all data including statistics.</p>
			</div>
			{isError && error && <ErrorText>{error}</ErrorText>}
        </Modal>
    )
}

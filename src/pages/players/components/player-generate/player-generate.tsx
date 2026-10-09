import { useForm } from "react-hook-form";
import { Form, TextInput } from "../../../../components/form";
import Modal from "../../../../components/modal/modal";
import type { GeneratePlayersRequest, Player } from "../../../../types/api";
import { fieldErrorToMessage } from "../../../../utils/fieldErrorToMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, type ApiError } from "../../../../api/apiClient";

export default function PlayerGenerate({onCancel}: {onCancel: () => void}) {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<GeneratePlayersRequest>({
        defaultValues: {
            n: 1,
        },
    });

    const { mutateAsync: generatePlayersAsync } = useMutation<
        Player[],
        ApiError,
        GeneratePlayersRequest
    >({
        mutationFn: (data) =>
            apiRequest<Player[]>(`players/generate`, {
                method: 'POST',
                body: data,
            }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['players'],
            });

            onCancel();
        },

        onError: (error) => {
            const validationErrors = error.data?.errors;

            if (!validationErrors) {
                setError('root.server', {
                    type: 'server',
                    message: error.message,
                });

                return;
            }

            Object.entries(validationErrors).forEach(([field, messages]) => {
                setError(field as keyof GeneratePlayersRequest, {
                    type: 'server',
                    message: messages[0],
                    types: {
                        server: messages,
                    },
                });
            });
        },
    });

    const generatePlayers = async (data: GeneratePlayersRequest) => {
        await generatePlayersAsync(data);
    }

    return (
        <Modal
            title={`Generate players`}
            description="Randomly generate multiple players at once. You can generate from 1 to 100 in one go."
            onCancel={onCancel}
            onSubmit={handleSubmit(generatePlayers)}
            isSubmitting={isSubmitting}
        >
            <Form disabled={isSubmitting}>
                <TextInput
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    id='n'
                    label='Number of players'
                    placeholder='Number of players'
                    error={fieldErrorToMessage(errors.n)}
                    {...register('n', {
                        valueAsNumber: true,
                        required: 'The number of players is required.',
                        validate: (value) => Number.isInteger(value) || 'The number of players must be a whole number.',
                        min: { value: 1, message: 'You must generate at least 1 player.' },
                        max: { value: 100, message: 'You can generate at most 100 players.' },
                    })}
                />
            </Form>
        </Modal>
    );
}

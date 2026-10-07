import { useForm } from "react-hook-form";
import { Form, Select, TextInput } from "../../../../components/form";
import Modal from "../../../../components/modal/modal";
import type { Player, UpdatePlayerRequest, Nationality } from "../../../../types/api";
import { fieldErrorToMessage } from "../../../../utils/fieldErrorToMessage";
import { formatDateForInput } from "../../../../utils/formatDateForInput";
import style from './player-edit.module.scss';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, type ApiError } from "../../../../api/apiClient";

const positions = [
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Forward"
];

export default function PlayerEdit({player, onCancel}: {player: Player, onCancel: () => void}) {
    const queryClient = useQueryClient();

    const { data: nationalities } = useQuery({
        queryKey: ['nationalities'],
        queryFn: () => apiRequest<Nationality[]>('nationalities'),
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePlayerRequest>({
        defaultValues: {
            first_name: player.first_name,
            last_name: player.last_name,
            birth_date: formatDateForInput(player.birth_date),
            position: player.position,
            nationality: player.nationality,
            number: player.number,
        },
    });

    const { mutateAsync: updatePlayerAsync } = useMutation<
        Player,
        ApiError,
        {playerId: string; data: UpdatePlayerRequest}
    >({
        mutationFn: ({playerId, data}) =>
            apiRequest<Player>(`players/${playerId}`, {
                method: 'PUT',
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
                setError(field as keyof UpdatePlayerRequest, {
                    type: 'server',
                    message: messages[0],
                    types: {
                        server: messages,
                    },
                });
            });
        },
    });

    return (
        <Modal
            title={`Edit Player: ${player.full_name}`}
            description="Fill in all mandatory fields to edit the player."
            onCancel={onCancel}
            onSubmit={handleSubmit(async (data) => {
                await updatePlayerAsync({playerId: player.id, data});
            })}
            isSubmitting={isSubmitting}
        >
            <Form disabled={isSubmitting}>
                <div className={style.doubleInputBox}>
                    <TextInput
                        id='first_name'
                        label='First Name'
                        placeholder='First Name'
                        error={fieldErrorToMessage(errors.first_name)}
                        {...register('first_name')}
                    />
                    <TextInput
                        id='last_name'
                        label='Last Name'
                        placeholder='Last Name'
                        error={fieldErrorToMessage(errors.last_name)}
                        {...register('last_name')}
                    />
                </div>
                <TextInput
                    type='date'
                    id='birth_date'
                    label='Birth Date'
                    error={fieldErrorToMessage(errors.birth_date)}
                    {...register('birth_date')}
                />
                <div className={style.doubleInputBox}>
                    <Select
                        id='position'
                        label='Position'
                        error={fieldErrorToMessage(errors.position)}
                        {...register('position')}
                    >
                        <option value=''>Select position</option>
                        {positions.map((position) =>
                            <option key={position} value={position}>{position}</option>
                        )}
                    </Select>
                    <Select
                        id='nationality'
                        label='Nationality'
                        error={fieldErrorToMessage(errors.nationality)}
                        {...register('nationality')}
                    >
                        <option value=''>Select nationality</option>
                        {nationalities?.map(({ code, name }) =>
                            <option key={code} value={code}>{name}</option>
                        )}
                    </Select>
                </div>
                <TextInput
                    type="number"
                    min={1}
                    max={99}
                    id='number'
                    label='Number'
                    placeholder='Number'
                    error={fieldErrorToMessage(errors.number)}
                    {...register('number', {
                        valueAsNumber: true,
                        min: { value: 1, message: 'The number must be at least 1.' },
                        max: { value: 99, message: 'The number must be at most 99.' },
                    })}
                />
            </Form>
        </Modal>
    );
}

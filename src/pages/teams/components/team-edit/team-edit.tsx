import { useForm } from "react-hook-form";
import { Form, TextArea, TextInput } from "../../../../components/form";
import Modal from "../../../../components/modal/modal";
import type { Team, UpdateTeamRequest } from "../../../../types/api";
import { fieldErrorToMessage } from "../../../../utils/fieldErrorToMessage";
import style from './team-edit.module.scss';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, type ApiError } from "../../../../api/apiClient";

export default function TeamEdit({team, onCancel}: {team: Team, onCancel: () => void}) {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<UpdateTeamRequest>({
        defaultValues: {
            name: team.name,
            rating: team.rating,
            history: team.history || '',
            first_color: team.first_color || '',
            second_color: team.second_color || '',
            year_of_foundation: team.year_of_foundation || undefined,
            stadium: team.stadium || '',
        },
    });

    const { mutateAsync: updateTeamAsync } = useMutation<
        Team,
        ApiError,
        {teamId: string; data: UpdateTeamRequest}
    >({
        mutationFn: ({teamId, data}) =>
            apiRequest<Team>(`teams/${teamId}`, {
                method: 'PUT',
                body: data,
            }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['teams'],
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
                setError(field as keyof UpdateTeamRequest, {
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
            title={`Edit Team: ${team.name}`}
            description="Fill in all mandatory fields to edit the team."
            onCancel={onCancel}
            onSubmit={handleSubmit(async (data) => {
                await updateTeamAsync({teamId: team.id, data});
            })}
            isSubmitting={isSubmitting}
        >
            <Form>
                <div className={style.doubleInputBox}>
                    <TextInput
                        id='name'
                        label='Name'
                        placeholder='Competition'
                        error={fieldErrorToMessage(errors.name)}
                        {...register('name')}
                    />
                    <TextInput
                        type="number"
                        min={45}
                        max={99}
                        id='rating'
                        label='Rating'
                        error={fieldErrorToMessage(errors.rating)}
                        {...register('rating')}
                    />
                </div>
                <TextArea
                    id='history'
                    label='History'
                    placeholder='History'
                    error={fieldErrorToMessage(errors.history)}
                    {...register('history')}
                />
                <div className={style.doubleInputBox}>
                    <TextInput
                        type='color'
                        id='first_color'
                        label='First Color'
                        placeholder='First Color'
                        error={fieldErrorToMessage(errors.first_color)}
                        {...register('first_color')}
                    />
                    <TextInput
                        type='color'
                        id='second_color'
                        label='Second Color'
                        placeholder='Second Color'
                        error={fieldErrorToMessage(errors.second_color)}
                        {...register('second_color')}
                    />
                </div>
                <TextInput
                    type="number"
                    id='year_of_foundation'
                    label='Year of Foundation'
                    placeholder='Year of Foundation'
                    error={fieldErrorToMessage(errors.year_of_foundation)}
                    {...register('year_of_foundation')}
                />
                <TextInput
                    id='stadium'
                    label='Stadium'
                    placeholder='Stadium'
                    error={fieldErrorToMessage(errors.stadium)}
                    {...register('stadium')}
                />
            </Form>
        </Modal>
    );
}

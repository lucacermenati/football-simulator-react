import { useForm } from "react-hook-form";
import { FileUpload, Form, TextArea, TextInput } from "../../../../components/form";
import Modal from "../../../../components/modal/modal";
import type { Team, CreateTeamRequest } from "../../../../types/api";
import { fieldErrorToMessage } from "../../../../utils/fieldErrorToMessage";
import style from './team-create.module.scss';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, type ApiError } from "../../../../api/apiClient";

export default function TeamCreate({onCancel}: {onCancel: () => void}) {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CreateTeamRequest>({
        defaultValues: {
            name: '',
            rating: 45,
            history: '',
            first_color: '',
            second_color: '',
            year_of_foundation: undefined,
            stadium: '',
            logo: null,
        },
    });

    const { mutateAsync: createTeamAsync } = useMutation<
        Team,
        ApiError,
        FormData
    >({
        mutationFn: (data) =>
            apiRequest<Team>(`teams`, {
                method: 'POST',
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
                setError(field as keyof CreateTeamRequest, {
                    type: 'server',
                    message: messages[0],
                    types: {
                        server: messages,
                    },
                });
            });
        },
    });

    const createTeam = async (data: CreateTeamRequest) => {
        const formData = new FormData();
        
        formData.append('name', data.name);

        if (data.rating !== undefined) formData.append('rating', data.rating.toString());
        if (data.history) formData.append('history', data.history);
        if (data.first_color) formData.append('first_color', data.first_color);
        if (data.second_color) formData.append('second_color', data.second_color);
        if (data.year_of_foundation !== undefined) formData.append('year_of_foundation', data.year_of_foundation.toString());
        if (data.stadium) formData.append('stadium', data.stadium);
        if (data.logo && data.logo.length > 0) {
            formData.append('logo', data.logo[0]);
        }

        await createTeamAsync(formData);
    }

    return (
        <Modal
            title={`Create Team`}
            description="Fill in all mandatory fields to create a new team."
            onCancel={onCancel}
            onSubmit={handleSubmit(createTeam)}
            isSubmitting={isSubmitting}
        >
            <Form disabled={isSubmitting}>
                <FileUpload
                    id='logo'
                    label='Logo'
                    error={fieldErrorToMessage(errors.logo)}
                    disabled={isSubmitting}
                    accept='image/png,image/jpeg,image/webp'
                    {...register('logo')}
                />
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

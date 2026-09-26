import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, type ApiError } from '../../../../api/apiClient';
import Modal from '../../../../components/modal/modal';
import type {
	Competition,
	UpdateCompetitionRequest,
} from '../../../../types/api';
import { Form, TextArea, TextInput } from '../../../../components/form';
import { fieldErrorToMessage } from '../../../../utils/fieldErrorToMessage';
import { useForm, type SubmitHandler } from 'react-hook-form';

export default function TeamEdit({
	competition,
	onCancel,
}: {
	competition: Competition;
	onCancel: () => void;
}) {
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<UpdateCompetitionRequest>({
		defaultValues: {
			name: competition.name,
			description: competition.description || '',
		},
	});

	const { mutateAsync: updateCompetitionAsync } = useMutation<
		Competition,
		ApiError,
		{ id: string; data: FormData }
	>({
		mutationFn: ({ id, data }) =>
			apiRequest<Competition>(`competitions/${id}`, {
				method: 'PUT',
				body: data,
			}),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['competitions', competition.id],
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
				setError(field as keyof UpdateCompetitionRequest, {
					type: 'server',
					message: messages[0],
					types: {
						server: messages,
					},
				});
			});
		},
	});

	const updateCompetition: SubmitHandler<UpdateCompetitionRequest> = async (
		data,
	) => {
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('description', data.description);

		await updateCompetitionAsync({ id: competition.id, data: formData });
	};

	return (
		<Modal
			title='Edit competition'
			description='Fill in all mandatory fields to update your competition.'
			submitText='Update'
			onCancel={() => {
				onCancel();
			}}
			isSubmitting={isSubmitting}
			onSubmit={handleSubmit(updateCompetition)}
		>
			<Form disabled={isSubmitting}>
				<TextInput
					id='name'
					label='Name'
					placeholder='Competition'
					error={fieldErrorToMessage(errors.name)}
					{...register('name')}
				/>
				<TextArea
					id='description'
					label='Description'
					placeholder='Competition history...'
					error={fieldErrorToMessage(errors.description)}
					{...register('description')}
				/>
			</Form>
		</Modal>
	);
}

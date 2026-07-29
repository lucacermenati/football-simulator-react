import { useForm, type SubmitHandler } from 'react-hook-form';
import Modal from '../../../../components/modal/modal';
import {
	type Competition,
	type CreateCompetitionRequest,
} from '../../../../types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, apiRequest } from '../../../../api/apiClient';
import { Form } from '../../../../components/form';

export default function CreateCompetition({
	setIsModalOpen,
}: {
	setIsModalOpen: (state: boolean) => void;
}) {
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<CreateCompetitionRequest>({
		defaultValues: {
			name: '',
			description: '',
		},
	});

	const { mutateAsync: createCompetitionAsync } = useMutation<
		Competition,
		ApiError,
		CreateCompetitionRequest
	>({
		mutationFn: (data) =>
			apiRequest<Competition>('competitions', {
				method: 'POST',
				body: data,
			}),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['competitions'],
			});

			setIsModalOpen(false);
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
				setError(field as keyof CreateCompetitionRequest, {
					type: 'server',
					message: messages[0],
				});
			});
		},
	});

	const createCompetition: SubmitHandler<CreateCompetitionRequest> = async (
		data,
	) => {
		await createCompetitionAsync(data);
	};

	return (
		<Modal
			title='Create a Competition'
			description='Fill in the details to create a new competition.'
			onCancel={() => setIsModalOpen(false)}
			onSubmit={handleSubmit(createCompetition)}
			isSubmitting={isSubmitting}
		>
			<Form>
				<div>
					<label>Name</label>
					<input type='text' {...register('name')} />
					{errors.name && <p>{errors.name.message}</p>}
				</div>
				<div>
					<label>Description</label>
					<textarea {...register('description')} />
					{errors.description && <p>{errors.description.message}</p>}
				</div>
			</Form>
		</Modal>
	);
}

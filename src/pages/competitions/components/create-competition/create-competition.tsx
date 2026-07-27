import { useForm } from 'react-hook-form';
import Modal from '../../../../components/modal/modal';
import {
	type Competition,
	type CreateCompetitionRequest,
	type NoContentResponse,
} from '../../../../types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../../../api/apiClient';
import { useCallback } from 'react';
import { useAuth } from '../../../../auth/useAuth';

export default function CreateCompetition({
	setIsModalOpen,
}: {
	setIsModalOpen: (state: boolean) => void;
}) {
	const { token } = useAuth();
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CreateCompetitionRequest>({
		defaultValues: {
			name: '',
			description: '',
		},
	});

	const {
		mutateAsync: createCompetitionAsync,
		isPending,
		isError,
	} = useMutation<Competition, Error, CreateCompetitionRequest>({
		mutationFn: (data) =>
			apiRequest<Competition>('competitions', {
				method: 'POST',
				body: data,
				token: token,
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['competitions'],
			});

			setIsModalOpen(false);
		},

		onError: (error) => {
			console.log(error);
		},
	});

	const createCompetition = useCallback(
		async (competition: CreateCompetitionRequest) => {
			await createCompetitionAsync(competition);
		},
		[createCompetitionAsync],
	);

	return (
		<Modal
			title='Create a Competition'
			description='Fill in the details to create a new competition.'
			onCancel={() => setIsModalOpen(false)}
			onSubmit={handleSubmit(createCompetition)}
			isSubmitting={false}
		>
			<form>
				<div>
					<label>Name</label>
					<input type='text' {...register('name')} />
					{errors.name && <p>{errors.name.message}</p>}
				</div>
				<div>
					<label>Description</label>
					<input type='text' {...register('description')} />
					{errors.description && <p>{errors.description.message}</p>}
				</div>
			</form>
		</Modal>
	);
}

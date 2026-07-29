import { useForm, type SubmitHandler } from 'react-hook-form';
import Modal from '../../../../components/modal/modal';
import {
	type Competition,
	type CreateCompetitionRequest,
} from '../../../../types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, apiRequest } from '../../../../api/apiClient';
import {
	TextInput,
	TextArea,
	Form,
	FileUpload,
} from '../../../../components/form';
import { fieldErrorToMessage } from '../../../../utils/fieldErrorToMessage';

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
			logo: null,
		},
	});

	const { mutateAsync: createCompetitionAsync } = useMutation<
		Competition,
		ApiError,
		FormData
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

			console.log(validationErrors);

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
					types: {
						server: messages,
					},
				});
			});
		},
	});

	const createCompetition: SubmitHandler<CreateCompetitionRequest> = async (
		data,
	) => {
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('description', data.description);

		const logo = data.logo?.[0];

		if (logo) {
			formData.append('logo', logo);
		}

		await createCompetitionAsync(formData);
	};

	return (
		<Modal
			title='Create a Competition'
			description='Fill in the details to create a new competition.'
			onCancel={() => setIsModalOpen(false)}
			onSubmit={handleSubmit(createCompetition)}
			isSubmitting={isSubmitting}
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
				<FileUpload
					id='logo'
					label='Logo'
					error={fieldErrorToMessage(errors.logo)}
					{...register('logo')}
				/>
			</Form>
		</Modal>
	);
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, type ApiError } from '../../../../api/apiClient';
import Modal from '../../../../components/modal/modal';
import type {
	Competition,
	NoContentResponse,
	UpdateLogoRequest,
} from '../../../../types/api';
import { FileUpload, Form } from '../../../../components/form';
import { fieldErrorToMessage } from '../../../../utils/fieldErrorToMessage';
import { useForm, type SubmitHandler } from 'react-hook-form';
import style from './team-logo-upload.module.scss';

export default function TeamLogoUpload({
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
	} = useForm<UpdateLogoRequest>({
		defaultValues: {
			logo: null,
		},
	});

	const { mutateAsync: updateLogoAsync } = useMutation<
		NoContentResponse,
		ApiError,
		{ id: string; data: FormData }
	>({
		mutationFn: ({ id, data }) =>
			apiRequest<NoContentResponse>(`competitions/${id}/logo`, {
				method: 'POST',
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
				setError(field as keyof UpdateLogoRequest, {
					type: 'server',
					message: messages[0],
					types: {
						server: messages,
					},
				});
			});
		},
	});

	const updateLogo: SubmitHandler<UpdateLogoRequest> = async (
		data,
	) => {
		const formData = new FormData();
		formData.append('logo', data.logo[0]);

		await updateLogoAsync({ id: competition.id, data: formData });
	};

	return (
		<Modal
			title='Edit competition'
			description='Click on the icon to choose a file.'
			submitText='Upload'
			onCancel={() => {
				onCancel();
			}}
			isSubmitting={isSubmitting}
			onSubmit={handleSubmit(updateLogo)}
		>
			<Form disabled={isSubmitting} className={style.center}>
				<FileUpload
					id='logo'
					error={fieldErrorToMessage(errors.logo)}
					disabled={isSubmitting}
					accept='image/png,image/jpeg,image/webp'
					{...register('logo')}
				/>
			</Form>
		</Modal>
	);
}

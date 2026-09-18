import { ArrowRight, Edit } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import ErrorText from '../../components/form/error-text/error-text';
import Loader from '../../components/loader/loader';
import styles from './profile.module.scss';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, apiRequest } from '../../api/apiClient';
import { type NoContentResponse, type PaginatedData, type ReadyCompetition, type UpdateProfileRequest } from '../../types/api';
import ImageBox from '../../components/image-box/image-box';
import { useNavigate } from 'react-router';
import Modal from '../../components/modal/modal';
import { useState } from 'react';
import { Form, TextInput } from '../../components/form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { fieldErrorToMessage } from '../../utils/fieldErrorToMessage';

export default function Profile() {
	const { user, isUserPending, isUserFailed } = useAuth()
	;
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

	const { 
		data: readyCompetitionsPaginated, 
		isPending: isReadyCompetitionsPending, 
		isError: isReadyCompetitionsFailed, 
		error: readyCompetitionsError
	} = useQuery({
		queryKey: ['user', 'next-to-play'],
		queryFn: async () => apiRequest<PaginatedData<ReadyCompetition>>('user/next-to-play')
	});

	const {
			register,
			handleSubmit,
			setError,
			reset,
			formState: { errors, isSubmitting },
	} = useForm<UpdateProfileRequest>({
		defaultValues: {
			name: '',
			email: '',
		},
	});

	const { mutateAsync: updateProfileAsync } = useMutation<
		NoContentResponse,
		ApiError,
		UpdateProfileRequest
	>({
		mutationFn: (data) => apiRequest<NoContentResponse>('user', {
			method: 'PUT',
			body: data
		}),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['user'],
			});

			setIsEditModalOpen(false);
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
				setError(field as keyof UpdateProfileRequest, {
					type: 'server',
					message: messages[0],
					types: {
						server: messages,
					},
				});
			});
		},
	});

	const updateProfile: SubmitHandler<UpdateProfileRequest> = async (data) => {
		await updateProfileAsync(data);
	}

	const openModal = () => {
		if (!user) return;

		reset({
			name: user.name,
			email: user.email,
		});

		setIsEditModalOpen(true);
	}

	const content = isUserPending ? (
		<Loader />
	) : isUserFailed ? (
		<ErrorText>An error occurred while fetching your profile information. Please try again later.</ErrorText>
	) : user ? (
		<div className={styles.profileInfo}>
			<div className={styles.header}>
				<div className={styles.salutation}>Welcome back, {user?.name}</div>
				<Edit className={styles.icon} onClick={() => openModal()}/>
			</div>
			<p>
				<strong>Name:</strong> {user.name}
			</p>
			<p>
				<strong>Email:</strong> {user.email}
			</p>
			<div className={styles.upcomingMatchesContainer}>
				<div>Next to play</div>
				{isReadyCompetitionsPending ? (
					<Loader />
				) : isReadyCompetitionsFailed ? (
					<ErrorText>
						{readyCompetitionsError?.message ?? 'Something went wrong. Please try again.'}
					</ErrorText>
				) : readyCompetitionsPaginated?.data.length === 0 ? (
					<ErrorText>No upcoming matches found.</ErrorText>
				) : (<div>
						{readyCompetitionsPaginated?.data.map((competition) => (
							<div key={competition.id} className={styles.readyToPlayItem}>
								<ImageBox
									src={competition.logo}
									alt={competition.name}
									className={styles.boxLogoSize}
								/>
								<div>{competition.name}</div>
								<div>{new Date(competition.next_match_date).toLocaleDateString()}</div>
								<ArrowRight className={styles.icon} onClick={() => (navigate(`/competitions/${competition.id}/matches`))}/>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	) : null;

	return (
		<section className={styles.card}>
			<div>{content}</div>
			{isEditModalOpen && 
			<Modal 
				title="Edit Profile"
				description="Update your personal details"
				onCancel={() => setIsEditModalOpen(false)}
				onSubmit={handleSubmit(updateProfile)}
				isSubmitting={isSubmitting}
			>
				<Form disabled={isSubmitting}>
					<TextInput
						id='name'
						label='Name'
						placeholder='Name'
						error={fieldErrorToMessage(errors.name)}
						{...register('name')}
					/>
					<TextInput
						id='email'
						label='Email'
						placeholder='Email'
						error={fieldErrorToMessage(errors.email)}
						{...register('email')}
					/>
				</Form>
			</Modal>}
		</section>
	);
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, apiRequest } from '../../api/apiClient';
import { useCompetition } from '../../hooks/useCompetition';
import { useAuth } from '../../auth/useAuth';
import type { GenerateCompetitionMatchesRequest, Match, NoContentResponse, PaginatedData } from '../../types/api';
import style from './competition-matches.module.scss';
import MatchCard from './components/match-card';
import { ChevronLeft, ChevronRight, FastForward, SkipForward } from 'lucide-react';
import Loader from '../../components/loader/loader';
import ErrorText from '../../components/form/error-text/error-text';
import { Button, Form, TextInput } from '../../components/form';
import { useNavigate, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import Modal from '../../components/modal/modal';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { fieldErrorToMessage } from '../../utils/fieldErrorToMessage';
import clsx from 'clsx';

export default function CompetitionMatches() {
	const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();

	const { competition } = useCompetition();
	const { isAuthenticated } = useAuth();

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const dayParam = searchParams.get('day');
	const matchDay = dayParam ? parseInt(dayParam) : undefined;

	const {
		data: paginatedMatches,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ['competitions', competition.id, 'matches', matchDay],
		queryFn: () => {
			const baseApiUrl = `competitions/${competition.id}/matches`;
			const apiUrl = matchDay ? `${baseApiUrl}?day=${matchDay}` : baseApiUrl;

			return apiRequest<PaginatedData<Match>>(apiUrl);
		},
		enabled: isAuthenticated && !!competition.id,
	});

	const currentMatchDay = paginatedMatches?.meta.current_page ?? 1;

	useEffect(() => {
		if (!paginatedMatches) {
			return;
		}

		const actualDay = paginatedMatches.meta.current_page;

		if (matchDay !== actualDay) {
			setSearchParams(
				{ day: actualDay.toString() },
				{ replace: true },
			);
		}
	}, [
		paginatedMatches,
		matchDay,
		setSearchParams,
	]);

	const previousMatchDay = () => {
		if (currentMatchDay <= 1) {
			return;
		}

		const previousMatchDay = currentMatchDay - 1;
		setSearchParams({
			day: previousMatchDay.toString(),
		});
	};

	const nextMatchDay = () => {
		if (currentMatchDay >= paginatedMatches?.meta.last_page) {
			return;
		}

		const nextMatchDay = currentMatchDay + 1;
		setSearchParams({
			day: nextMatchDay.toString(),
		});
	};

	const {
			register,
			handleSubmit,
			setError,
			formState: { errors, isSubmitting },
		} = useForm<GenerateCompetitionMatchesRequest>({
			defaultValues: {
				start_date: Date.now().toString(),
			},
		});

	const { mutateAsync: generateMatchesAsync } = useMutation<NoContentResponse, ApiError, GenerateCompetitionMatchesRequest>({
		mutationFn: (data) =>
			apiRequest<NoContentResponse>(`competitions/${competition.id}/matches`, {
				method: 'POST',
				body: data,
			}),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['competitions', competition.id, 'matches'],
			});

			setIsGenerateModalOpen(false);
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
				setError(field as keyof GenerateCompetitionMatchesRequest, {
					type: 'server',
					message: messages[0],
					types: {
						server: messages,
					},
				});
			});
		}
	});

	const generateMatches: SubmitHandler<GenerateCompetitionMatchesRequest> = async (data) => {
		await generateMatchesAsync(data);
	};

	const { mutateAsync: playDayMatchesAsync } = useMutation<NoContentResponse, ApiError, number>({
		mutationFn: (day) =>
			apiRequest<NoContentResponse>(`competitions/${competition.id}/play?day=${day}`, {
				method: 'POST',
			}),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['competitions', competition.id, 'matches'],
			});
		},
		onError: (error) => {
			console.error('Error playing day matches:', error);
		}
	});

	const { mutateAsync: playAllMatchesAsync } = useMutation<NoContentResponse, ApiError>({
		mutationFn: () =>
			apiRequest<NoContentResponse>(`competitions/${competition.id}/play`, {
				method: 'POST',
			}),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['competitions', competition.id, 'matches'],
			});
		},
		onError: (error) => {
			console.error('Error playing day matches:', error);
		}
	});

	return (
		<section>
			<div className={style.topBar}>
				<div className={style.matchDayNavigationContainer}>
					<ChevronLeft className={clsx(style.icon, { [style.iconDisabled]: currentMatchDay <= 1 })} onClick={previousMatchDay}/>
					<span className={style.matchDayText}>Match Day {currentMatchDay}</span>
					<ChevronRight className={clsx(style.icon, { [style.iconDisabled]: currentMatchDay >= paginatedMatches?.meta.last_page })} onClick={nextMatchDay}/>

				</div>
				<div className={style.actionContainer}>
					<SkipForward className={style.icon} onClick={() => playDayMatchesAsync(currentMatchDay)}/>
					<FastForward className={style.icon} onClick={() => playAllMatchesAsync()}/>
				</div>
			</div>
			<div className={style.matchesGrid}>
				{paginatedMatches?.data && paginatedMatches?.data.length && paginatedMatches?.data.map((match) => (
					<MatchCard key={match.id} match={match} />
				))}
				{(paginatedMatches?.data && paginatedMatches?.data.length === 0) && (
					<div>
						<p className={style.infoText}>There are no matches available at the moment. Generate your matches if the competition is complete or go to the teams management page.</p>
						<div className={style.buttonsContainer}>
							<Button type="button" variant="primary" onClick={() => {navigate(`/competitions/${competition.id}/teams`)}} isDisabled={isSubmitting} isPending={isSubmitting}>Manage teams</Button>
							<Button type="button" variant="primary" onClick={() => {setIsGenerateModalOpen(true)}} isDisabled={isSubmitting} isPending={isSubmitting}>Generate Matches</Button>
						</div>
					</div>
				)}
				{isPending && <Loader />}
				{isError && <ErrorText>{error?.message ?? 'Something went wrong. Please try again.'}</ErrorText>}
			</div>
			{isGenerateModalOpen && <Modal
				title='Generate matches'
				description={`Set a starting date for ${competition.name}.`}
				submitText='Generate'
				isSubmitting={isSubmitting}
				onSubmit={handleSubmit(generateMatches)}
				onCancel={() => setIsGenerateModalOpen(false)}
			>
				<Form disabled={isSubmitting}>
					<TextInput
						id='start_date'
						label='Start date'
						type='date'
						{...register('start_date', { required: 'Start date is required' })}
						error={fieldErrorToMessage(errors.start_date)}
					/>
				</Form>
			</Modal>}
		</section>
	);
}

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth/useAuth';
import { apiRequest } from '../../api/apiClient';
import type { Competition, PaginatedData } from '../../types/api';
import styles from './competitions.module.scss';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react';
import clsx from 'clsx';
import CompetitionCard from './components/competition-card/competition-card';
import Pagination from '../../components/pagination/pagination';
import CreateCompetition from './components/create-competition/create-competition';
import { useNavigate } from 'react-router';

export default function Competitions() {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [page, setPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(11);

	const params = new URLSearchParams({
		page: page.toString(),
		per_page: perPage.toString(),
	});

	const paginatedCompetitions = useQuery({
		queryKey: ['competitions', page, perPage],

		queryFn: () =>
			apiRequest<PaginatedData<Competition>>(
				`competitions?${params.toString()}`,
			),

		enabled: isAuthenticated,
	});

	const competitions = paginatedCompetitions.data?.data;
	const links = paginatedCompetitions.data?.links;
	const meta = paginatedCompetitions.data?.meta;

	return (
		<div className={styles.page}>
			<div className={styles.content}>
				<ChevronLeft
					className={clsx(
						styles.chevron,
						paginatedCompetitions.isPending || links.prev === null
							? styles.chevronDisabled
							: '',
					)}
					onClick={() => setPage(Math.max(page - 1, 1))}
				/>
				<div className={styles.competitionContainer}>
					{competitions?.map((c) => (
						<CompetitionCard
							key={c.id}
							competition={c}
							onClick={() => navigate(`/competitions/${c.id}`)}
						/>
					))}
					<div
						onClick={() => setIsModalOpen(true)}
						className={clsx(styles.competitionCard, styles.addCompetition)}
					>
						<CirclePlus className={styles.plus} />
					</div>
				</div>
				<ChevronRight
					className={clsx(
						styles.chevron,
						paginatedCompetitions.isPending || links.next === null
							? styles.chevronDisabled
							: '',
					)}
					onClick={() => setPage(Math.min(page + 1, meta?.last_page || 1))}
				/>
			</div>
			<div className={styles.paginationContainer}>
				<div className={styles.paginationElement}>
					{meta?.last_page > 1 && (
						<Pagination
							meta={meta}
							onLinkClicked={(link) => {
								const url = new URL(link.url);
								const page = url.searchParams.get('page');
								if (page) {
									setPage(parseInt(page));
								}
							}}
							disableChevrons={true}
						/>
					)}
				</div>
			</div>
			{isModalOpen && <CreateCompetition setIsModalOpen={setIsModalOpen} />}
		</div>
	);
}

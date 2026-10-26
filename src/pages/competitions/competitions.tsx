import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth/useAuth';
import { apiRequest } from '../../api/apiClient';
import type { Competition, PaginatedData } from '../../types/api';
import styles from './competitions.module.scss';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react';
import CompetitionCard from './components/competition-card/competition-card';
import Pagination from '../../components/pagination/pagination';
import CreateCompetition from './components/create-competition/create-competition';
import { useNavigate } from 'react-router';
import Card from '../../components/card/card';
import Loader from '../../components/loader/loader';
import ClickableIcon from '../../components/clickable-icon/clickable-icon';

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
				<ClickableIcon
					icon={ChevronLeft}
					label='Previous page'
					variant='filled'
					isDisabled={paginatedCompetitions.isPending || !links?.prev}
					onClick={() => setPage(Math.max(page - 1, 1))}
				/>
				<div className={styles.competitionContainer}>
					{paginatedCompetitions.isPending && (
						<div className={styles.loadingBox}>
							<Loader />
						</div>
					)}
					{competitions?.map((c) => (
						<CompetitionCard
							key={c.id}
							competition={c}
							onClick={() => navigate(`/competitions/${c.id}`)}
						/>
					))}
					<Card
						onClick={() => setIsModalOpen(true)}
						className={styles.addCompetition}
					>
						<CirclePlus className={styles.plus} />
					</Card>
				</div>
				<ClickableIcon
					icon={ChevronRight}
					label='Next page'
					variant='filled'
					isDisabled={paginatedCompetitions.isPending || !links?.next}
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

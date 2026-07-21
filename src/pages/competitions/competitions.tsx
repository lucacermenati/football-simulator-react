import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth/useAuth';
import { apiRequest } from '../../api/apiClient';
import type { Competition, PaginatedData } from '../../types/api';
import styles from './Competitions.module.scss';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react';

export default function Competitions() {
	const { token } = useAuth();

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
				{
					token,
				},
			),

		enabled: !!token,
	});

	const competitions = paginatedCompetitions.data?.data;
	const links = paginatedCompetitions.data?.links;
	const meta = paginatedCompetitions.data?.meta;

	return (
		<div className={styles.page}>
			<div className={styles.content}>
				<ChevronLeft className={styles.addCompetitionIcon} />
				<div className={styles.competitionContainer}>
					{competitions?.map((c) => (
						<div key={c.id} className={styles.competitionCard}>
							<div className={styles.logoContainer}>
								<img
									className={styles.competitionLogo}
									src={c.logo}
									alt={`${c.name} logo`}
								/>
							</div>

							<div className={styles.competitionName}>{c.name}</div>
						</div>
					))}
					<div className={`${styles.competitionCard} ${styles.addCompetition}`}>
						<CirclePlus className={styles.addCompetitionIcon} />
					</div>
				</div>
				<ChevronRight className={styles.addCompetitionIcon} />
			</div>
			<div className={styles.paginationContainer}>
				<div className={styles.paginationElement}>HERE GOES PAGINATION</div>
			</div>
		</div>
	);
}

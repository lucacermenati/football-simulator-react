import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/useAuth';
import { apiRequest } from '../api/apiClient';
import type { Competition } from '../types/api';
import styles from './Competitions.module.scss';
import { useState } from 'react';

export default function Competitions() {
	const { token } = useAuth();

	const [page, setPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(8);

	const params = new URLSearchParams({
		page: page.toString(),
		per_page: perPage.toString(),
	});

	const competitions = useQuery({
		queryKey: ['competitions', page, perPage],

		queryFn: () =>
			apiRequest<Competition[]>(`competitions?${params.toString()}`, {
				token,
			}),

		enabled: !!token,
	});

	return (
		<section className={styles.container}>
			{competitions?.data?.data?.map((c) => (
				<div key={c.id}>
					<p>{c.name}</p>
				</div>
			))}
		</section>
	);
}

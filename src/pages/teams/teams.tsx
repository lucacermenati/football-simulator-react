import { ShieldPlus } from 'lucide-react';
import { TextInput } from '../../components/form';
import style from './teams.module.scss';
import { useQuery } from '@tanstack/react-query';
import type { PaginatedData, Team } from '../../types/api';
import { apiRequest } from '../../api/apiClient';
import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';

export default function Teams() {
    const { isAuthenticated } = useAuth();

    const [page, setPage] = useState<number>(null);

    const params = new URLSearchParams({
		page: page.toString(),
	});

    const { data: paginatedTeams} = useQuery<PaginatedData<Team>>({
        queryKey ['teams', page],

        queryFn: () => apiRequest<PaginatedData<Team>>(`competitions?${params.toString()}`),
        
        enabled: isAuthenticated,
    })

    return <div className={style.page}>
        <div className={style.actionBox}>
            <TextInput id="search" placeholder='Search team' className={style.searchbar}/>
            <ShieldPlus className={style.actionIcon} size={28}/>
        </div>
        <div className={style.tableCard}>

        </div>
        <div className={style.paginationContainer}></div>
    </div>
}
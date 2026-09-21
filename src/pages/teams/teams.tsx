import { Edit, Eye, PlusCircle, ShieldPlus, Trash } from 'lucide-react';
import { TextInput } from '../../components/form';
import style from './teams.module.scss';
import { useQuery } from '@tanstack/react-query';
import type { PaginatedData, Team } from '../../types/api';
import { apiRequest } from '../../api/apiClient';
import { useAuth } from '../../auth/useAuth';
import { useSearchParams } from 'react-router';
import clsx from 'clsx';
import ImageBox from '../../components/image-box/image-box';

export default function Teams() {
    const [searchParams, setSearchParams] = useSearchParams();

    const { isAuthenticated } = useAuth();

    const pageParam = searchParams.get('day');
    const page = pageParam ? parseInt(pageParam): undefined;

    const search = searchParams.get('search');

    const { data: paginatedTeams} = useQuery<PaginatedData<Team>>({
        queryKey: ['teams', page, search],

        queryFn: () => {
            const baseApiUrl = 'teams';
            const params = new URLSearchParams();
            
            params.set('per_page', '20');

            if (page) params.set('page', page.toString());

            if (search) params.set('search', search);
            
            const queryString = params.toString();

            const url = queryString
                ? `${baseApiUrl}?${queryString}`
                : baseApiUrl;

            return apiRequest<PaginatedData<Team>>(url);
        },

        enabled: isAuthenticated,
    })

    return <div className={style.page}>
        <div className={style.actionBox}>
            <TextInput id="search" placeholder='Search team' className={style.searchbar}/>
            <ShieldPlus className={style.actionIcon} size={28}/>
        </div>
        <div className={clsx(style.tableCard, style.teamsTable)}>
            {paginatedTeams?.data && paginatedTeams?.data.map((team) => 
                <div className={style.teamRow} key={team.id}>
                    <div className={style.teamColumn}>
                        <ImageBox className={style.imageBoxSize} src={team.logo} alt={team.name} />
                        <div>{team.name}</div>
                    </div>
                    <div className={style.actionColumn}>
                        <Eye className={style.icon} onClick={() => console.log("GO TO TEAM PAGE")} />
                        <Edit className={style.icon} onClick={() => console.log("OPEN EDIT TEAM")} />
                        <PlusCircle className={style.icon} onClick={() => console.log("OPEN ADD TEAM")} />
                        <Trash className={style.destructiveIcon} onClick={() => console.log("OPEN DELETE TEAM CONFIRMATION")} />
                    </div>
                </div>
            )}
        </div>
        <div className={style.paginationContainer}></div>
    </div>
}
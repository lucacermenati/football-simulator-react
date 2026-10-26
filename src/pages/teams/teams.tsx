import { Edit, Eye, PlusCircle, ShieldPlus, Trash } from 'lucide-react';
import { TextInput } from '../../components/form';
import style from './teams.module.scss';
import { useQuery } from '@tanstack/react-query';
import type { PaginatedData, Team } from '../../types/api';
import { apiRequest } from '../../api/apiClient';
import { useAuth } from '../../auth/useAuth';
import { useNavigate, useSearchParams } from 'react-router';
import TeamLogo from '../../components/team-logo/team-logo';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';
import TeamEdit from './components/team-edit/team-edit';
import TeamCreate from './components/team-create/team-create';
import TeamDelete from './components/team-delete/team-delete';
import AddTeam from './components/team-add/team-add';
import Card from '../../components/card/card';
import Loader from '../../components/loader/loader';
import ClickableIcon from '../../components/clickable-icon/clickable-icon';
import ErrorText from '../../components/form/error-text/error-text';

export default function Teams() {
    const [searchParams, setSearchParams] = useSearchParams();

    const { isAuthenticated } = useAuth();

    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam): undefined;

    const search = searchParams.get('search');
    const [searchInput, setSearchInput] = useState<string>(search ?? "");
    const [debouncedSearch] = useDebounce(searchInput, 500);

    const navigate = useNavigate();

    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
    const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
    const [isDeleteTeamModalOpen, setIsDeleteTeamModalOpen] = useState(false);
    const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);

    const openEditTeamModal = (team: Team) => {
        setSelectedTeam(team);
        setIsEditTeamModalOpen(true);
    };

    const openDeleteTeamModal = (team: Team) => {
        setSelectedTeam(team);
        setIsDeleteTeamModalOpen(true);
    };

    const openAddTeamModal = (team: Team) => {
        setSelectedTeam(team);
        setIsAddTeamModalOpen(true);
    }

    const { data: paginatedTeams, isPending, isError, error } = useQuery<PaginatedData<Team>>({
        queryKey: ['teams', page, search],

        queryFn: () => {
            const baseApiUrl = 'teams';
            const params = new URLSearchParams();

            if (page) params.set('page', page.toString());

            if (debouncedSearch) params.set('search', debouncedSearch);
            
            const queryString = params.toString();

            const url = queryString
                ? `${baseApiUrl}?${queryString}`
                : baseApiUrl;

            return apiRequest<PaginatedData<Team>>(url);
        },

        enabled: isAuthenticated,
    })

    useEffect(() => {
        setSearchParams((params) => {
            const newParams = new URLSearchParams(params);

            if (debouncedSearch) {
                newParams.set('search', debouncedSearch);
            } else {
                newParams.delete('search');
            }

            newParams.delete('page');

            return newParams;
        });
    }, [debouncedSearch, setSearchParams]);

    return <div className={style.page}>
        <div className={style.actionBox}>
            <TextInput 
                id="search" 
                placeholder='Search team' 
                className={style.searchbar} 
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
            />
            <ClickableIcon
                icon={ShieldPlus}
                label="Create team"
                size="lg"
                onClick={() => setIsCreateTeamModalOpen(true)}
            />
        </div>
        <Card className={style.teamsTable}>
            {isPending && (
                <div className={style.statusRow}>
                    <Loader />
                </div>
            )}
            {isError && (
                <div className={style.statusRow}>
                    <ErrorText>{error?.message}</ErrorText>
                </div>
            )}
            {paginatedTeams?.data && paginatedTeams?.data.map((team) => 
                <div className={style.teamRow} key={team.id}>
                    <div className={style.teamColumn}>
                        <TeamLogo team={team} />
                        <div 
                            className={style.teamName} 
                            onClick={() => navigate(`/teams/${team.id}`)}>
                                {team.name}
                        </div>
                    </div>
                    <div className={style.actionColumn}>
                        <ClickableIcon
                            icon={Eye}
                            label="View team"
                            onClick={() => navigate(`/teams/${team.id}`)}
                        />
                        <ClickableIcon
                            icon={Edit}
                            label="Edit team"
                            onClick={() => openEditTeamModal(team)}
                        />
                        <ClickableIcon
                            icon={PlusCircle}
                            label="Add team to competition"
                            onClick={() => openAddTeamModal(team)}
                        />
                        <ClickableIcon
                            icon={Trash}
                            label="Delete team"
                            isDestructive
                            onClick={() => openDeleteTeamModal(team)}
                        />
                    </div>
                </div>
            )}
        </Card>
        <div className={style.paginationContainer}></div>
        {isCreateTeamModalOpen &&
            <TeamCreate 
                onCancel={() => {
                    setSelectedTeam(null); 
                    setIsCreateTeamModalOpen(false);
                }}
            />
        }
        {isEditTeamModalOpen && selectedTeam &&
            <TeamEdit team={selectedTeam} 
                onCancel={() => {
                    setSelectedTeam(null); 
                    setIsEditTeamModalOpen(false);
                }}
            />
        }
        {isDeleteTeamModalOpen && selectedTeam &&
            <TeamDelete team={selectedTeam}
                onCancel={() => {
                    setSelectedTeam(null);
                    setIsDeleteTeamModalOpen(false);
                }}
            />
        }
        {isAddTeamModalOpen && selectedTeam &&
            <AddTeam team={selectedTeam}
                onCancel={() => {
                    setSelectedTeam(null);
                    setIsAddTeamModalOpen(false);
                }}
            />
        }
    </div>
}
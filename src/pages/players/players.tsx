import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { PaginatedData, Player } from "../../types/api";
import { apiRequest } from "../../api/apiClient";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import style from "./players.module.scss";
import clsx from "clsx";
import { TextInput } from "../../components/form";
import { Edit, Eye, PlusCircle, Trash, UserRoundPlus, WandSparkles } from "lucide-react";
import PositionBadge from "../../components/position-badge/position-badge";
import NationalityBadge from "../../components/nationality-badge/nationality-badge";
import ImageBox from "../../components/image-box/image-box";
import FreeAgentSwitch from "../../components/free-agent-switch/free-agent-switch";
import PositionSelector from "../../components/position-selector/position-selector";
import PlayerDelete from "./components/player-delete/player-delete";
import PlayerCreate from "./components/player-create/player-create";
import PlayerEdit from "./components/player-edit/player-edit";
import NationalitySelector from "../../components/nationality-selector/nationality-selector";

export default function Players() {
    const { isAuthenticated } = useAuth();

    const [queryParams, setQueryParams] = useSearchParams();

    const navigate = useNavigate();

    const page = queryParams.get("page");
    const position = queryParams.get("position");
    const free = queryParams.get("free");
    const nationality = queryParams.get("nationality");

    const search = queryParams.get('search');
    const [searchInput, setSearchInput] = useState<string>(search ?? "");
    const [debouncedSearch] = useDebounce(searchInput, 500);

    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [isCreatePlayerModalOpen, setIsCreatePlayerModalOpen] = useState(false);
    const [isEditPlayerModalOpen, setIsEditPlayerModalOpen] = useState(false);
    const [isDeletePlayerModalOpen, setIsDeletePlayerModalOpen] = useState(false);

    const openEditPlayerModal = (player: Player) => {
        setSelectedPlayer(player);
        setIsEditPlayerModalOpen(true);
    };

    const openDeletePlayerModal = (player: Player) => {
        setSelectedPlayer(player);
        setIsDeletePlayerModalOpen(true);
    };

    const {
        data: paginatedPlayers,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: [
            "players",
            page,
            debouncedSearch,
            position,
            free,
            nationality,
        ],
        queryFn: () => {
            const baseApiUrl = "players";
            const params = new URLSearchParams();
    
            if (page) params.set("page", page.toString());
            if (search) params.set("search", debouncedSearch);
            if (position) params.set("position", position);
            if (free) params.set("free", free);
            if (nationality) params.set("nationality", nationality);

            const queryString = params.toString();

            const url = queryString
                ? `${baseApiUrl}?${queryString}`
                : baseApiUrl;

            return apiRequest<PaginatedData<Player>>(url);
        },
            
        enabled: isAuthenticated,
    });

    useEffect(() => {
        setQueryParams((params) => {
            const newParams = new URLSearchParams(params);

            if (debouncedSearch) {
                newParams.set('search', debouncedSearch);
            } else {
                newParams.delete('search');
            }

            newParams.delete('page');

            return newParams;
        });
    }, [
        debouncedSearch,
        free,
        position,
        nationality,
        setQueryParams
    ]);

    return (
        <div className={style.page}>
            <div className={style.actionBox}>
                <div className={style.filtersBox}>
                    <TextInput
                        id="search"
                        placeholder='Search players' 
                        className={style.searchbar} 
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                    />
                    <FreeAgentSwitch value={free === "1"} onToggle={() => {
                            setQueryParams((params) => {
                            const newParams = new URLSearchParams(params);

                            if (free) {
                                newParams.delete('free');
                            } else {
                                newParams.set('free', "1");
                            }

                            newParams.delete('page');

                            return newParams;
                        });
                    }}/>
                    <PositionSelector value={position} onSelect={(selectedPosition) => {
                            setQueryParams((params) => {
                                const newParams = new URLSearchParams(params);

                                if (position === selectedPosition) {
                                    newParams.delete('position');
                                } else {
                                    newParams.set('position', selectedPosition);
                                }

                                newParams.delete('page');

                                return newParams;
                            })
                        }
                    }/>
                    <NationalitySelector 
                        value={nationality} 
                        search={debouncedSearch} 
                        position={position} 
                        free={free} 
                        onSelect={(selectedNationality) => console.log('I am selecting ' . selectedNationality)}
                    />
                </div>
                <div className={style.createBox}>
                    <UserRoundPlus 
                        onClick={() => setIsCreatePlayerModalOpen(true)}
                        className={style.actionIcon} 
                        size={28}
                    />
                    <WandSparkles 
                        onClick={() => console.log("Generate player")}
                        className={style.actionIcon} 
                        size={28}
                    />
                </div>
            </div>
            <div className={clsx(style.tableCard, style.playersTable)}>
                {paginatedPlayers?.data && paginatedPlayers?.data.map((player) => 
                    <div className={style.playerRow} key={player.id}>
                        <div className={style.playerColumn}>
                            <NationalityBadge nationality={player.nationality} className={style.badge} />
                            <PositionBadge position={player.position} className={style.badge} /> 
                            <div 
                                className={style.playerName} 
                                onClick={() => navigate(`/players/${player.id}`)}>
                                    {player.full_name}
                            </div>
                        </div>
                        <div className={style.actionColumn}>
                            { player.team === null 
                                ? <PlusCircle 
                                    className={style.icon} 
                                    onClick={() => console.log("Add player to team")} 
                                /> 
                                : <ImageBox 
                                    className={style.imageBoxSize}
                                    src={player.team.logo} 
                                    alt={player.team.name} 
                                />
                            }
                        </div>
                        <div className={style.actionColumn}>
                            <Eye 
                                className={style.icon} 
                                onClick={() => navigate(`/players/${player.id}`)} 
                            />
                            <Edit
                                className={style.icon} 
                                onClick={() => openEditPlayerModal(player)} 
                            />
                            <Trash
                                className={style.destructiveIcon} 
                                onClick={() => openDeletePlayerModal(player)} 
                            />
                        </div>
                    </div>
                )}
            </div>
            {isCreatePlayerModalOpen &&
                <PlayerCreate
                    onCancel={() => {
                        setSelectedPlayer(null);
                        setIsCreatePlayerModalOpen(false);
                    }}
                />
            }
            {isEditPlayerModalOpen && selectedPlayer &&
                <PlayerEdit player={selectedPlayer}
                    onCancel={() => {
                        setSelectedPlayer(null);
                        setIsEditPlayerModalOpen(false);
                    }}
                />
            }
            {isDeletePlayerModalOpen && selectedPlayer &&
                <PlayerDelete player={selectedPlayer}
                    onCancel={() => {
                        setSelectedPlayer(null);
                        setIsDeletePlayerModalOpen(false);
                    }}
                />
            }
        </div>
    );
}
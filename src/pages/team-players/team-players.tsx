import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { Player } from "../../types/api";
import { apiRequest } from "../../api/apiClient";
import style from "./team-players.module.scss";
import { Eye, MinusCircle } from "lucide-react";
import PositionBadge from "../../components/position-badge/position-badge";
import NationalityBadge from "../../components/nationality-badge/nationality-badge";
import Card from "../../components/card/card";
import Loader from "../../components/loader/loader";
import ClickableIcon from "../../components/clickable-icon/clickable-icon";
import ErrorText from "../../components/form/error-text/error-text";

export default function TeamPlayers() {
    const { teamId } = useParams();
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();

    const {
        data: players,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ["teams", teamId, "players"],
        queryFn: () => apiRequest<Player[]>(`teams/${teamId}/players`),
        enabled: isAuthenticated && !!teamId,
    });

    const age = (birthDate: string) => {
        const birth = new Date(birthDate);
        const today = new Date();

        let years = today.getFullYear() - birth.getFullYear();

        const hasBirthdayPassed =
            today.getMonth() > birth.getMonth() ||
            (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

        if (!hasBirthdayPassed) {
            years--;
        }

        return years;
    };

    return (
        <div className={style.page}>
            <Card className={style.playersTable}>
                <div className={style.playersHeaderRow}>
                    <div>Name</div>
                    <div>Age</div>
                    <div>Nationality</div>
                    <div></div>
                </div>
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
                {players && players.map((player) => 
                    <div className={style.playerRow} key={player.id}>
                        <div className={style.playerColumn}>
                            <div className={style.playerNumber}>{player.number}</div>
                            <PositionBadge position={player.position} className={style.badge} /> 
                            <div 
                                className={style.playerName} 
                                onClick={() => navigate(`/players/${player.id}`)}>
                                    {player.full_name}
                            </div>
                        </div>
                        <div className={style.ageColumn}>
                            {age(player.birth_date)}
                        </div>
                        <div className={style.nationalityColumn}>
                            <NationalityBadge nationality={player.nationality} className={style.badge} />
                        </div>
                        <div className={style.actionColumn}>
                            <ClickableIcon
                                icon={Eye}
                                label="View player"
                                onClick={() => navigate(`/players/${player.id}`)}
                            />
                            <ClickableIcon
                                icon={MinusCircle}
                                label="Remove player from team"
                                isDestructive
                                onClick={() => console.log("Remove player from team")}
                            />
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

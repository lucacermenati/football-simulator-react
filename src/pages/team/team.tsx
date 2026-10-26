import { useQuery } from "@tanstack/react-query";
import { useTeam } from "../../hooks/useTeam";
import type { CompetitionPosition } from "../../types/api";
import style from "./team.module.scss";
import { apiRequest } from "../../api/apiClient";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import Card from "../../components/card/card";
import Loader from "../../components/loader/loader";
import ClickableIcon from "../../components/clickable-icon/clickable-icon";
import ErrorText from "../../components/form/error-text/error-text";

export default function TeamPage() {
    const { team } = useTeam();
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();

    const { data: competitions, isPending, isError, error } = useQuery({
        queryKey: ['teams', team.id, 'competitions'],
        queryFn: () => apiRequest<CompetitionPosition[]>(`teams/${team.id}/competitions`),
        enabled: isAuthenticated && !!team.id,
    });

    const suffix = (position: number) => {
        if (position % 10 === 1 && position % 100 !== 11) {
            return 'st';
        } else if (position % 10 === 2 && position % 100 !== 12) {
            return 'nd';
        } else if (position % 10 === 3 && position % 100 !== 13) {
            return 'rd';
        } else {
            return 'th';
        }
    };

    return <section className={style.cardContainer}>
        <Card>{team.history}</Card>
        <Card>
            <div className={style.infoGrid}>
                <div className={style.title}>Official colors</div>
                <div className={style.colorsBox}>
                    <div className={style.colorBall} style={{ '--ball-color': team.first_color } as React.CSSProperties}/>
                    <div className={style.colorBall} style={{ '--ball-color': team.second_color } as React.CSSProperties}/>
                </div>
                <div className={style.title}>Year of foundation</div>
                <div>{team.year_of_foundation}</div>
                <div className={style.title}>Stadium</div>
                <div>{team.stadium}</div>
            </div>
        </Card>
        {isPending && (
            <Card className={style.statusCard}>
                <Loader />
            </Card>
        )}
        {isError && (
            <Card className={style.statusCard}>
                <ErrorText>{error?.message}</ErrorText>
            </Card>
        )}
        {competitions && competitions.length > 0 && <Card>
            {competitions.map(competition => (
                <div 
                    key={competition.id} 
                    onClick={() => navigate(`/competitions/${competition.id}/standings`)} 
                    className={style.competitionItem}
                >
                    <span>{`${competition.position}${suffix(competition.position)} ${competition.name}`}</span>
                    <ClickableIcon
                        icon={ArrowRight}
                        label="Go to standings"
                        onClick={() => navigate(`/competitions/${competition.id}/standings`)}
                    />
                </div>
            ))}
        </Card>}
    </section>;
}
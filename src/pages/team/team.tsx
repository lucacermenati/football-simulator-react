import { useQuery } from "@tanstack/react-query";
import { useTeam } from "../../hooks/useTeam";
import type { Competition } from "../../types/api";
import style from "./team.module.scss";
import { apiRequest } from "../../api/apiClient";
import { useAuth } from "../../auth/useAuth";

export default function TeamPage() {
    const { team } = useTeam();
    const { isAuthenticated } = useAuth();

    const { data: competitions, isPending, isError, error } = useQuery({
        queryKey: ['teams', team.id, 'competitions'],
        queryFn: () => apiRequest<Competition[]>(`teams/${team.id}/competitions`),
        enabled: isAuthenticated && !!team.id,
    });

    return <section className={style.cardContainer}>
        <div className={style.card}>{team.history}</div>
        <div className={style.card}>{JSON.stringify(competitions)}</div>
    </section>;
}
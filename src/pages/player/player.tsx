import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../api/apiClient";
import { useAuth } from "../../auth/useAuth";
import type { Player } from "../../types/api";
import Loader from "../../components/loader/loader";
import ErrorText from "../../components/form/error-text/error-text";
import style from "./player.module.scss";

export default function PlayerPage() {
    const { playerId } = useParams();
    const { isAuthenticated } = useAuth();

    const {
        data: player,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ['players', playerId],
        queryFn: () => apiRequest<Player>(`players/${playerId}`),
        enabled: isAuthenticated && !!playerId,
    });

    if (isPending) {
        return <Loader />;
    }

    if (isError) {
        return (
            <ErrorText>
                {error?.message || 'Something went wrong. Please try again.'}
            </ErrorText>
        );
    }

    return (
        <section className={style.page}>
            <div className={style.card}>
                <pre className={style.json}>{JSON.stringify(player, null, 2)}</pre>
            </div>
        </section>
    );
}

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../api/apiClient";
import { useAuth } from "../../auth/useAuth";
import type { Team } from "../../types/api";
import { useParams } from "react-router";

export default function TeamPage() {
    const { teamId } = useParams();
    const { isAuthenticated } = useAuth();

    const { data: team, isPending, isError, error } = useQuery({
        queryKey: ['teams', teamId],
        queryFn: () => apiRequest<Team>(`teams/${teamId}`),
        enabled: isAuthenticated && !!teamId,
    });

    return <pre>{JSON.stringify(team, null, 2)}</pre>;
}
import { useSearchParams } from "react-router";
import { useAuth } from "../../auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { PaginatedData, Player } from "../../types/api";
import { apiRequest } from "../../api/apiClient";
import { useDebounce } from "use-debounce";
import { useState } from "react";

export default function Players() {
    const { isAuthenticated } = useAuth();

    const [queryParams, setQueryParams] = useSearchParams();

    const page = queryParams.get("page");
    const position = queryParams.get("position");
    const free = queryParams.get("free");
    const nationality = queryParams.get("nationality");

    const search = queryParams.get('search');
    const [searchInput, setSearchInput] = useState(search);
    const [debouncedSearch] = useDebounce(searchInput, 500);

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

    return (
        <div>
            <h1>Players</h1>
            <pre>{JSON.stringify(paginatedPlayers, null, 2)}</pre>
        </div>
    );
}
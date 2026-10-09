import { useQuery } from "@tanstack/react-query";
import type { CountNationality } from "../../types/api";
import style from "./nationality-selector.module.scss";
import { apiRequest } from "../../api/apiClient";
import { useAuth } from "../../auth/useAuth";
import NationalityBadge from "../nationality-badge/nationality-badge";
import { Ellipsis, RectangleEllipsis } from "lucide-react";

export default function NationalitySelector({ 
    value,
    search,
    position,
    free,
    onSelect
} : { 
    value: string | null,
    search: string | null,
    position: string | null,
    free: string | null,
    onSelect: (selectedNationality: string) => void
} ) {
    const {isAuthenticated} = useAuth();

    const {data: nationalities} = useQuery<CountNationality[]>({
        queryKey: ['players', 'nationalities'],
        queryFn: () => apiRequest<CountNationality[]>('players/nationalities'),
        enabled: !!isAuthenticated
    })

    const topNationalities = nationalities?.slice(0, 3) ?? [];

    return <div className={style.selector}>
        {topNationalities?.map((nationality) => 
            <NationalityBadge key={nationality.code} nationality={nationality.code}/>
        )}
        <div>
            <RectangleEllipsis size={24} />
        </div>
    </div>
}
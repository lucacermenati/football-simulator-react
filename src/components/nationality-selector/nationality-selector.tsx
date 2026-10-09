import { useQuery } from "@tanstack/react-query";
import type { CountNationality } from "../../types/api";
import style from "./nationality-selector.module.scss";
import { apiRequest } from "../../api/apiClient";
import { useAuth } from "../../auth/useAuth";
import NationalityBadge from "../nationality-badge/nationality-badge";
import { Ellipsis, RectangleEllipsis } from "lucide-react";
import Modal from "../modal/modal";
import { useState } from "react";
import clsx from "clsx";

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

    const [isNationalityModalOpen, setIsNationalityModalOpen] = useState<boolean>(false);
    const [selectedNationality, setSelectedNationality] = useState<string>("");

    const {data: nationalities} = useQuery<CountNationality[]>({
        queryKey: ['players', 'nationalities'],
        queryFn: () => apiRequest<CountNationality[]>('players/nationalities'),
        enabled: !!isAuthenticated
    })

    const topNationalities = nationalities?.slice(0, 3) ?? [];

    return <div className={style.selector}>
        {topNationalities?.map((nationality) => 
            <div 
                key={nationality.code}  
                onClick={() => onSelect(nationality.code)} 
                className={clsx(style.nationalityOption, nationality.code === value && style.selectedNationality)}
            >
                <NationalityBadge 
                    nationality={nationality.code}
                />
            </div>
        )}
        <div>
            <RectangleEllipsis 
                size={24} 
                className={style.moreIcon} 
                onClick={() => setIsNationalityModalOpen(true)}
            />
        </div>
        { isNationalityModalOpen && 
            <Modal
                title="Select a nationality"
                onCancel={() => setIsNationalityModalOpen(false)}
                onSubmit={() => {onSelect(selectedNationality); setIsNationalityModalOpen(false);}}
            >
                <div className={style.nationalityGrid}>
                    {nationalities?.map((nationality) => 
                        <div
                            key={nationality.code}
                            onClick={() => setSelectedNationality(nationality.code)}
                            className={clsx(style.nationalityOption, nationality.code === selectedNationality && style.selectedNationality)}
                        >
                            <NationalityBadge 
                                nationality={nationality.code}
                            />
                        </div>
                    )}
                </div>
            </Modal>
        }
    </div>
}
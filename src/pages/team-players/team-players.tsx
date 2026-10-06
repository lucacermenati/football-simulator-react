import { useParams } from 'react-router';
import style from './team-players.module.scss';
import { useAuth } from '../../auth/useAuth';
import { useQuery } from '@tanstack/react-query';
export default function TeamPlayers() {
    const { teamId } = useParams();
    const { isAuthenticated } = useAuth();

    const {data: players, isPending, isError, error} = useQuery({
        
    })

    return <section className={style.card}>
        <div className={style.playerTable}>
            <div>Player</div>
            <div>Nationality</div>
            <div>Age</div>
            <div></div>

            <div className={style.playerRow}>
                <div className={style.playerColumn}>
                    <div></div>
                </div>
            </div>

        </div>
    </section>;
}
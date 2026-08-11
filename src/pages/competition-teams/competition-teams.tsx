import { useQuery } from '@tanstack/react-query';
import { useCompetition } from '../../hooks/useCompetition';
import style from './competition-teams.module.scss';
import { apiRequest } from '../../api/apiClient';
import type { Team } from '../../types/api';
import { useAuth } from '../../auth/useAuth';
import ImageBox from '../../components/image-box/image-box';
import { Edit, Eye, Minus, MinusCircle, PlusCircle, Settings, Trash } from 'lucide-react';
import clsx from 'clsx';
import Loader from '../../components/loader/loader';
import ErrorText from '../../components/form/error-text/error-text';

export default function CompetitionTeams() {
	const { competition } = useCompetition();
	const { isAuthenticated } = useAuth();

	const {
		data: teams,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ['competitions', competition?.id, 'teams'],
		queryFn: () => apiRequest<Team[]>(`competitions/${competition?.id}/teams`),
		enabled: isAuthenticated && !!competition?.id,
	});

	const content = () => {
		if (isPending) {
			return <div className={clsx(style.genericRow)}><Loader /></div>;
		}

		if (isError) {
			return <div>
				<ErrorText>{error?.message ?? 'Something went wrong. Please try again.'}</ErrorText>
			</div>;
		}

		if (teams.length === 0) {
			return <div className={clsx(style.genericRow, style.noTeamsFoundBox)}>
					<PlusCircle className={style.icon} />
			</div>;
		}

		return teams?.map((team) => {
			return <div key={team.id} className={style.teamsRow}>
				<div className={style.teamNameColumn}>
					<ImageBox src={team.logo} alt={team.name} className={style.imageBoxSize} />
					{team.name}
				</div>
				<div className={style.teamActionsColumn}>
					<Eye className={style.icon}/>
					<MinusCircle className={clsx(style.icon, style.destroyIcon)} />
				</div>
			</div>;
		});
	};

	return <section>
		<div className={style.mainActions}>
			<Settings className={style.icon} />
		</div>
		<div className={style.content}>
			<div className={style.teamsTable}>
				<div className={style.teamsHeaderRow}>
					<div>Team</div>
				</div>
				{content()}
			</div>
		</div>
	</section>;
}

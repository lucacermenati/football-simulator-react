import { useQuery } from '@tanstack/react-query';
import { useCompetition } from '../../hooks/useCompetition';
import style from './competition-teams.module.scss';
import { apiRequest } from '../../api/apiClient';
import type { Team } from '../../types/api';
import { useAuth } from '../../auth/useAuth';
import TeamLogo from '../../components/team-logo/team-logo';
import {
	Eye,
	MinusCircle,
	PlusCircle,
	ShieldPlus,
} from 'lucide-react';
import clsx from 'clsx';
import Loader from '../../components/loader/loader';
import ErrorText from '../../components/form/error-text/error-text';
import BulkAddCompetitionTeams from './components/bulk-add-competition-teams/bulk-add-competition-teams';
import { useState } from 'react';
import RemoveCompetitionTeam from './components/remove-competition-team/remove-competition-team';
import { useNavigate } from 'react-router';
import Card from '../../components/card/card';
import ClickableIcon from '../../components/clickable-icon/clickable-icon';

export default function CompetitionTeams() {
	const { competition } = useCompetition();
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
	const [isRemoveTeamModalOpen, setIsRemoveTeamModalOpen] = useState(false);
	const [selectedTeamForRemoval, setSelectedTeamForRemoval] =
		useState<Team | null>(null);

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
			return (
				<div className={clsx(style.genericRow)}>
					<Loader />
				</div>
			);
		}

		if (isError) {
			return (
				<div>
					<ErrorText>
						{error?.message ?? 'Something went wrong. Please try again.'}
					</ErrorText>
				</div>
			);
		}

		if (teams.length === 0) {
			return (
				<div className={clsx(style.genericRow, style.noTeamsFoundBox)}>
					<p>Click on the plus button to add teams to the competition</p>
					<ClickableIcon
						icon={PlusCircle}
						label='Add teams'
						isDisabled={isBulkAddModalOpen}
						onClick={() => setIsBulkAddModalOpen(true)}
					/>
				</div>
			);
		}

		return teams?.map((team) => {
			return (
				<div key={team.id} className={style.teamsRow}>
					<div className={style.teamNameColumn}>
						<TeamLogo team={team} size="sm" />
						{team.name}
					</div>
					<div className={style.teamActionsColumn}>
						<ClickableIcon
							icon={Eye}
							label='View team'
							onClick={() => navigate(`/teams/${team.id}`)}
						/>
						<ClickableIcon
							icon={MinusCircle}
							label='Remove team from competition'
							isDestructive
							onClick={() => {
								setSelectedTeamForRemoval(team);
								setIsRemoveTeamModalOpen(true);
							}}
						/>
					</div>
				</div>
			);
		});
	};

	return (
		<section>
			<div className={style.mainActions}>
				<ClickableIcon
					icon={ShieldPlus}
					label='Add teams'
					onClick={() => setIsBulkAddModalOpen(true)}
				/>
			</div>
			<Card>
				<div className={style.teamsTable}>
					<div className={style.teamsHeaderRow}>
						<div>Team</div>
					</div>
					{content()}
				</div>
			</Card>
			{isBulkAddModalOpen && (
				<BulkAddCompetitionTeams setIsModalOpen={setIsBulkAddModalOpen} />
			)}
			{isRemoveTeamModalOpen && (
				<RemoveCompetitionTeam
					team={selectedTeamForRemoval}
					setIsModalOpen={setIsRemoveTeamModalOpen}
				/>
			)}
		</section>
	);
}

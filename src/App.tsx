import { Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from './components/protected-route';
import AuthenticatedLayout from './layouts/authenticated-layout/authenticated-layout';
import Login from './pages/login/login';
import Profile from './pages/profile/profile';
import Competitions from './pages/competitions/competitions';
import NotFound from './pages/not-found/not-found';
import Register from './pages/register/register';
import CompetitionHome from './pages/competition-home/competition-home';
import CompetitionLayout from './layouts/competition-layout/competition-layout';
import NotAvailable from './pages/not-available/not-available';
import CompetitionStandings from './pages/competition-standings/competition-standings';
import CompetitionStatistics from './pages/competition-statistics/competition-statistics';
import CompetitionTeams from './pages/competition-teams/competition-teams';
import CompetitionMatches from './pages/competition-matches/competition-matches';
import Teams from './pages/teams/teams';
import Match from './pages/match/match';
import TeamPage from './pages/team/team';
import TeamLayout from './layouts/team-layout/team-layout';
import Players from './pages/players/players';

export default function App() {
	return (
		<Routes>
			<Route path='/login' element={<Login />} />
			<Route path='/register' element={<Register />} />

			<Route element={<ProtectedRoute />}>
				<Route element={<AuthenticatedLayout />}>
					<Route path='/competitions'>
						<Route index element={<Competitions />} />
						<Route path=':competitionId' element={<CompetitionLayout />}>
							<Route index element={<CompetitionHome />} />
							<Route path='standings' element={<CompetitionStandings />} />
							<Route path='statistics' element={<CompetitionStatistics />} />
							<Route path='matches'>
								<Route index element={<CompetitionMatches />} />
								<Route path=':matchId' element={<Match />} />
							</Route>
							<Route path='teams' element={<CompetitionTeams />} />
						</Route>
					</Route>
					<Route path='/teams' >
						<Route index element={<Teams />} />
						<Route path=':teamId' element={<TeamLayout />}>
							<Route index element={<TeamPage />} />
							<Route path='players' element={<NotAvailable />} />
							<Route path='on-the-field' element={<NotAvailable />} />
						</Route>
					</Route>
					<Route path='/players' element={<Players />} />
					<Route path='/profile' element={<Profile />} />
				</Route>
			</Route>

			<Route path='/' element={<Navigate to='/profile' replace />} />

			<Route path='*' element={<NotFound />} />
		</Routes>
	);
}

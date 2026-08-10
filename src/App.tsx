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
							<Route path='matches' element={<NotAvailable />} />
							<Route path='teams' element={<CompetitionTeams />} />
						</Route>
					</Route>
					<Route path='/teams' element={<NotAvailable />} />
					<Route path='/players' element={<NotAvailable />} />
					<Route path='/profile' element={<Profile />} />
				</Route>
			</Route>

			<Route path='/' element={<Navigate to='/profile' replace />} />

			<Route path='*' element={<NotFound />} />
		</Routes>
	);
}

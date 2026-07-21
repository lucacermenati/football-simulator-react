import { Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticatedLayout from './layouts/authenticated-layout/authenticated-layout';
import Login from './pages/login/login';
import Profile from './pages/profile/profile';
import Competitions from './pages/competitions/competitions';
import NotFound from './pages/not-found/not-found';

export default function App() {
	return (
		<Routes>
			<Route path='/login' element={<Login />} />

			<Route element={<ProtectedRoute />}>
				<Route element={<AuthenticatedLayout />}>
					<Route path='/profile' element={<Profile />} />

					<Route path='/competitions' element={<Competitions />} />
					<Route path='/teams' element={<NotFound />} />
					<Route path='/players' element={<NotFound />} />
				</Route>
			</Route>

			<Route path='/' element={<Navigate to='/profile' replace />} />

			<Route path='*' element={<NotFound />} />
		</Routes>
	);
}

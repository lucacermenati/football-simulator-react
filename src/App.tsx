import { Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from './components/protected-route';
import AuthenticatedLayout from './layouts/authenticated-layout/authenticated-layout';
import Login from './pages/login/login';
import Profile from './pages/profile/profile';
import Competitions from './pages/competitions/competitions';
import NotFound from './pages/not-found/not-found';
import Register from './pages/register/register';

export default function App() {
	return (
		<Routes>
			<Route path='/login' element={<Login />} />
			<Route path='/register' element={<Register />} />

			<Route element={<ProtectedRoute />}>
				<Route element={<AuthenticatedLayout />}>
					<Route path='/competitions'>
						<Route index element={<Competitions />} />
						<Route path=':id' element={<Profile />} />
					</Route>
					<Route path='/teams' element={<NotFound />} />
					<Route path='/players' element={<NotFound />} />
					<Route path='/profile' element={<Profile />} />
				</Route>
			</Route>

			<Route path='/' element={<Navigate to='/profile' replace />} />

			<Route path='*' element={<NotFound />} />
		</Routes>
	);
}

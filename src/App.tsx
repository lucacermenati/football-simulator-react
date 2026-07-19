import { Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFound';
import Competitions from './pages/Competitions';

export default function App() {
	return (
		<Routes>
			<Route path='/login' element={<LoginPage />} />

			<Route element={<ProtectedRoute />}>
				<Route element={<AuthenticatedLayout />}>
					<Route path='/profile' element={<ProfilePage />} />

					<Route path='/competitions' element={<Competitions />} />
					<Route path='/teams' element={<NotFoundPage />} />
					<Route path='/players' element={<NotFoundPage />} />
				</Route>
			</Route>

			<Route path='/' element={<Navigate to='/profile' replace />} />

			<Route path='*' element={<NotFoundPage />} />
		</Routes>
	);
}

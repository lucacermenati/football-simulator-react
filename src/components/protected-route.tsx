import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../auth/useAuth';

export default function ProtectedRoute() {
	const { isAuthenticated } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return (
			<Navigate
				to='/login'
				replace
				state={{
					from: {
						pathname: location.pathname,
					},
				}}
			/>
		);
	}

	return <Outlet />;
}

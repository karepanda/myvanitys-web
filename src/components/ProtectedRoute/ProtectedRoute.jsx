import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { VanitysContext } from '../../context';

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, authInitialized } = useContext(VanitysContext);

	if (!authInitialized) {
		return null;
	}

	if (!isAuthenticated) {
		return <Navigate to='/' replace />;
	}

	return children;
};

export { ProtectedRoute };

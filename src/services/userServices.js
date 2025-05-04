import { useFetch } from '../hooks/useFetch';

const API_URL = import.meta.env.VITE_API_URL;

const fetchUserData = () => {
	const { data, error, loading } = useFetch(
		`${API_URL}/dashboard`
	);

	if (loading) return 'Loading...';
	if (error) return `Error: ${error.message}`;

	return data;
};

export { fetchUserData };
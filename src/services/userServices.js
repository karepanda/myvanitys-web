import { useFetch } from '../hooks/useFetch';

const fetchUserData = () => {
	const { data, error, loading } = useFetch(
		'http://localhost:8080/myvanitys/dashboard'
	);

	if (loading) return 'Loading...';
	if (error) return `Error: ${error.message}`;

	return data;
};

export { fetchUserData };

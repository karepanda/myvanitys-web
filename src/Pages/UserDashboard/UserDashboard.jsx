import React, { useEffect, useContext } from 'react';
import { Navbar } from '../../components/Navbar/Navbar';
import { Dashboard } from '../../components/Dashboard/Dashboard';
import { useLocation } from 'react-router';
import { VanitysContext } from '../../context';

const UserDashboard = () => {
	const { getAccessToken, setApiResponse, apiResponse } =
		useContext(VanitysContext);

	const location = useLocation();

	useEffect(() => {
		const fetchData = async () => {
			const data = await getAccessToken();
			setApiResponse(data);
		};

		fetchData();
	}, []);

	if (apiResponse) {
		return (
			<>
				<Dashboard />
			</>
		);
	}
};

export { UserDashboard };

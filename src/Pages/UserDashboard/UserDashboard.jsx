import React, { useEffect, useContext } from 'react';
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
	}, [getAccessToken, setApiResponse]);

	if (apiResponse) {
		return (
			<>
				<Dashboard />
			</>
		);
	}
};

export { UserDashboard };

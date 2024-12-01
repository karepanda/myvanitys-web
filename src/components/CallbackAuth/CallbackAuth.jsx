import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router';
import { VanitysContext } from '../../context';

export const CallbackAuth = () => {
	const { getAccessToken, setApiResponse } = useContext(VanitysContext);

	const location = useLocation();

	useEffect(() => {
		const fetchData = async () => {
			const data = await getAccessToken();
			setApiResponse(data);
		};

		fetchData();
	}, []); // Se ejecuta solo al montar el componente
};

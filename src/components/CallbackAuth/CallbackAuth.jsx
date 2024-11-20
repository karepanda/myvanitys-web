import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { getAccessToken } from '../../services/getAuthUser';

export const CallbackAuth = () => {
	const location = useLocation();

	const queryParams = new URLSearchParams(location.search);

	const accessToken = queryParams.get('access_token');
	const tokenType = queryParams.get('token_type');
	const expiresIn = queryParams.get('expires_in');
	const state = queryParams.get('state');

	// Estado para manejar los datos retornados por getAccessToken
	const [apiResponse, setApiResponse] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getAccessToken();
			setApiResponse(data);
		};

		fetchData();
	}, []); // Se ejecuta solo al montar el componente

	return (
		<div>
			<h2>Callback Component</h2>
			<p>Access Token: {accessToken}</p>
			<p>Token Type: {tokenType}</p>
			<p>Expires In: {expiresIn}</p>
			<p>State: {state}</p>

			{/* Mostrar datos de la respuesta de la API */}
			{apiResponse ? (
				<div>
					<h3>API Response:</h3>
					<pre>{JSON.stringify(apiResponse, null, 2)}</pre>
				</div>
			) : (
				<p>Loading API data...</p>
			)}
		</div>
	);
};

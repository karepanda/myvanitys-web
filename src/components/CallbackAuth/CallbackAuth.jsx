import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router';
import { VanitysContext } from '../../context';

export const CallbackAuth = () => {
	const {
		getAccessToken,
		apiResponse,
		setApiResponse,
		accessToken,
		tokenType,
		expiresIn,
		state,
	} = useContext(VanitysContext);

	const location = useLocation();

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

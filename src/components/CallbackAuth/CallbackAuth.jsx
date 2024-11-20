import { data } from 'autoprefixer';
import React from 'react';
import { useLocation } from 'react-router';
import { getAccessToken } from '../../services/getAuthUser';

export const CallbackAuth = () => {
	const location = useLocation();

	const queryParams = new URLSearchParams(location.search);

	const accessToken = queryParams.get('access_token');
	const tokenType = queryParams.get('token_type');
	const expiresIn = queryParams.get('expires_in');
	const state = queryParams.get('state');

	window.onload = getAccessToken();

	return (
		<div>
			<h2>Callback Component</h2>
			<p>Access Token: {accessToken}</p>
			<p>Token Type: {tokenType}</p>
			<p>Expires In: {expiresIn}</p>
			<p>State: {state}</p>
		</div>
	);
};

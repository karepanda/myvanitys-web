import { v4 as uuidv4 } from 'uuid';

export const apiUtils = {
	getCommonHeaders: (token = null) => {
		const headers = {
			'Content-Type': 'application/json',
			'X-Request-Id': generateRequestId(),
			'X-Flow-Id': generateFlowId(),
			'User-Agent': 'MyVanitysApp/1.0',
			'Accept-Language': 'en-US',
		};

		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		return headers;
	},
};

// Funciones privadas
const generateRequestId = () => uuidv4();
const generateFlowId = () => uuidv4();

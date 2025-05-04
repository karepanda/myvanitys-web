const API_URL = import.meta.env.VITE_API_URL;

const createProduct = async (formData) => {
	const url = `${API_URL}/product`;

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer 4/P7q7W91`,
		'X-Request-Id': 'd2919d3f-6b2f-49f4-9dd5-efbbc9b1c8f8',
		'X-Flow-Id': '123e4567-e89b-12d3-a456-426614174000',
		'User-Agent': 'MyVanitysApp/1.0',
		'Accept-Language': 'en-US',
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(formData),
		});

		return await response.json();
	} catch (error) {
		console.error('Error creating product:', error);
		throw error;
	}
};

export { createProduct };
const decodeBase64Url = (value) => {
	const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
	const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
	return atob(padded);
};

export const getJwtExpiration = (token) => {
	try {
		const payload = token?.split('.')[1];
		if (!payload) {
			return null;
		}

		const { exp } = JSON.parse(decodeBase64Url(payload));
		return Number.isFinite(exp) ? exp * 1000 : null;
	} catch {
		return null;
	}
};

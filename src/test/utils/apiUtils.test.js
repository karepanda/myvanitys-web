import { describe, expect, it } from 'vitest';
import { apiUtils } from '../../utils/apiUtils';

describe('apiUtils.getCommonHeaders', () => {
	it('adds exactly one Bearer prefix to a raw JWT', () => {
		const headers = apiUtils.getCommonHeaders('test-token');

		expect(headers.Authorization).toBe('Bearer test-token');
	});

	it('omits the Authorization header when no token is provided', () => {
		const headers = apiUtils.getCommonHeaders();

		expect(headers).not.toHaveProperty('Authorization');
	});
});

import { describe, expect, it } from 'vitest';
import { getJwtExpiration } from '../../utils/jwt';

const encodePayload = (payload) =>
	btoa(JSON.stringify(payload))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

describe('getJwtExpiration', () => {
	it('returns the JWT expiration in milliseconds', () => {
		const token = `header.${encodePayload({ exp: 1783355193 })}.signature`;

		expect(getJwtExpiration(token)).toBe(1783355193000);
	});

	it.each([null, '', 'invalid-token', 'header.invalid.signature'])(
		'returns null for an invalid token',
		(token) => {
			expect(getJwtExpiration(token)).toBeNull();
		}
	);
});

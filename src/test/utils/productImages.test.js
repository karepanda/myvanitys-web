// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { getProductImage, saveProductImage } from '../../utils/productImages';

describe('product image storage', () => {
	beforeEach(() => window.localStorage.clear());

	it('prefers an image supplied by the API', () => {
		expect(getProductImage({ id: '1', imageUrl: 'https://example.com/product.jpg' }))
			.toBe('https://example.com/product.jpg');
	});

	it('stores and retrieves a local image by product id', () => {
		const product = { id: 'product-1' };
		expect(saveProductImage(product, 'data:image/jpeg;base64,photo')).toBe(true);
		expect(getProductImage(product)).toBe('data:image/jpeg;base64,photo');
	});

	it('does not store an image without a stable product id', () => {
		expect(saveProductImage({}, 'data:image/jpeg;base64,photo')).toBe(false);
		expect(getProductImage({})).toBe('');
	});
});

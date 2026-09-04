// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';

import i18n, { namespaces, supportedLanguages } from '../../i18n/config';

describe('i18n configuration', () => {
	afterEach(async () => {
		await i18n.changeLanguage('es');
		localStorage.clear();
	});

	it('bundles every namespace for both supported languages', () => {
		expect(supportedLanguages).toEqual(['es', 'en']);
		expect(namespaces).toEqual(['common', 'auth', 'products', 'reviews', 'errors']);

		for (const language of supportedLanguages) {
			for (const namespace of namespaces) {
				expect(i18n.hasResourceBundle(language, namespace)).toBe(true);
			}
		}
	});

	it('caches explicit language changes in localStorage', async () => {
		await i18n.changeLanguage('en');

		expect(i18n.resolvedLanguage).toBe('en');
		expect(localStorage.getItem('i18nextLng')).toBe('en');
	});
});

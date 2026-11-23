// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

const ANALYTICS_CONSENT_KEY = 'myvanitys_analytics_consent';

const loadAnalyticsModule = async () => {
	vi.resetModules();
	vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
	return import('../../../services/analytics/googleAnalytics');
};

describe('googleAnalytics callback page location redaction', () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
		vi.resetModules();
	});

	it('excludes the callback query string from the analytics page location', async () => {
		localStorage.setItem(ANALYTICS_CONSENT_KEY, 'granted');
		window.history.replaceState({}, '', '/callback?code=secret&state=login');
		window.gtag = vi.fn();

		const { initializeAnalytics } = await loadAnalyticsModule();
		initializeAnalytics();

		const configCall = window.gtag.mock.calls.find(
			([command]) => command === 'config'
		);
		expect(configCall).toBeTruthy();
		expect(configCall[2].page_location).toBe(
			`${window.location.origin}/callback`
		);
		expect(configCall[2].page_location).not.toContain('secret');
		expect(configCall[2].page_location).not.toContain('state=login');
	});

	it('keeps the default page location for non-callback routes', async () => {
		localStorage.setItem(ANALYTICS_CONSENT_KEY, 'granted');
		window.history.replaceState({}, '', '/dashboard?mode=search');
		window.gtag = vi.fn();

		const { initializeAnalytics } = await loadAnalyticsModule();
		initializeAnalytics();

		const configCall = window.gtag.mock.calls.find(
			([command]) => command === 'config'
		);
		expect(configCall).toBeTruthy();
		expect(configCall[2].page_location).toBeUndefined();
	});
});

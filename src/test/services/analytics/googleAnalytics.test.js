// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	ANALYTICS_CONSENT_KEY,
	denyAnalyticsConsent,
	getAnalyticsConsent,
	grantAnalyticsConsent,
	trackEvent,
} from '../../../services/analytics/googleAnalytics';

describe('googleAnalytics', () => {
	beforeEach(() => {
		localStorage.clear();
		delete window.gtag;
	});

	it('does not treat a missing preference as consent', () => {
		expect(getAnalyticsConsent()).toBeNull();
		expect(trackEvent('product_created')).toBe(false);
	});

	it('persists an explicit grant', () => {
		grantAnalyticsConsent();

		expect(localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBe('granted');
		expect(getAnalyticsConsent()).toBe('granted');
	});

	it('persists an explicit rejection', () => {
		denyAnalyticsConsent();

		expect(localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBe('denied');
		expect(getAnalyticsConsent()).toBe('denied');
	});

	it('only sends events after consent has been granted', () => {
		window.gtag = vi.fn();

		expect(trackEvent('product_created')).toBe(false);
		expect(window.gtag).not.toHaveBeenCalled();

		localStorage.setItem(ANALYTICS_CONSENT_KEY, 'granted');
		expect(trackEvent('product_created')).toBe(true);
		expect(window.gtag).toHaveBeenCalledWith(
			'event',
			'product_created',
			{}
		);
	});
});

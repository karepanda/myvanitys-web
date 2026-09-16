const ANALYTICS_CONSENT_KEY = 'myvanitys_analytics_consent';
const GRANTED = 'granted';
const DENIED = 'denied';
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;

const hasBrowserStorage = () =>
	typeof window !== 'undefined';

const configureGtag = () => {
	window.dataLayer = window.dataLayer || [];
	window.gtag = window.gtag || function gtag() {
		window.dataLayer.push(arguments);
	};
};

export const getAnalyticsConsent = () => {
	if (!hasBrowserStorage()) return null;

	try {
		const consent = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
		return consent === GRANTED || consent === DENIED ? consent : null;
	} catch {
		return null;
	}
};

const storeAnalyticsConsent = (consent) => {
	if (!hasBrowserStorage()) return;

	try {
		window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
	} catch {
		// The preference remains in memory when browser storage is unavailable.
	}
};

export const initializeAnalytics = () => {
	if (
		initialized ||
		!measurementId ||
		typeof document === 'undefined' ||
		getAnalyticsConsent() !== GRANTED
	) {
		return false;
	}

	configureGtag();
	window[`ga-disable-${measurementId}`] = false;

	window.gtag('consent', 'default', {
		analytics_storage: GRANTED,
		ad_storage: DENIED,
		ad_user_data: DENIED,
		ad_personalization: DENIED,
	});
	window.gtag('js', new Date());
	window.gtag('config', measurementId, {
		allow_google_signals: false,
		allow_ad_personalization_signals: false,
	});

	const script = document.createElement('script');
	script.id = 'google-analytics-script';
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
	document.head.appendChild(script);

	initialized = true;
	return true;
};

export const grantAnalyticsConsent = () => {
	storeAnalyticsConsent(GRANTED);

	if (measurementId && typeof window !== 'undefined') {
		window[`ga-disable-${measurementId}`] = false;
		if (typeof window.gtag === 'function') {
			window.gtag('consent', 'update', {
				analytics_storage: GRANTED,
				ad_storage: DENIED,
				ad_user_data: DENIED,
				ad_personalization: DENIED,
			});
		}
	}

	initializeAnalytics();
};

const removeAnalyticsCookies = () => {
	if (typeof document === 'undefined') return;

	const cookieNames = document.cookie
		.split(';')
		.map((cookie) => cookie.split('=')[0].trim())
		.filter((name) => name === '_ga' || name.startsWith('_ga_'));

	const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
	const parts = hostname.split('.');
	const registrableDomain = parts.length > 1 ? `.${parts.slice(-2).join('.')}` : '';
	const domains = ['', hostname, hostname ? `.${hostname}` : '', registrableDomain]
		.filter(Boolean);

	cookieNames.forEach((name) => {
		document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
		domains.forEach((domain) => {
			document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
		});
	});
};

export const denyAnalyticsConsent = () => {
	storeAnalyticsConsent(DENIED);

	if (measurementId && typeof window !== 'undefined') {
		if (typeof window.gtag === 'function') {
			window.gtag('consent', 'update', {
				analytics_storage: DENIED,
				ad_storage: DENIED,
				ad_user_data: DENIED,
				ad_personalization: DENIED,
			});
		}
		window[`ga-disable-${measurementId}`] = true;
	}

	removeAnalyticsCookies();
};

export const trackEvent = (name, parameters = {}) => {
	if (
		getAnalyticsConsent() !== GRANTED ||
		typeof window === 'undefined' ||
		typeof window.gtag !== 'function'
	) {
		return false;
	}

	window.gtag('event', name, parameters);
	return true;
};

export { ANALYTICS_CONSENT_KEY };

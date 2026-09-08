import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import authEn from '../locales/en/auth.json';
import commonEn from '../locales/en/common.json';
import errorsEn from '../locales/en/errors.json';
import productsEn from '../locales/en/products.json';
import reviewsEn from '../locales/en/reviews.json';
import authEs from '../locales/es/auth.json';
import commonEs from '../locales/es/common.json';
import errorsEs from '../locales/es/errors.json';
import productsEs from '../locales/es/products.json';
import reviewsEs from '../locales/es/reviews.json';

export const supportedLanguages = ['es', 'en'] as const;
export const namespaces = ['common', 'auth', 'products', 'reviews', 'errors'] as const;

const resources = {
	es: {
		common: commonEs,
		auth: authEs,
		products: productsEs,
		reviews: reviewsEs,
		errors: errorsEs,
	},
	en: {
		common: commonEn,
		auth: authEn,
		products: productsEn,
		reviews: reviewsEn,
		errors: errorsEn,
	},
};

void i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		supportedLngs: supportedLanguages,
		ns: namespaces,
		defaultNS: 'common',
		fallbackLng: {
			es: ['en'],
			default: ['es', 'en'],
		},
		load: 'languageOnly',
		interpolation: {
			escapeValue: false,
		},
		detection: {
			order: ['localStorage', 'navigator', 'htmlTag'],
			caches: ['localStorage'],
			lookupLocalStorage: 'i18nextLng',
		},
		react: {
			useSuspense: false,
		},
	});

export default i18n;

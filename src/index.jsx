import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import './index.css';
import { App } from '../src/App/App';
import i18n from './i18n/config';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<I18nextProvider i18n={i18n}>
			<App />
		</I18nextProvider>
	</React.StrictMode>
);

reportWebVitals((metric) => {
	window.dispatchEvent(new CustomEvent('myvanitys:web-vital', { detail: metric }));
	if (import.meta.env.DEV) console.info('[Web Vital]', metric);
});

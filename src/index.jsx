import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from '../src/App/App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

reportWebVitals((metric) => {
	window.dispatchEvent(new CustomEvent('myvanitys:web-vital', { detail: metric }));
	if (import.meta.env.DEV) console.info('[Web Vital]', metric);
});

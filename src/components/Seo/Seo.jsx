import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const siteUrl = 'https://www.myvanitys.com';
const defaultDescription = "Organize your skincare and makeup collection, discover beauty products and keep your reviews together with My Vanity's.";

const pages = {
	'/': { title: "My Vanity's | Your beauty collection, organized", description: defaultDescription, index: true },
	'/privacy': { title: "Privacy Policy | My Vanity's", description: "Learn how My Vanity's collects, uses and protects your personal information.", index: true },
	'/terms': { title: "Terms of Use | My Vanity's", description: "Read the terms that apply when you create and use a My Vanity's account.", index: true },
	'/dashboard': { title: "My Vanity | My Vanity's", description: 'Manage your personal beauty collection.', index: false },
	'/callback': { title: "Signing in | My Vanity's", description: 'Completing your secure sign-in.', index: false },
};

const setMeta = (selector, attribute, value) => {
	const element = document.head.querySelector(selector);
	if (element) element.setAttribute(attribute, value);
};

const Seo = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		const page = pages[pathname] || { title: "Page not found | My Vanity's", description: 'The requested page could not be found.', index: false };
		const canonical = `${siteUrl}${pathname === '/' ? '/' : pathname}`;
		document.title = page.title;
		setMeta('meta[name="description"]', 'content', page.description);
		setMeta('meta[name="robots"]', 'content', page.index ? 'index, follow' : 'noindex, nofollow');
		setMeta('link[rel="canonical"]', 'href', canonical);
		setMeta('meta[property="og:title"]', 'content', page.title);
		setMeta('meta[property="og:description"]', 'content', page.description);
		setMeta('meta[property="og:url"]', 'content', canonical);
		setMeta('meta[name="twitter:title"]', 'content', page.title);
		setMeta('meta[name="twitter:description"]', 'content', page.description);
	}, [pathname]);

	return null;
};

export { Seo };

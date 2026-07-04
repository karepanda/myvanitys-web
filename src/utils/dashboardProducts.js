export const ALL_CATEGORIES = 'All';

export const normalizeProductCollection = (value) => {
	if (Array.isArray(value)) return value;
	if (Array.isArray(value?.content)) return value.content;
	if (Array.isArray(value?.products)) return value.products;
	return [];
};

export const getCategoryName = (product) => {
	const category = product?.category;
	if (typeof category === 'string') return category.trim();
	if (category && typeof category.name === 'string') return category.name.trim();
	return '';
};

export const getCategoryLabel = (category) =>
	category === 'Eyelash' ? 'Lashes' : category;

export const getAvailableCategories = (products = []) => {
	const categories = normalizeProductCollection(products)
		.map(getCategoryName)
		.filter(Boolean)
		.filter((category, index, list) => list.indexOf(category) === index);

	return [ALL_CATEGORIES, ...categories];
};

export const filterByCategory = (products = [], category = ALL_CATEGORIES) =>
	category === ALL_CATEGORIES
		? [...normalizeProductCollection(products)]
		: normalizeProductCollection(products).filter((product) => getCategoryName(product) === category);

export const sortProducts = (products = [], sort = 'default') => {
	const result = [...normalizeProductCollection(products)];
	const compare = (field) => (left, right) =>
		String(left?.[field] || '').localeCompare(String(right?.[field] || ''), 'en', {
			sensitivity: 'base',
		});

	switch (sort) {
		case 'name':
			return result.sort(compare('name'));
		case 'brand':
			return result.sort(compare('brand'));
		case 'rating':
			return result.sort(
				(left, right) =>
					Number(right?.averageRating || 0) - Number(left?.averageRating || 0)
			);
		default:
			return result;
	}
};

export const isValidHexColor = (value) =>
	typeof value === 'string' && /^#(?:[0-9a-fA-F]{3,4}){1,2}$/.test(value);

export const getSafeHexColor = (value) =>
	isValidHexColor(value) ? value.toUpperCase() : '#D8D1CC';

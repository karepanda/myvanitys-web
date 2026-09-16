const PRODUCT_IMAGE_STORAGE_PREFIX = 'myvanitys:product-image:';
const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 720;

const getProductImageKey = (product) => {
	const id = typeof product === 'string' ? product : product?.id || product?.productId;
	return id ? `${PRODUCT_IMAGE_STORAGE_PREFIX}${id}` : null;
};

export const getProductImage = (product) => {
	const key = getProductImageKey(product);
	if (key && typeof window !== 'undefined') {
		try {
			const localImage = window.localStorage.getItem(key);
			if (localImage) return localImage;
		} catch {
			// The API image remains available when browser storage is blocked.
		}
	}

	const apiImage = product?.imageUrl || product?.imageData || product?.image;
	return typeof apiImage === 'string' && apiImage.trim() ? apiImage : '';
};

export const saveProductImage = (product, imageData) => {
	const key = getProductImageKey(product);
	if (!key || !imageData || typeof window === 'undefined') return false;

	try {
		window.localStorage.setItem(key, imageData);
		return true;
	} catch {
		return false;
	}
};

const readFile = (file) => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.onload = () => resolve(reader.result);
	reader.onerror = () => reject(new Error('photo-read-error'));
	reader.readAsDataURL(file);
});

const loadImage = (source) => new Promise((resolve, reject) => {
	const image = new Image();
	image.onload = () => resolve(image);
	image.onerror = () => reject(new Error('photo-decode-error'));
	image.src = source;
});

export const prepareProductImage = async (file) => {
	if (!file?.type?.startsWith('image/')) throw new Error('photo-type-error');
	if (file.size > MAX_IMAGE_FILE_SIZE) throw new Error('photo-size-error');

	const source = await readFile(file);
	const image = await loadImage(source);
	const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
	const width = Math.max(1, Math.round(image.naturalWidth * scale));
	const height = Math.max(1, Math.round(image.naturalHeight * scale));
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	if (!context) throw new Error('photo-process-error');

	canvas.width = width;
	canvas.height = height;
	context.fillStyle = '#FFFFFF';
	context.fillRect(0, 0, width, height);
	context.drawImage(image, 0, 0, width, height);

	return canvas.toDataURL('image/jpeg', 0.8);
};

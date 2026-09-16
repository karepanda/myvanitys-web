import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoClose } from 'react-icons/io5';
import { FiCamera, FiImage } from 'react-icons/fi';
import { VanitysContext } from '../../context/index';
import './CreateProductPopup.css';
import { useForm } from 'react-hook-form';
import { Modal } from '../Modal/Modal';
import { MissingFieldsPopup } from '../MissingFieldsPopup/MissingFieldsPopup';
import { getCategoryLabel } from '../../utils/dashboardProducts';
import { getProductImage, prepareProductImage, saveProductImage } from '../../utils/productImages';

const categoryClass = (category) =>
	String(category || 'other').toLowerCase().replace(/[^a-z0-9]+/g, '-');

const CreateProductPopup = () => {
	const { t } = useTranslation('products');
	const categories = [
		{ id: '123e4567-e89b-12d3-a456-426614174000', name: 'Face' },
		{ id: '550e8400-e29b-41d4-a716-446655440001', name: 'Eyes' },
		{ id: '660e8400-e29b-41d4-a716-446655440002', name: 'Eyelash' },
		{ id: '770e8400-e29b-41d4-a716-446655440003', name: 'Brows' },
		{ id: '01969b31-b294-7939-a8d2-c298e896ec1f', name: 'Lips' },
		{ id: '01969b32-15c7-7ff7-a712-0b42354f080e', name: 'Cream' },
		{ id: '01969b32-73b2-7818-b543-f0a35aee0dc4', name: 'Serum' },
		{ id: '01969b32-e411-7df9-815f-9142e7c4f6e5', name: 'Toner' },
	];

	const [localCategoryId, setLocalCategoryId] = useState('');
	const [productColor, setProductColor] = useState('#8A8A8A');
	const [productImage, setProductImage] = useState('');
	const [photoError, setPhotoError] = useState(false);

	const {
		toggleCreateProductPopup,
		showMissingFieldsPopup,
		setShowMissingFieldsPopup,
		setShowCreateProductPopup,
		setFormData,
		selectedProduct,
		errorMessage,
		errorTitle,
		errorType,
		errorHandler,
		createProduct,
		apiResponse,
	} = useContext(VanitysContext);

	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
		reset,
		setValue,
	} = useForm();

	const handleCategoryChange = (newCategoryId) => {
		setLocalCategoryId(newCategoryId);
		setValue('categoryId', newCategoryId, { shouldValidate: true });
	};

	const handlePhotoChange = async (event) => {
		const [file] = event.target.files || [];
		if (!file) return;

		try {
			setProductImage(await prepareProductImage(file));
			setPhotoError(false);
		} catch {
			setPhotoError(true);
		} finally {
			event.target.value = '';
		}
	};

	useEffect(() => {
		if (selectedProduct) {
			const selectedColor = selectedProduct.colorHex || selectedProduct.color || '#8A8A8A';
			reset({
				...selectedProduct,
				categoryId: selectedProduct.categoryId || '',
				color: selectedColor,
			});
			setLocalCategoryId(selectedProduct.categoryId || '');
			setProductColor(selectedColor);
			setProductImage(getProductImage(selectedProduct));
		} else {
			reset({ color: '#8A8A8A' });
			setLocalCategoryId('');
			setProductColor('#8A8A8A');
			setProductImage('');
		}
		setPhotoError(false);
	}, [selectedProduct, reset]);

	const onSubmitProductCreateForm = async (data) => {
		try {
			const productData = {
				...data,
				categoryId: localCategoryId,
			};

			const token = apiResponse?.token;

			if (!token) {
				errorHandler.showErrorMessage(
					t('create.validation.authentication.message'),
					t('create.validation.authentication.title'),
					'error'
				);
				return;
			}

			const response = await createProduct(token, productData);

			if (response) {
				if (productImage) saveProductImage(response, productImage);
				setFormData(productData);
				setShowMissingFieldsPopup(false);
				setShowCreateProductPopup(false);
				reset();
				setLocalCategoryId('');
				setProductColor('#8A8A8A');
				setProductImage('');
			}
		} catch {
			errorHandler.showGenericError();
		}
	};

	const handleFormError = (formErrors) => {
		if (formErrors.categoryId) {
			errorHandler.showErrorMessage(
				t('create.validation.category.message'),
				t('create.validation.category.title'),
				'warning'
			);
		} else {
			errorHandler.showErrorMessage(
				t('create.validation.requiredFields.message'),
				t('create.validation.requiredFields.title'),
				'warning'
			);
		}
	};

	return (
		<div className='createProduct fixed h-screen inset-0 bg-background bg-opacity-60 flex items-center flex-col justify-center align-middle backdrop-blur-sm'>
			<div className='createProduct__container shadow-lg'>
				<section className='createProduct__header'>
					<h1 className='createProduct__header--title'>
						{t('create.title')}
					</h1>
					<button type='button' className='createProduct__header--close' onClick={toggleCreateProductPopup} aria-label={t('create.close')}>
						<IoClose aria-hidden='true' />
					</button>
				</section>

				<section className='createProduct__right'>
					<h1 className='createProduct__right--title'>
						{t('create.formTitle')}
					</h1>
					<form
						className='createProduct__right--form'
						onSubmit={handleSubmit(
							onSubmitProductCreateForm,
							handleFormError
						)}
					>
						<div className='createProduct__photo'>
							<div className={`createProduct__photoPreview${productImage ? '' : ' createProduct__photoPreview--empty'}`}>
								{productImage ? <img src={productImage} alt={t('create.photo.previewAlt')} /> : <FiImage aria-hidden='true' />}
							</div>
							<div className='createProduct__photoCopy'>
								<strong>{t('create.photo.title')}</strong>
								<span>{t('create.photo.description')}</span>
								<label className='createProduct__photoButton' htmlFor='productPhoto'>
									<FiCamera aria-hidden='true' />
									{productImage ? t('create.photo.change') : t('create.photo.action')}
								</label>
								<input id='productPhoto' type='file' accept='image/*' capture='environment' onChange={handlePhotoChange} />
							</div>
						</div>
						{photoError && <span className='createProduct__error' role='alert'>{t('create.photo.error')}</span>}

						<label htmlFor='name'>{t('create.fields.name')}</label>
						<input
							type='text'
							className='createProduct__right--name'
							id='name'
							{...register('name', { required: true, minLength: 2 })}
						/>
						<label htmlFor='brand'>{t('create.fields.brand')}</label>
						<input
							type='text'
							className='createProduct__right--brand'
							id='brand'
							{...register('brand', { required: true, minLength: 2 })}
						/>
						<fieldset className='createProduct__categories'>
							<legend>{t('create.fields.category')}</legend>
							<div className='createProduct__categoryOptions'>
								{categories.map((category) => (
									<button
										type='button'
										key={category.id}
										className={`createProduct__categoryOption createProduct__categoryOption--${categoryClass(category.name)}${localCategoryId === category.id ? ' createProduct__categoryOption--selected' : ''}`}
										onClick={() => handleCategoryChange(category.id)}
										aria-pressed={localCategoryId === category.id}
									>
										{getCategoryLabel(category.name)}
									</button>
								))}
							</div>
							<input
								type='hidden'
								{...register('categoryId', {
									required: true,
									validate: (value) =>
										!!value || t('create.validation.category.required'),
								})}
							/>
						</fieldset>

						{errors.categoryId && (
							<span className='createProduct__error'>
								{t('create.validation.category.inline')}
							</span>
						)}

						<label htmlFor='color'>{t('create.fields.color')}</label>
						<div className='createProduct__right--color'>
							<input
								type='color'
								id='color'
								{...register('color', { required: true })}
								value={productColor}
								onChange={(event) => {
									setProductColor(event.target.value);
									setValue('color', event.target.value, { shouldValidate: true });
								}}
								aria-label={t('create.fields.colorAria')}
							/>
						</div>

						{Object.keys(errors).length > 0 && (
							<div className='createProduct__error'>
								{t('create.validation.requiredFields.inline')}
							</div>
						)}

						<button
							type='submit'
							className='createProduct__right--button'
						>
							{t('create.actions.add')}
						</button>
					</form>
				</section>
			</div>

			{showMissingFieldsPopup && (
				<Modal>
					<MissingFieldsPopup
						message={
							errorMessage ||
							t('create.validation.requiredFields.popupFallback')
						}
						title={errorTitle}
						type={errorType}
						onClose={() => {
							setShowMissingFieldsPopup(false);
							clearErrors();
						}}
					/>
				</Modal>
			)}
		</div>
	);
};

export { CreateProductPopup };

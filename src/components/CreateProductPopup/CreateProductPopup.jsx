import React, { useContext, useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';
import './CreateProductPopup.css';
import { useForm } from 'react-hook-form';
import { Modal } from '../Modal/Modal';
import { MissingFieldsPopup } from '../MissingFieldsPopup/MissingFieldsPopup';
import imageForm from '../../assets/image-form.png';
import { image } from 'framer-motion/client';

const CreateProductPopup = () => {
	// Define the array of categories with their ID and name
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

	// Local state for selected category
	const [localCategoryId, setLocalCategoryId] = useState('');

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

	// Function to handle category change
	const handleCategoryChange = (e) => {
		const newCategoryId = e.target.value;
		setLocalCategoryId(newCategoryId);
		setValue('categoryId', newCategoryId, { shouldValidate: true });
	};

	useEffect(() => {
		if (selectedProduct) {
			reset({
				...selectedProduct,
				categoryId: selectedProduct.categoryId || '',
			});
			setLocalCategoryId(selectedProduct.categoryId || '');
		} else {
			reset();
			setLocalCategoryId('');
		}
	}, [selectedProduct, reset]);

	const onSubmitProductCreateForm = async (data) => {
		try {
			// Prepare data for submission - solo incluir los datos necesarios
			const productData = {
				...data,
				categoryId: localCategoryId,
			};

			// Get context token
			const token = apiResponse?.token;

			if (!token) {
				errorHandler.showErrorMessage(
					'You are not authenticated. Please log in to continue.',
					'Authentication error',
					'error'
				);
				return;
			}

			// Using the createProduct function of the context
			const response = await createProduct(token, productData);

			if (response) {
				console.log('Product created successfully');
				setFormData(productData);
				setShowMissingFieldsPopup(false);
				setShowCreateProductPopup(false);
				reset();
				setLocalCategoryId('');
			}
		} catch (error) {
			console.error('Failed to create product:', error);
			errorHandler.showGenericError();
		}
	};

	const handleFormError = (formErrors) => {
		// Display specific error message if category is missing
		if (formErrors.categoryId) {
			errorHandler.showErrorMessage(
				'Please select a category for your product.',
				'Missing Information',
				'warning'
			);
		} else {
			// Use errorHandler to display validation errors
			errorHandler.showValidationError('requiredFields');
		}
	};

	return (
		<div className='createProduct fixed h-screen inset-0 bg-background bg-opacity-60 flex items-center flex-col justify-center align-middle backdrop-blur-sm'>
			<div className='createProduct__container shadow-lg'>
				<section className='createProduct__header'>
					<h1 className='createProduct__header--title'>
						Add Products to your Vanity
					</h1>
					<IoClose
						onClick={() => toggleCreateProductPopup()}
						size={40}
						className='createProduct__header--icon'
					/>
				</section>

				<img
					className='createProduct__left--image'
					src={imageForm}
					alt='Register image'
				/>

				<section className='createProduct__right'>
					<h1 className='createProduct__right--title'>
						Create your Product
					</h1>
					<form
						className='createProduct__right--form'
						onSubmit={handleSubmit(
							onSubmitProductCreateForm,
							handleFormError
						)}
					>
						<label htmlFor='name'>Insert the name of the product:</label>
						<input
							type='text'
							className='createProduct__right--name'
							id='name'
							{...register('name', { required: true, minLength: 2 })}
						/>
						<label htmlFor='brand'>Insert Brand name:</label>
						<input
							type='text'
							className='createProduct__right--brand'
							id='brand'
							{...register('brand', { required: true, minLength: 2 })}
						/>
						<label htmlFor='categorySelect'>Choose a Category:</label>
						<div className='createProduct__right--wrapper'>
							<select
								id='categorySelect'
								className='createProduct__right--category'
								value={localCategoryId}
								onChange={handleCategoryChange}
							>
								<option value='' disabled>
									Select a Category:
								</option>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>

							<input
								type='hidden'
								{...register('categoryId', {
									required: true,
									validate: (value) =>
										!!value || 'Category is required',
								})}
								value={localCategoryId}
							/>
						</div>

						{errors.categoryId && (
							<span
								style={{
									color: 'red',
									fontSize: '12px',
									marginTop: '-15px',
									display: 'block',
									marginBottom: '10px',
								}}
							>
								Please select a category
							</span>
						)}

						<label htmlFor='color'>Choose Color of the product:</label>
						<div className='createProduct__right--color'>
							<input
								type='color'
								id='color'
								{...register('color', { required: true })}
								defaultValue='#D9D9D9'
							/>
						</div>

						{Object.keys(errors).length > 0 && (
							<div
								style={{
									color: 'red',
									marginBottom: '10px',
									fontSize: '12px',
								}}
							>
								Please fill in all required fields.
							</div>
						)}

						<button
							type='submit'
							className='createProduct__right--button'
						>
							Add to My Vanity
						</button>
					</form>
				</section>
			</div>

			{showMissingFieldsPopup && (
				<Modal>
					<MissingFieldsPopup
						message={
							errorMessage ||
							'You need to fill in all the fields to create the product.'
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

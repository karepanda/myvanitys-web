import React, { useContext, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';
import './CreateProductPopup.css';
import { useForm } from 'react-hook-form';
import { Modal } from '../Modal/Modal';
import { MissingFieldsPopup } from '../MissingFieldsPopup/MissingFieldsPopup';

const CreateProductPopup = () => {
	const {
		toggleCreateProductPopup,
		selectedCategory,
		showMissingFieldsPopup,
		setShowMissingFieldsPopup,
		setShowCreateProductPopup,
		setFormData,
		setSelectedCategory,
		selectedProduct,
		errorMessage,
		errorTitle,
		errorType,
        errorHandler,
        createProduct,
        apiResponse,
        toggleNotification,
        handleCategoryChange = (e) => setSelectedCategory(e.target.value)
	} = useContext(VanitysContext);

	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
		reset,
	} = useForm();

	useEffect(() => {
		if (selectedProduct) {
			reset(selectedProduct);
			setSelectedCategory(selectedProduct.category || '');
		} else {
			reset();
			setSelectedCategory('');
		}
	}, [selectedProduct, reset, setSelectedCategory]);

	const onSubmitProductCreateForm = async (data) => {
		data.category = selectedCategory;
		
		// Get context token
		const token = apiResponse?.token;
		
		if (!token) {
			errorHandler.showErrorMessage(
				'No estás autenticado. Por favor inicia sesión para continuar.',
				'Error de autenticación',
				'error'
			);
			return;
		}
		
		try {
			// Using the createProduct function of the context
			const response = await createProduct(token, data);
			
			if (response) {
				setFormData(data);
				setShowMissingFieldsPopup(false);
				setShowCreateProductPopup(false);
				reset();
				console.log('Product created:', response);
				// he notification is already handled in the createProduct function of the context
			} else {
				// If there is an error, it was already handled by errorHandler inside createProduct
				console.log('Failed to create product');
			}
		} catch (error) {
			console.error('Failed to create product:', error);
			errorHandler.showGenericError();
		}
	};

	const handleFormError = (formErrors) => {
		// Use errorHandler to display validation errors
		errorHandler.showValidationError('requiredFields');
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
					src='../src/assets/image-form.png'
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
							{...register('name', { required: true, minLength: 2 })}
						/>
						<label htmlFor='brand'>Insert Brand name:</label>
						<input
							type='text'
							className='createProduct__right--brand'
							{...register('brand', { required: true, minLength: 2 })}
						/>
						<label htmlFor='category'>Choose a Category:</label>
						<div className='createProduct__right--wrapper'>
							<select
								className='createProduct__right--category'
								value={selectedCategory}
								onChange={handleCategoryChange}
								{...register('category', { required: true })}
								defaultValue=''
							>
								<option value='' disabled>
									Select a Category:
								</option>
								<option value='Makeup'>Makeup</option>
								<option value='Face'>Face</option>
								<option value='Eyes'>Eyes</option>
								<option value='Eyelast'>Eyelast</option>
								<option value='Brows'>Brows</option>
								<option value='Lips'>Lips</option>
								<option value='Skincare'>Skincare</option>
								<option value='Cream'>Cream</option>
								<option value='Serum'>Serum</option>
								<option value='Toner'>Toner</option>
							</select>
						</div>
						<label htmlFor='color'>Choose Color of the product:</label>
						<div className='createProduct__right--color'>
							<input
								type='color'
								{...register('color', { required: true })}
								defaultValue='#D9D9D9'
							/>
						</div>
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
						message={errorMessage || 'You need to fill in all the fields to create the product.'}
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
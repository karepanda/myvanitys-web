import React, { useContext, useState } from 'react';
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
		handleCategoryChange,
		showMissingFieldsPopup,
		setShowMissingFieldsPopup,
	} = useContext(VanitysContext);

	const [] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
		reset,
	} = useForm();

	const onSubmitProductCreateForm = (data) => {
		console.log('Formulario válido:', data);
		setShowMissingFieldsPopup(false);
		reset();
	};

	const handleFormError = (formErrors) => {
		console.log('Errores de formulario:', formErrors);
		setShowMissingFieldsPopup(true);
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
						<span id='color_front'></span>
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

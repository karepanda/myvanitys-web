import React, { useContext, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';
import './CreateProductPopup.css';

const CreateProductPopup = () => {
	const {
		toggleCreateProductPopup,
		handleColor,
		color,
		selectedCategory,
		handleCategoryChange,
	} = useContext(VanitysContext);

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
					<form className='createProduct__right--form'>
						<label htmlFor='name'>Insert the name of the product:</label>
						<input type='text' className='createProduct__right--name' />
						<label htmlFor='brand'>Insert Brand name:</label>
						<input type='text' className='createProduct__right--brand' />
						<label htmlFor='category'>Choose a Category:</label>
						<select
							className='createProduct__right--category'
							value={selectedCategory}
							onChange={handleCategoryChange}
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
						<label htmlFor='color'>Choose Color of the product:</label>
						<span id='color_front'></span>
						<div className='createProduct__right--color'>
							<input type='color' onChange={handleColor} value={color} />
						</div>
					</form>
					<button className='createProduct__right--button'>
						Add to My Vanity
					</button>
				</section>
			</div>
		</div>
	);
};

export { CreateProductPopup };

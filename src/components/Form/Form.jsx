import React, { useState } from 'react';
import './Form.css';

const Form = () => {
	const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

	const manejarCambio = (event) => {
		setCategoriaSeleccionada(event.target.value);
	};

	return (
		<form action='' className='form'>
			<h1 className='form__title'>Create your Product</h1>
			<label htmlFor='productName' className='form__label--productName'>
				Insert the name of the product:
			</label>
			<input
				type='text'
				id='productName'
				className='form__input--productName'
			/>
			<label htmlFor='brandName' className='form__label--brandName'>
				Insert Brand name:
			</label>
			<input type='text' id='brandName' className='form__input--brandName' />

			<label htmlFor='categories-choice' className='form__label--category'>
				Choose a Category:
			</label>
			<select name='categories' id='categories' defaultValue=''>
				<optgroup label='Makeup'>
					<option value='' disabled hidden></option>
					<option value='Face'>Face</option>
					<option value='Eyes'>Eyes</option>
					<option value='Eyelash'>Eyelash</option>
					<option value='Brows'>Brows</option>
					<option value='Lips'>Lips</option>
				</optgroup>
				<optgroup label='Skincare'>
					<option value='Cream'>Cream</option>
					<option value='Serum'>Serum</option>
					<option value='Toner'>Toner</option>
				</optgroup>
			</select>

			<label htmlFor='color' className='form__label--color'>
				Choose Color of the product:
			</label>
			<input type='color' id='color' className='form__input--color' />
			<button>Create Product</button>
			<button>Create and Add to My Whislist</button>
		</form>
	);
};

export { Form };

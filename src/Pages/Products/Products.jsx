import React from 'react';
import { Card } from '../../components/Card/Card';

import './Products.css';
import { ModalRegister } from '../../components/ModalRegister/ModalRegister';

const Products = () => {
	return (
		<div className='products__container'>
			<Card
				image='src/assets/createProduct.png'
				description={
					<>
						No products for the moment, <br />
						<strong className='font-medium'>
							{' '}
							Be the first to create a product!!
						</strong>{' '}
					</>
				}
				buttonText='Create Product'
				onButtonClick={() => alert('Create Review clicked!')}
				bgColor={'bg-orange'}
				textColor={'text-white'}
				imageWidth={'w-[343px]'}
				imageHeight={'w-[360px]'}
			/>
		</div>
	);
};

export { Products };

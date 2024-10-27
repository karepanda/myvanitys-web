import React from 'react';
import { Card } from '../Card/Card';
import './Main.css';

export const Main = ({ bgButtom, textButtom }) => {
	return (
		<div className='main grid grid-cols-2 grid-rows-[auto_auto] mt-20 h-max'>
			<div className='flex justify-end'>
				<div className='main__container'>
					<h1 className='main__title'>Organize and manage</h1>
					<p className='main__paraph'>
						your cosmetic collection like never before.
					</p>
					<button className='main__buttom rounded-md bg-pink text-black'>
						Register Now
					</button>
				</div>
			</div>

			<img
				className='w-[572px] h-[490px] object-contain'
				src='src/assets/home_illustration.png'
				alt=''
			/>

			<div className='justify-self-end'>
				<Card
					image='src/assets/createProduct.png'
					title='Add your first product and start organizing your cosmetic collection'
					description='It only takes a few seconds! Click on "Create Product" and take control of your vanity. Organize your products now!'
					buttonText='Create Product'
					onButtonClick={() => alert('Create Product clicked!')}
					bgColor={'bg-orange'}
					textColor={'text-background'}
					imageWidth={'w-[354px]'}
					imageHeight={'w-[364px]'}
				/>
			</div>
			<div className='justify-self-start'>
				<Card
					image='src/assets/createReview.png'
					title='Share your experience love that product?'
					description={
						<>
							Leave you{' '}
							<strong className='font-medium'>first review</strong> and
							help others discover the best in cosmetics. Click on{' '}
							<strong className='font-light'>"Add Review"</strong> and
							tell us what you think. Write your first review today!
						</>
					}
					buttonText='Create Review'
					onButtonClick={() => alert('Create Review clicked!')}
					bgColor={'bg-pink'}
					textColor={'text-black'}
					imageWidth={'w-[343px]'}
					imageHeight={'w-[360px]'}
				/>
			</div>
		</div>
	);
};

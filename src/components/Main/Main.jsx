import React from 'react';
import './Main.css';
import { VanitysContext } from '../../context';
import { useContext } from 'react';

export const Main = () => {
	const { apiResponse } = useContext(VanitysContext);

	return (
		<div className='main'>
			<section className='main__register'>
				<div className='main__register--text'>
					<h1 className='main__register--text-title'>
						Organize and manage
					</h1>
					<p className='main__register--text-paragraph'>
						your cosmetic collection like never before.
					</p>
					<button className='main__register--text-button'>
						Register Now
					</button>
				</div>
				<picture className='main__home-illustration'>
					<img
						src='src/assets/home_illustration.png'
						alt='Vanity´s Home image'
					/>
				</picture>
			</section>

			<section className='main__organize'>
				<picture className='main__product-illustration'>
					<img
						src='src/assets/CreateProduct.png'
						alt="Vanity's Create Product"
					/>
				</picture>
				<div className='main__organize--text'>
					<p className='main__organize--text-title'>
						Organize Your <br /> Cosmetic in Seconds
					</p>
					<p className='main__organize--text-paragraph'>
						Add your first product and take control of your vanity easily
						and quickly.
					</p>
					<p className='main__organize--text-paragraph2'>
						Start organizing now!
					</p>
				</div>
			</section>
		</div>
	);
};

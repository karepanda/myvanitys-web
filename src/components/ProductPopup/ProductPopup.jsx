import React, { useContext } from 'react';
import './ProductPopup.css';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';

const ProductPopup = ({ color, reviews }) => {
	const { toggleProductPopup, toggleNotification } =
		useContext(VanitysContext);

	return (
		<div className='productPopup'>
			<div className='productPopup__wrapper'>
				<section className='productPopup__header'>
					<p className='productPopup__header--title'>
						<strong>Butter Gloss - </strong>NYX Professional Makeup
					</p>
					<IoClose
						size={40}
						className='productPopup__header--icon'
						onClick={() => toggleProductPopup()}
					/>
				</section>
				<section className='productPopup__colors'>
					<div className='productPopup__colors--wrapper'>
						<input type='color' defaultValue={color} disabled />
					</div>
					<div className='productPopup__colors--icon'>
						<img
							src='src/assets/plus_icon.png'
							alt='plus icon'
							onClick={() => toggleNotification()}
						/>
					</div>
				</section>
				<section className='productPopup__reviews'>
					{reviews.map((review) => (
						<div key={review.id} className='productPopup__reviews--one'>
							<div className='productPopup__reviews--stars'>
								{Array.from({ length: 5 }, (_, i) => (
									<span key={i}>{i < review.stars ? '★' : '☆'}</span>
								))}
							</div>
							<p className='productPopup__reviews--text'>
								{review.description}
							</p>
						</div>
					))}
				</section>
			</div>
		</div>
	);
};

export { ProductPopup };

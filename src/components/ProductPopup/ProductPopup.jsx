import React, { useContext } from 'react';
import './ProductPopup.css';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';

const ProductPopup = () => {
	const { toggleProductPopup } = useContext(VanitysContext);
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
						<input type='color' defaultValue='#D9D9D9' />
					</div>
					<div className='productPopup__colors--wrapper'>
						<input type='color' defaultValue='#D9D9D9' />
					</div>
					<div className='productPopup__colors--wrapper'>
						<input type='color' defaultValue='#D9D9D9' />
					</div>
					<div className='productPopup__colors--wrapper'>
						<input type='color' defaultValue='#D9D9D9' />
					</div>
					<div className='productPopup__colors--wrapper'>
						<input type='color' defaultValue='#D9D9D9' />
					</div>
					<div className='productPopup__colors--wrapper'>
						<input type='color' defaultValue='#D9D9D9' />
					</div>
					<div className='productPopup__colors--icon'>
						<img src='src/assets/plus_icon.png' alt='plus icon' />
					</div>
				</section>
				<section className='productPopup__reviews'>
					<div className='productPopup__reviews--one'>
						<span className='productPopup__reviews--stars'>★</span>
						<span className='productPopup__reviews--stars'>★</span>
						<span className='productPopup__reviews--stars'>★</span>
						<span className='productPopup__reviews--stars'>★</span>
						<span className='productPopup__reviews--stars'>★</span>
						<p className='productPopup__reviews--text'>
							Lorem ipsum dolor sit amet consectetur adipisicing elit.
							Soluta laudantium autem architecto illo voluptas, odio quis
							iste non voluptatem saepe, rerum, explicabo eligendi
							quisquam! Delectus ut accusamus velit modi earum.
						</p>
					</div>

					<div className='productPopup__reviews--one'>
						<span className='productPopup__reviews--stars'>★</span>
						<span className='productPopup__reviews--stars'>★</span>
						<span className='productPopup__reviews--stars'>★</span>
						<span className='productPopup__reviews--stars'>★</span>
						<span className='productPopup__reviews--stars'>★</span>
						<p className='productPopup__reviews--text'>
							Lorem ipsum dolor sit amet consectetur adipisicing elit.
							Soluta laudantium autem architecto illo voluptas, odio quis
							iste non voluptatem saepe, rerum, explicabo eligendi
							quisquam! Delectus ut accusamus velit modi earum.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
};

export { ProductPopup };

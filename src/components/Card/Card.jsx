import React from 'react';
import './Card.css';

export const Card = ({
	image,
	title,
	description,
	buttonText,
	onButtonClick,
	bgColor,
	textColor,
	imageWidth,
	imageHeight,
}) => {
	return (
		<>
			<div className='card shadow-md'>
				<div className='card__image'>
					<img
						src={image}
						alt={title}
						className={`${imageWidth} ${imageHeight}`}
					/>
				</div>
				<div className='card__text'>
					<h2 className='card__text--title'>{title}</h2>
					<p className='card__text--description'>{description}</p>
				</div>
				<div className='card__buttomContainer'>
					<button
						className={`card__buttomContainer--btn ${bgColor} ${textColor}`}
						onClick={onButtonClick}
					>
						{buttonText}
					</button>
				</div>
			</div>
		</>
	);
};

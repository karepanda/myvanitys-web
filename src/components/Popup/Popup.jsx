import React from 'react';
import { IoLogoGoogle, IoClose } from 'react-icons/io5';
import './Popup.css';

const Popup = ({
	title,
	descriptionTitle,
	description,
	textButtom,
	imageUrl,
	closeFunction,
}) => {
	const redirectToGoogleOAuth = () => {
		window.location.href =
			'https://accounts.google.com/o/oauth2/v2/auth' +
			'?client_id=780556869332-1sf3nmlm6df03r73jnh8a5kll8ev3ifo.apps.googleusercontent.com' +
			'&redirect_uri=http://localhost:5173/callback' +
			'&response_type=code' +
			'&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email' +
			'&prompt=select_account';
	};

	return (
		<div className='popup fixed h-screen inset-0 bg-background bg-opacity-60 flex items-center flex-col justify-center align-middle backdrop-blur-sm'>
			<div className='popup__container shadow-lg'>
				<section className='popup__header'>
					<h1 className='popup__header--title'>{title}</h1>
					<IoClose
						onClick={() => closeFunction()}
						size={40}
						className='popup__header--icon'
					/>
				</section>
				<img className='popup__image' src={imageUrl} alt='Register image' />
				<section className='popup__description'>
					<h1 className='popup__description--title'>{descriptionTitle}</h1>
					<p className='popup__description--text'>{description}</p>
					<button
						className='popup__description--btn'
						onClick={() => redirectToGoogleOAuth()}
					>
						<IoLogoGoogle />
						{textButtom}
					</button>
				</section>
			</div>
		</div>
	);
};

export { Popup };

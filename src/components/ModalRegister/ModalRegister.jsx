import React from 'react';
import { IoLogoGoogle, IoClose } from 'react-icons/io5';
import './ModalRegister.css';
import { useContext } from 'react';
import { VanitysContext } from '../../context';

const ModalRegister = () => {
	const { setShowModal } = useContext(VanitysContext);

	const toggleModal = () => setShowModal((prev) => !prev);

	return (
		<div className='popup__container fixed h-screen inset-0 bg-background bg-opacity-60 flex items-center flex-col justify-center align-middle backdrop-blur-sm'>
			<div className='popup-register shadow-lg'>
				<div className='popup-register__title'>
					<h1>Register</h1>
					<IoClose
						onClick={() => toggleModal()}
						size={80}
						className='popup-register__title--icon'
					/>
				</div>
				<div className='popup-register__img'>
					<img src='src/assets/register_logIn.png' alt='Register image' />
				</div>
				<div className='popup-register__description'>
					<h1 className='popup-register__description--title'>
						Organize your beauty collection effortlessly
					</h1>
					<p className='popup-register__description--text'>
						Keep track of your skincare and makeup products with ease – no
						more wasting time trying to remember what you already have!
					</p>
					<button className='popup-register__description--btn'>
						<IoLogoGoogle />
						Sing up with Google
					</button>
				</div>
			</div>
		</div>
	);
};

export { ModalRegister };

import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UserProfile.css';
import { VanitysContext } from '../../context/index';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
	const {
		apiResponse,
		toggleUserProfile,
		showUserProfile,
		logout,
		handleModeChange,
		toggleCreateProductPopup,
		showCreateProductPopup,
	} = useContext(VanitysContext);

	const navigate = useNavigate();

	const goToMyVanity = () => {
		navigate('/dashboard');
	};

	return (
		<AnimatePresence>
			{showUserProfile && (
				<motion.div
					className='userProfile'
					initial={{ x: '-100%', opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: '-100%', opacity: 0 }}
					transition={{
						x: { duration: 0.5, ease: 'easeInOut' },
						opacity: { duration: 0.3 },
					}}
				>
					<div className='userProfile__header'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='32'
							height='32'
							viewBox='0 0 24 24'
							onClick={() => toggleUserProfile()}
						>
							<g fill='none' fillRule='evenodd'>
								<path d='m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z' />
								<path
									fill='currentColor'
									d='m12 13.414l5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586L6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414z'
								/>
							</g>
						</svg>
					</div>
					<div className='userProfile__name'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='36'
							height='36'
							viewBox='0 0 15 15'
						>
							<path
								fill='currentColor'
								fillRule='evenodd'
								d='M1.5 0A1.5 1.5 0 0 0 0 1.5v12A1.5 1.5 0 0 0 1.5 15h12a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 13.5 0zm5 9A3.5 3.5 0 0 0 3 12.5v1a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-1A3.5 3.5 0 0 0 8.5 9zM5 5.5a2.5 2.5 0 1 1 5 0a2.5 2.5 0 0 1-5 0'
								clipRule='evenodd'
							/>
						</svg>
						<h1 className='userProfile__name--title'>
							{apiResponse.user.name}
						</h1>
					</div>
					<div className='userProfile__buttons'>
						<button
							className='userProfile__buttons--goto'
							onClick={() => {
								toggleUserProfile();
								goToMyVanity();
							}}
						>
							Go to My Vanity
						</button>
						<button
							className='userProfile__buttons--createProduct'
							onClick={() => {
								toggleCreateProductPopup();
								toggleUserProfile();
							}}
						>
							Create Product
						</button>
						<button
							className='userProfile__buttons--logOut'
							onClick={() => {
								logout();
							}}
						>
							Log out
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export { UserProfile };

import { useContext } from 'react';
import { IoClose, IoPersonCircleOutline } from 'react-icons/io5';
import './UserProfile.css';
import { VanitysContext } from '../../context/index';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
	const {
		apiResponse,
		toggleUserProfile,
		showUserProfile,
		logout,
		toggleCreateProductPopup,
	} = useContext(VanitysContext);

	const navigate = useNavigate();

	const goToMyVanity = () => {
		navigate('/dashboard');
	};

	return (
		<>
			{showUserProfile && (
				<div className='userProfile' role='dialog' aria-modal='true' aria-labelledby='profile-title'>
					<div className='userProfile__panel'>
					<div className='userProfile__header'>
						<h1 id='profile-title'>Profile</h1>
						<button type='button' onClick={toggleUserProfile} aria-label='Close profile'><IoClose aria-hidden='true' /></button>
					</div>
					<div className='userProfile__name'>
						<IoPersonCircleOutline aria-hidden='true' />
						<h1 className='userProfile__name--title'>
							{apiResponse?.user?.name}
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
							Go to My Vanity’s
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
					</div>
				</div>
			)}
		</>
	);
};

export { UserProfile };

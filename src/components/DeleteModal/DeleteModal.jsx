import './DeleteModal.css';
import { IoClose } from 'react-icons/io5';

const DeleteModal = ({ onConfirm, onCancel, productName }) => {
	return (
		<div className='deleteModal'>
			<section className='deleteModal__header'>
				<IoClose
					size={40}
					className='deleteModal__header--icon'
					onClick={onCancel}
				/>
			</section>

			<section className='deleteModal__text'>
				<p className='deleteModal__text--messagge'>
					Are you sure you want to delete{' '}
				</p>
				<p className='deleteModal__text--name'>"{productName}"?</p>
			</section>

			<section className='deleteModal__buttons'>
				<button
					className='deleteModal__buttons--confirm'
					onClick={onConfirm}
				>
					Confirm
				</button>
				<button className='deleteModal__buttons--cancel' onClick={onCancel}>
					Cancel
				</button>
			</section>
		</div>
	);
};

export { DeleteModal };

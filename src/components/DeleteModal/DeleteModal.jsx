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

			<section className='deleteModal__reviews'>
				<p>Are you sure you want to delete "{productName}"?</p>
			</section>

			<section className='deleteModal__add'>
				<button className='deleteModal__add--buttom' onClick={onConfirm}>
					Confirm
				</button>
				<button className='deleteModal__add--buttom' onClick={onCancel}>
					Cancel
				</button>
			</section>
		</div>
	);
};

export { DeleteModal };

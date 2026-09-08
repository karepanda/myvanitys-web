import './DeleteModal.css';
import { IoClose } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

const DeleteModal = ({ onConfirm, onCancel, productName }) => {
	const { t } = useTranslation('common');
	return (
		<div className='deleteModal'>
			<section className='deleteModal__header'>
				<button type='button' className='deleteModal__header--close' onClick={onCancel} aria-label={t('deleteModal.close')}>
					<IoClose aria-hidden='true' />
				</button>
			</section>

			<section className='deleteModal__text'>
				<p className='deleteModal__text--messagge'>
					{t('deleteModal.question')}{' '}
				</p>
				<p className='deleteModal__text--name'>"{productName}"?</p>
			</section>

			<section className='deleteModal__buttons'>
				<button
					className='deleteModal__buttons--confirm'
					onClick={onConfirm}
				>
					{t('deleteModal.confirm')}
				</button>
				<button className='deleteModal__buttons--cancel' onClick={onCancel}>
					{t('deleteModal.cancel')}
				</button>
			</section>
		</div>
	);
};

export { DeleteModal };

import { useContext } from 'react';
import { VanitysContext } from '../../context';
import './Notification.css';

export const Notification = () => {
	const { notificationType } = useContext(VanitysContext);

	const getNotificationMessage = () => {
		switch (notificationType) {
			case 'add':
				return {
					description: 'Product has been added to your Vanity',
					highlight: 'Vanity',
				};
			case 'update':
				return {
					description: 'Product has been edited with success',
					highlight: 'edited',
				};
			case 'delete':
				return {
					description: 'Product has been deleted from your Vanity',
					highlight: 'Vanity',
				};
			default:
				return {
					description: 'Action completed successfully!',
					highlight: 'completed',
				};
		}
	};

	const { description, highlight } = getNotificationMessage();
	const [before, after] = description.split(highlight);

	return (
		<div className='notification animate-in'>
			<h1>
				{before}
				<span className='highlight'>{highlight}</span>
				{after}
			</h1>
		</div>
	);
};

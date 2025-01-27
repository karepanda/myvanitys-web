import { useContext } from 'react';
import { VanitysContext } from '../../context';
import './Notification.css';

export const Notification = ({ description, highlight }) => {
	const { showNotification } = useContext(VanitysContext);

	const [before, after] = description.split(highlight);

	return (
		<div
			className={`notification ${
				showNotification ? 'animate-in' : 'animate-out'
			}`}
		>
			<h1>
				{before}
				<span className='highlight'>{highlight}</span>
				{after}
			</h1>
		</div>
	);
};

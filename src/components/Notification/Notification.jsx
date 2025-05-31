import { useContext } from 'react';
import { VanitysContext } from '../../context';
import './Notification.css';

export const Notification = ({ description, highlight }) => {
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

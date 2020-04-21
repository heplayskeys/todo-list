import React, { useEffect } from 'react';

import './toast.styles.scss';

const Toast = props => {
	const { type } = props;

	const removeToast = () => {
		const toast = document.querySelector('#toast-popup');
		setTimeout(() => {
			type === 'success'
				? toast.classList.remove('toast-success')
				: toast.classList.remove('toast-error');
		}, 4000);
	};

	useEffect(() => {
		const toast = document.querySelector('#toast-popup');

		switch (type) {
			case 'success':
				toast.classList.add('toast-success');
				removeToast();
				break;

			case 'error':
				toast.classList.add('toast-error');
				removeToast();
				break;

			default:
		}
	});

	return (
		<div
			id='toast-popup'
			className='toast'
			role='alert'
			aria-live='assertive'
			aria-atomic='true'
		>
			<div className='toast-body'>
				{type === 'success'
					? 'Your Invite Has Been Sent'
					: 'Error Sending Invite'}
			</div>
		</div>
	);
};

export default Toast;

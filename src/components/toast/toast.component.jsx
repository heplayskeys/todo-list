import React, { useEffect } from 'react';

import './toast.styles.scss';

const Toast = props => {
	const { type } = props;
	const toastTypes = {
		success: 'Your Invite Has Been Sent',
		emailSent: 'Email Sent',
		passwordUpdated: 'Password Updated',
		error: 'Error Sending Invite'
	};

	const removeToast = () => {
		const toast = document.querySelector('#toast-popup');
		setTimeout(() => {
			toast.classList.remove(`toast-${type}`);
		}, 4000);
	};

	useEffect(() => {
		const toast = document.querySelector('#toast-popup');

		switch (type) {
			case 'success':
				toast.classList.add('toast-success');
				removeToast();
				return;

			case 'emailSent':
				toast.classList.add('toast-emailSent');
				removeToast();
				return;

			case 'passwordUpdated':
				toast.classList.add('toast-passwordUpdated');
				removeToast();
				return;

			case 'error':
				toast.classList.add('toast-error');
				removeToast();
				return;

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
			<div className='toast-body'>{toastTypes[type]}</div>
		</div>
	);
};

export default Toast;

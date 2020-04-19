import React from 'react';

import './custom-button.styles.scss';

const CustomButton = ({
	children,
	isGoogleSignIn,
	inverted,
	...otherProps
}) => (
	<button
		className={`${inverted ? 'inverted' : ''}
        ${isGoogleSignIn ? 'google-sign-in' : ''}
        custom-button btn btn-sm`}
		{...otherProps}
	>
		{children}
	</button>
);

export default CustomButton;

import React from 'react';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';

import './sign-out.styles.scss';

const SignOut = () => {
	return <LoadingSpinner message='signout' />;
};

export default SignOut;

// class SignOut extends React.Component {
// 	componentDidMount() {
// 		setTimeout(() => {
// 			document.querySelector('#reset').click();
// 		}, 2000);
// 	}

// 	render() {
// 		return (
// 			<div className='loading-container'>
// 				<h1 className='animated pulse infinite'>Signing Out</h1>
// 				<div>
// 					<div className='spinner-border text-secondary big-spin' role='status'>
// 						<span className='sr-only'>Loading...</span>
// 					</div>
// 				</div>
// 				<Link id='reset' to='/' />;
// 			</div>
// 		);
// 	}
// }

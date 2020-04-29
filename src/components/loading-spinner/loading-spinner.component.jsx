import React from 'react';
import { Link } from 'react-router-dom';

import './loading-spinner.styles.scss';

class LoadingSpinner extends React.Component {
	loadingTypes = {
		userLists: 'Loading Lists',
		todoList: 'Getting Todos',
		profilePage: 'Grabbing Profile',
		contactPage: 'Loading',
		signout: 'Signing Out'
	};

	componentDidMount() {
		setTimeout(() => {
			if (this.props.message === 'signout') {
				document.querySelector('#reset').click();
			} else {
				return null;
			}
		}, 2000);
	}

	render() {
		const { message } = this.props;
		return (
			<div className='loading-container'>
				<h1 className='animated pulse infinite'>
					{this.loadingTypes[message]}
				</h1>
				<div>
					<div className='spinner-border text-secondary big-spin' role='status'>
						<span className='sr-only'>Loading...</span>
					</div>
				</div>
				<Link id='reset' to='/' />
			</div>
		);
	}
}

export default LoadingSpinner;

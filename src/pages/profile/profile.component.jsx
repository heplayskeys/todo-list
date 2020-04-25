import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ChangeDisplayName from '../../components/change-display-name/change-display-name.component';
import ChangePassword from '../../components/change-password/change-password.component';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';

import './profile.styles.scss';

const Profile = props => {
	const [state, setState] = useState({
		isLoaded: false
	});

	useEffect(() => {
		setTimeout(() => {
			setState({ isLoaded: true });
		}, 500);
	});

	const { isLoaded } = state;

	return (
		<div className='profile-page'>
			{props.currentUser && isLoaded ? (
				props.currentUser.userID === props.match.params.userID ? (
					<div className='profile-page-container'>
						<ChangeDisplayName />
						<ChangePassword
							passwordUpdateRequired={
								props.location.state
									? props.location.state.passwordUpdateRequired
									: false
							}
						/>
					</div>
				) : (
					<Redirect to={`/user/${props.currentUser.userID}/todo-lists`} />
				)
			) : (
				<LoadingSpinner message='profilePage' />
			)}
		</div>
	);
};

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

export default connect(mapStateToProps)(Profile);

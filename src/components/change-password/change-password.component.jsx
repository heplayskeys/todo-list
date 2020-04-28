import React from 'react';
import { connect } from 'react-redux';
import firebase, { auth } from '../../firebase/firebase.utils';

import FormInput from '../form-input/form-input.component';
import Toast from '../toast/toast.component';

import './change-password.styles.scss';

class ChangePassword extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentPassword: '***************',
			newPassword: '',
			confirmNewPassword: '',
			editMode: false,
			showError: false,
			errorMsg: '',
			toastType: null,
			passwordUpdateRequired: false,
			loading: false
		};
	}

	componentDidMount() {
		if (this.props.passwordUpdateRequired) {
			this.setState({
				passwordUpdateRequired: true,
				editMode: true,
				showError: true,
				errorMsg: 'Please set your new password.'
			});
		}
	}

	handleSubmit = async () => {
		this.setState({
			loading: true
		});

		const { passwordUpdateRequired, currentPassword, newPassword } = this.state;
		const user = auth.currentUser;

		if (!passwordUpdateRequired) {
			let credential = null;
			try {
				credential = firebase.auth.EmailAuthProvider.credential(
					user.email,
					currentPassword
				);
			} catch (error) {
				console.error('User Token Expired. Please try again.');
				console.error(error.message);
				user.refreshToken();
			}

			try {
				await user.reauthenticateWithCredential(credential);
			} catch (error) {
				this.setState({
					showError: true,
					errorMsg: 'Passwords do not match. Please try again.',
					toastType: null,
					loading: false
				});
				return;
			}
		}

		user
			.updatePassword(newPassword)
			.then(() => {
				this.setState({
					currentPassword: '***************',
					newPassword: '',
					confirmNewPassword: '',
					editMode: false,
					showError: false,
					errorMsg: '',
					toastType: 'passwordUpdated',
					passwordUpdateRequired: false,
					loading: false
				});
				console.log('Password saved.');
			})
			.catch(error => {
				console.error('ERROR: Unable to update password.');
				this.setState({
					showError: true,
					errorMsg: error.message,
					toastType: null,
					loading: false
				});
			});
	};

	handleChange = event => {
		const { name, value } = event.target;

		this.setState({ [name]: value });
	};

	handleClick = event => {
		event.preventDefault();
		const { name } = event.target;

		switch (name) {
			case 'edit':
				this.setState(
					{
						currentPassword: this.state.passwordUpdateRequired
							? '***************'
							: '',
						editMode: true,
						toastType: null
					},
					() => {
						document.querySelector('#current-password-input').focus();
					}
				);
				return;

			case 'save':
				const { newPassword, confirmNewPassword } = this.state;

				if (newPassword !== confirmNewPassword) {
					this.setState({
						showError: true,
						errorMsg: 'Passwords do not match. Please try again.',
						toastType: null
					});
					return;
				}

				this.handleSubmit();
				return;

			case 'cancel':
				this.setState({
					currentPassword: '***************',
					newPassword: '',
					confirmNewPassword: '',
					editMode: false,
					toastType: null
				});
				return;

			default:
				console.error('ERROR: Uh oh! Something went wrong. Please try again.');
				return;
		}
	};

	keyPressHandler = event => {
		if (this.state.inputName === '') {
			return;
		}

		if (event.key === 'Enter') {
			this.handleClick(event);
		}
	};

	render() {
		const { currentPassword, newPassword, confirmNewPassword } = this.state;
		return (
			<div className='change-password-container'>
				<h2 className='title'>Change Password</h2>
				<form className='change-password-form' onSubmit={this.handleSubmit}>
					<FormInput
						id='current-password-input'
						name='currentPassword'
						type='password'
						value={currentPassword}
						label='Current Password'
						handleChange={this.handleChange}
						disabled={!this.state.editMode || this.state.passwordUpdateRequired}
						required
					/>

					<FormInput
						name='newPassword'
						type='password'
						value={newPassword}
						label='New Password'
						handleChange={this.handleChange}
						disabled={!this.state.editMode}
						required
					/>

					<FormInput
						name='confirmNewPassword'
						type='password'
						value={confirmNewPassword}
						label='Confirm New Password'
						handleChange={this.handleChange}
						disabled={!this.state.editMode}
						required
					/>
					<div className='buttons'>
						<div className='change-password'>
							{this.state.editMode ? (
								<button
									className='btn btn-light change-password-btn'
									name='cancel'
									onClick={this.handleClick}
								>
									Cancel
								</button>
							) : null}
							{this.state.loading ? (
								<button
									className='btn btn-dark change-password-btn pw-spinner'
									disabled
								>
									<div className='spinner-border spinner-border' role='status'>
										<span className='sr-only'>Loading...</span>
									</div>
								</button>
							) : (
								<button
									type='submit'
									className='btn btn-dark change-password-btn'
									name={this.state.editMode ? 'save' : 'edit'}
									onClick={this.handleClick}
									disabled={
										(currentPassword === '' ||
											newPassword === '' ||
											confirmNewPassword === '' ||
											newPassword.length !== confirmNewPassword.length) &&
										this.state.editMode
									}
								>
									{this.state.editMode ? 'Confirm' : 'Change Password'}
								</button>
							)}
						</div>
					</div>
				</form>
				{this.state.showError ? (
					<span id='error-message' className='animated pulse infinite'>
						{this.state.errorMsg}
					</span>
				) : null}
				<div className='toast-container'>
					{this.state.toastType !== null ? (
						<Toast type={this.state.toastType} />
					) : null}
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

export default connect(mapStateToProps)(ChangePassword);

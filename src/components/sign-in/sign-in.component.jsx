import React from 'react';
import { Link } from 'react-router-dom';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';
import Toast from '../toast/toast.component';

import {
	auth,
	signInWithGoogle,
	signInViaEmail
} from '../../firebase/firebase.utils';

import './sign-in.styles.scss';

class SignIn extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			toastType: null,
			showError: false,
			errorMsg: '',
			updatePassword: false,
			loading: false
		};
	}

	componentDidMount() {
		if (auth.isSignInWithEmailLink(window.location.href)) {
			let email = localStorage.getItem('emailForSignIn');

			if (!email) {
				email = prompt('Please provide your email for confirmation');
			}

			this.setState({
				email
			});

			auth
				.signInWithEmailLink(email, window.location.href)
				.then(() => {
					localStorage.removeItem('emailForSignIn');
					this.setState({
						updatePassword: true
					});
				})
				.catch(error => {
					console.error('ERROR: Unable to verify user.');
					console.error(error.message);
				});
		}
	}

	handleSubmit = async event => {
		event.preventDefault();

		if (this.state.loading) {
			return;
		}

		const { email, password } = this.state;

		try {
			await auth.signInWithEmailAndPassword(email, password);
			this.setState({
				email: '',
				password: '',
				showError: false,
				loading: true
			});
		} catch (error) {
			console.log(error);
			this.setState({
				showError: true,
				errorMsg: error.message.slice(0, error.message.indexOf('.') + 1),
				loading: false
			});
		}
	};

	handleChange = event => {
		const { value, name } = event.target;

		this.setState({ [name]: value });
	};

	handleClick = async event => {
		event.preventDefault();
		const { name } = event.target;

		console.log('hello');

		switch (name) {
			case 'send-email':
				await signInViaEmail(this.state.email);
				this.setState(
					{
						password: '',
						toastType: 'emailSent'
					},
					() => {
						document.querySelector('#modal-close').click();
					}
				);
				return;

			case 'cancel':
				this.setState({
					email: '',
					password: ''
				});
				return;

			default:
				console.error('ERROR: Uh oh! Something went wrong. Please try again.');
				return;
		}
	};

	keyPressHandler = event => {
		if (event.key === 'Enter') {
			this.handleClick(event);
		}
	};

	render() {
		return (
			<div className='sign-in'>
				<h2 className='title'>I already have an account</h2>
				<span>Sign in with your email and password</span>
				<form onSubmit={this.handleSubmit}>
					<FormInput
						name='email'
						type='email'
						value={this.state.email}
						label='Email'
						handleChange={this.handleChange}
						required
					/>

					<FormInput
						name='password'
						type='password'
						value={this.state.password}
						label='Password'
						handleChange={this.handleChange}
						required
					/>
					<div className='buttons'>
						<div className='sign-in-btn'>
							{this.state.loading ? (
								<button
									className='btn btn-dark change-password-btn spinner-btn'
									disabled
								>
									<div className='spinner-border spinner-border' role='status'>
										<span className='sr-only'>Loading...</span>
									</div>
								</button>
							) : (
								<CustomButton style={{ width: '45%' }} type='submit'>
									Sign In
								</CustomButton>
							)}
						</div>
						<div className='google-sign-in-btn'>
							<CustomButton
								style={{ width: '65%' }}
								onClick={signInWithGoogle}
								isGoogleSignIn
							>
								Sign In with Google
							</CustomButton>
						</div>
					</div>
					<div className='forgot-password'>
						<Link
							to='#'
							className='forgot-password-link'
							data-toggle='modal'
							data-target='#forgotPasswordModal'
						>
							Forgot Password?
						</Link>
					</div>
				</form>
				{this.state.showError ? (
					<span id='error-message' className='animated pulse infinite'>
						{this.state.errorMsg}
					</span>
				) : null}
				<div className='forgot-password-modal'>
					<div
						className='modal fade'
						id='forgotPasswordModal'
						tabIndex='-1'
						role='dialog'
						aria-labelledby='createList'
						aria-hidden='true'
					>
						<div className='modal-dialog modal-dialog-centered' role='document'>
							<div className='modal-content'>
								<div className='modal-header'>
									<h5 className='modal-title' id='createListTitle'>
										Enter Email Address
									</h5>
									<button
										id='modal-close'
										type='button'
										className='close'
										data-dismiss='modal'
										aria-label='Close'
									>
										<span aria-hidden='true'>&times;</span>
									</button>
								</div>
								<div className='modal-body' style={{ paddingBottom: '0px' }}>
									<FormInput
										id='forgotEmailInput'
										name='email'
										type='text'
										value={this.state.email}
										label='Email'
										handleChange={this.handleChange}
										onKeyPress={event => this.keyPressHandler(event)}
										required
									/>
									<div className='required-field'>* Required</div>
								</div>
								<div
									className='modal-footer'
									style={{ paddingTop: '0px', borderTop: 'none' }}
								>
									<button
										type='button'
										name='cancel'
										className='btn btn-light'
										data-dismiss='modal'
										onClick={this.handleClick}
									>
										Cancel
									</button>
									<button
										type='button'
										name='send-email'
										className='btn btn-dark'
										onClick={this.handleClick}
									>
										Send
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='toast-container'>
					{this.state.toastType !== null ? (
						<Toast type={this.state.toastType} />
					) : null}
				</div>
			</div>
		);
	}
}

export default SignIn;

import React from 'react';
import { connect } from 'react-redux';
import { firestore } from '../../firebase/firebase.utils';

import FormInput from '../form-input/form-input.component';

import './change-display-name.styles.scss';

class ChangeDisplayName extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			inputName: this.props.currentUser.displayName,
			setName: this.props.currentUser.displayName,
			editMode: false,
			showError: false,
			errorMsg: ''
		};
	}

	handleSubmit = async () => {
		const { inputName } = this.state;
		const { id } = this.props.currentUser;

		const userRef = firestore.doc(`users/${id}`);
		const userSnapshot = await userRef.get();

		if (userSnapshot.exists) {
			try {
				userRef.update({
					displayName: inputName
				});
			} catch (error) {
				console.error('ERROR: Unable to update display name.');
				this.setState({
					showError: true,
					errorMsg: error.message
				});
			}
		}
	};

	handleChange = event => {
		const { value } = event.target;

		this.setState({ inputName: value });
	};

	handleClick = event => {
		event.preventDefault();
		const { name } = event.target;

		switch (name) {
			case 'edit':
				this.setState(
					{
						editMode: true
					},
					() => {
						document.querySelector('#edit-name-input').focus();
					}
				);
				return;

			case 'save':
				this.setState(
					state => ({
						inputName: state.inputName,
						setName: state.inputName,
						editMode: false
					}),
					() => {
						this.handleSubmit();
					}
				);
				return;

			case 'cancel':
				this.setState(state => ({
					inputName: state.setName,
					editMode: false
				}));
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
		return (
			<div className='change-name'>
				<h2 className='title'>Change Username</h2>

				<form onSubmit={this.handleSubmit}>
					<FormInput
						id='edit-name-input'
						name='save'
						type='text'
						maxLength={15}
						value={this.state.inputName}
						label='Username'
						handleChange={this.handleChange}
						onKeyPress={event => this.keyPressHandler(event)}
						style={this.state.editMode ? { fontWeight: 'bold' } : null}
						required
						disabled={!this.state.editMode}
					/>

					<div className='buttons'>
						<div className='edit-name'>
							{this.state.editMode ? (
								<button
									className='btn btn-light edit-name-btn'
									name='cancel'
									onClick={this.handleClick}
								>
									Cancel
								</button>
							) : null}
							<button
								type='submit'
								className='btn btn-dark edit-name-btn'
								name={this.state.editMode ? 'save' : 'edit'}
								onClick={this.handleClick}
								disabled={
									(this.state.inputName === '' ||
										this.state.inputName === this.state.setName) &&
									this.state.editMode
								}
							>
								{this.state.editMode ? 'Save' : 'Edit'}
							</button>
						</div>
					</div>
				</form>
				{this.state.showError ? (
					<span id='error-message' className='animated pulse infinite'>
						{this.state.errorMsg}
					</span>
				) : null}
			</div>
		);
	}
}

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

export default connect(mapStateToProps)(ChangeDisplayName);

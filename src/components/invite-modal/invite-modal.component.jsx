import React from 'react';
import { connect } from 'react-redux';
import { firestore } from '../../firebase/firebase.utils';

import FormInput from '../form-input/form-input.component';

import './invite-modal.styles.scss';

class InviteModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			inviteEmail: '',
			emailError: false
		};
	}

	cancelBtn = () => {
		this.setState({
			inviteEmail: '',
			emailError: false
		});
	};

	handleChange = event => {
		event.preventDefault();

		const { value } = event.target;

		this.setState({
			inviteEmail: value
		});
	};

	handleSubmit = () => {
		document.querySelector('#emailError').classList.remove('animated', 'flash');
		const { inviteEmail } = this.state;
		const { email } = this.props.currentUser;

		if (inviteEmail === email || inviteEmail === '') {
			this.setState(
				{
					emailError: true
				},
				() => {
					setTimeout(() => {
						document
							.querySelector('#emailError')
							.classList.add('animated', 'flash');
					});
				}
			);

			return;
		}

		this.dbInviteUser(inviteEmail);

		this.setState({
			inviteEmail: '',
			emailError: false
		});
		document.querySelector('#modal-close').click();
	};

	keyPressHandler = event => {
		const { inviteEmail } = this.state;
		const { email } = this.props.currentUser;

		if (inviteEmail === email) {
			this.setState({
				emailError: true
			});

			return;
		}

		if (event.key === 'Enter') {
			this.handleSubmit();
			document.querySelector('#modal-close').click();
		}
	};

	dbInviteUser = async userEmail => {
		const {
			currentUser: { displayName },
			todoListID,
			handleInvite
		} = this.props;

		const inviteData = {
			[todoListID]: displayName
		};

		let newInviteIDs = [];
		let invitedUserID = '';

		try {
			await firestore
				.collection('users')
				.where('email', '==', userEmail)
				.get()
				.then(docs =>
					docs.forEach(doc => {
						const { inviteIDs } = doc.data();

						if (Object.keys(inviteIDs).includes(todoListID)) {
							console.log('User has already been invited to this list.');
							handleInvite('error');
							return;
						} else {
							newInviteIDs = { ...inviteData, ...doc.data().inviteIDs };
							invitedUserID = doc.id;

							firestore.doc(`users/${invitedUserID}`).update({
								inviteIDs: newInviteIDs
							});
							handleInvite('success');
						}

						setTimeout(() => {
							handleInvite(null);
						}, 5000);
					})
				);
		} catch (error) {
			handleInvite(null);
			console.error('ERROR: Unable to invite user. Email not found.');
		}
	};

	render() {
		return (
			<div
				className='modal fade'
				id='inviteUser'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='createList'
				aria-hidden='true'
			>
				<div className='modal-dialog modal-dialog-centered' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='inviteUserTitle'>
								Invite to List
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
								id='userEmail'
								name='userEmail'
								type='email'
								value={this.state.inviteEmail}
								label='User Email'
								handleChange={this.handleChange}
								onKeyPress={event => this.keyPressHandler(event)}
								required
							/>
							<div
								id='emailError'
								style={
									this.state.emailError
										? { display: 'block' }
										: { display: 'none' }
								}
							>
								Invalid email address. Please try again.
							</div>
						</div>
						<div
							className='modal-footer'
							style={{ paddingTop: '0px', borderTop: 'none' }}
						>
							<button
								type='button'
								className='btn btn-secondary'
								onClick={() => this.cancelBtn()}
								data-dismiss='modal'
							>
								Cancel
							</button>
							<button
								type='button'
								className='btn btn-primary'
								onClick={() => this.handleSubmit()}
							>
								Invite
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

export default connect(mapStateToProps)(InviteModal);

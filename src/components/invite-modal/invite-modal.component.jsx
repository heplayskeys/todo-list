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
			inviteEmail: value,
			emailError: false
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
			currentUser: { id, displayName, email, invitesSent },
			todoListID,
			handleInvite
		} = this.props;

		const inviteData = {
			[todoListID]: { displayName, email }
		};

		try {
			const updateRef = firestore.collection('users');
			const updateSnapshot = await updateRef.get();
			updateSnapshot.docs.forEach(doc => {
				console.log(doc.data().userID, this.props.adminID);

				if (doc.data().email === userEmail) {
					if (
						Object.keys(doc.data().inviteIDs).includes(todoListID) ||
						doc.data().userID === this.props.adminID
					) {
						console.error('ERROR: Unable to send invite to this user.');
						handleInvite('error');
						return;
					} else {
						updateRef.doc(doc.id).update({
							inviteIDs: { ...inviteData, ...doc.data().inviteIDs }
						});
						handleInvite('success');
					}

					setTimeout(() => {
						handleInvite(null);
					}, 5000);
					return;
				}
			});

			try {
				const currentUserRef = firestore.doc(`users/${id}`);
				await currentUserRef.get().then(() => {
					let inviteData = invitesSent[userEmail];
					let updatedInviteData = [];

					if (inviteData === undefined || inviteData.includes(todoListID)) {
						updatedInviteData = [todoListID];
					} else {
						updatedInviteData = [todoListID, ...inviteData];
					}

					const updateData = {
						...invitesSent,
						[userEmail]: updatedInviteData
					};

					currentUserRef.update({
						invitesSent: updateData
					});
				});
			} catch (error) {
				console.error('ERROR: Unable to update invites.');
			}
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
								onKeyPress={this.keyPressHandler}
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

// .filter(doc => doc.data().email === userEmail)[0]
// .data();

// .where('email', '==', userEmail)
// .get()
// .then(docs =>
// 	docs.forEach(doc => {
// 		const { inviteIDs } = doc.data();

// 		if (Object.keys(inviteIDs).includes(todoListID)) {
// 			console.log('User has already been invited to this list.');
// 			handleInvite('error');
// 			return;
// 		} else {
// 			newInviteIDs = { ...inviteData, ...doc.data().inviteIDs };
// 			invitedUserID = doc.id;

// 			firestore.doc(`users/${invitedUserID}`).update({
// 				inviteIDs: newInviteIDs
// 			});
// 			handleInvite('success');

// 			let currentUserInviteData = {
// 				[todoListID]: doc.data().userID
// 			};

// 			firestore.doc(`users/${userID}`).update({
// 				invitesSent: currentUserInviteData
// 			});
// 		}

// 		setTimeout(() => {
// 			handleInvite(null);
// 		}, 5000);
// 	})
// );

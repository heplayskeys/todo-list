import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { firestore } from '../../firebase/firebase.utils';

import CustomButton from '../../components/custom-button/custom-button.component';
import FormInput from '../../components/form-input/form-input.component';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';
import Toast from '../../components/toast/toast.component';
// import SearchField from '../../components/search-field/search-field.component';

import shortid from 'shortid';

import './user-lists.styles.scss';

class UserLists extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			listName: '',
			todoLists: [],
			invitedLists: {},
			isLoaded: false,
			toastType: null,
			listSearch: ''
		};
	}

	componentDidMount() {
		if (this.props.currentUser) {
			this.initialize();
		} else {
			this.setState({
				isLoaded: false
			});
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.currentUser !== this.props.currentUser) {
			this.getLists().then(listData => {
				const userLists = listData.filter(
					list =>
						this.props.currentUser.todoListIDs.includes(list.id) ||
						Object.keys(this.props.currentUser.inviteIDs).includes(list.id)
				);

				userLists.sort((list1, list2) => list2.createdAt - list1.createdAt);

				const invitedUserLists = { ...this.props.currentUser.inviteIDs };

				this.setState({
					todoLists: userLists,
					invitedLists: invitedUserLists,
					isLoaded: true
				});
			});
		}
	}

	initialize = () => {
		this.getLists().then(listData => {
			const userLists = listData.filter(
				list =>
					this.props.currentUser.todoListIDs.includes(list.id) ||
					Object.keys(this.props.currentUser.inviteIDs).includes(list.id)
			);

			userLists.sort((list1, list2) => list2.createdAt - list1.createdAt);

			const invitedUserLists = { ...this.props.currentUser.inviteIDs };

			setTimeout(() => {
				this.setState({
					todoLists: userLists,
					invitedLists: invitedUserLists,
					isLoaded: true
				});
			}, 500);
		});
	};

	createTodoList = async () => {
		if (this.state.listName === '') {
			return;
		}

		if (this.props.currentUser) {
			const { id, userID, todoListIDs, displayName } = this.props.currentUser;
			const newListID = shortid.generate().substr(0, 4);
			const listRef = firestore.doc(`todoLists/${newListID}`);
			const listSnapshot = await listRef.get();

			if (!listSnapshot.exists) {
				const createdAt = Date.now();

				try {
					listRef.set({
						id: newListID,
						adminID: userID,
						createdBy: displayName,
						contributorIDs: [id],
						activeContributors: [],
						listName: this.state.listName,
						todos: [],
						todoFilter: 'all',
						descending: true,
						createdAt,
						lastUpdated: createdAt
					});
				} catch (error) {
					console.error('ERROR: Unable to create todo list', error.message);
				}

				document.querySelector('#modal-close').click();

				this.getLists().then(listData => {
					const userLists = listData.filter(
						list =>
							this.props.currentUser.todoListIDs.includes(list.id) ||
							Object.keys(this.props.currentUser.inviteIDs).includes(list.id)
					);

					userLists.sort((list1, list2) => list2.createdAt - list1.createdAt);

					const invitedUserLists = { ...this.props.currentUser.inviteIDs };

					this.setState({
						listName: '',
						todoLists: userLists,
						invitedLists: invitedUserLists
					});
				});

				this.updateUserTodoIDs(id, newListID, todoListIDs);

				return listRef;
			}
		}
	};

	getLists = async () => {
		const todoLists = [];

		const listRef = firestore.collection('todoLists');
		const listSnapshot = await listRef.get();
		const listData = listSnapshot.docs;

		listData.forEach(async list => {
			todoLists.unshift(list.data());
			const updateRef = firestore.doc(`todoLists/${list.id}`);
			const updateSnap = await updateRef.get();
			updateRef.update({
				activeContributors: updateSnap
					.data()
					.activeContributors.filter(id => id !== this.props.currentUser.userID)
			});
		});

		return todoLists;
	};

	updateUserTodoIDs = async (userID, newListID, currentListIDs) => {
		const userRef = firestore.doc(`users/${userID}`);
		const userSnapshot = await userRef.get();

		if (userSnapshot.exists) {
			try {
				userRef
					.update({
						todoListIDs: [...currentListIDs, newListID]
					})
					.then(() => {
						this.updateContributors(newListID);
					});
			} catch (error) {
				console.error('ERROR: Unable to update todo lists', error.message);
			}
		}
	};

	handleChange = event => {
		event.preventDefault();

		const { value } = event.target;

		this.setState({
			listName: value
		});
	};

	keyPressHandler = event => {
		if (this.state.listName === '') {
			return;
		}

		if (event.key === 'Enter') {
			this.createTodoList();
			document.querySelector('#modal-close').click();
		}
	};

	handleInvite = async (response, listID) => {
		const { id, inviteIDs, todoListIDs } = this.props.currentUser;
		let updatedTodoLists = [];
		let updatedInvitedLists = {};

		const currentUserRef = firestore.doc(`users/${id}`);
		await currentUserRef.get().then(() => {
			// Remove invited list from inviteIDs
			updatedInvitedLists = inviteIDs;
			delete updatedInvitedLists[listID];

			if (response === 'accept') {
				// Add invited to todo lists
				updatedTodoLists = [listID, ...todoListIDs];
				this.updateContributors(listID);
				this.setState({
					toastType: 'inviteAccepted'
				});
			} else {
				// Leave todo lists as is
				updatedTodoLists = [...todoListIDs];
			}

			currentUserRef.update({
				todoListIDs: updatedTodoLists,
				inviteIDs: updatedInvitedLists
			});
		});
	};

	searchLists = value => {
		this.setState({
			listSearch: value
		});
	};

	updateContributors = async listID => {
		const { id } = this.props.currentUser;
		const listPageRef = firestore.doc(`todoLists/${listID}`);
		await listPageRef.get().then(doc => {
			if (!doc.data().contributorIDs.includes(id)) {
				const updatedContributors = [...doc.data().contributorIDs, id];
				listPageRef.update({
					contributorIDs: updatedContributors
				});
			} else {
				return;
			}
		});
	};

	render() {
		const { match } = this.props;
		const { listName, todoLists, invitedLists } = this.state;

		let mappedTodos = todoLists.map(list => {
			return list.listName
				.toLowerCase()
				.includes(this.state.listSearch.toLocaleLowerCase()) ? (
				<div key={list.id} id={list.id} className='todo-list-div'>
					<div>
						<Link
							listid={list.id}
							to={{
								pathname: Object.keys(invitedLists).includes(list.id)
									? `${match.url}`
									: `${match.url}/todo-list/${list.id}`,
								state: { ...list }
							}}
							className={
								Object.keys(invitedLists).includes(list.id) ? 'invited' : ''
							}
						>
							<span className='dot'>&#9999; </span>
							{list.listName}
						</Link>
						{Object.keys(invitedLists).includes(list.id) ? (
							<div className='invite-options'>
								<Link
									to='#'
									className='badge badge-success accept'
									onClick={() => this.handleInvite('accept', list.id)}
								>
									Accept
								</Link>
								<Link
									to='#'
									className='badge badge-danger decline'
									onClick={() => this.handleInvite('decline', list.id)}
								>
									Decline
								</Link>
							</div>
						) : null}
					</div>
					<div className='list-details'>{`Created by ${
						list.createdBy
					} on ${new Date(list.createdAt).toLocaleDateString()}`}</div>
				</div>
			) : null;
		});

		return !this.state.isLoaded ? (
			<LoadingSpinner message='userLists' />
		) : (
			<div className='lists-container'>
				<div className='list-header'>
					<h2 className='user-greeting'>{`Hello, ${
						this.props.currentUser
							? this.props.currentUser.displayName
							: 'there'
					}!`}</h2>
				</div>

				<div className='user-todo-lists'>
					<div className='active-todo-lists-title'>
						<h4>Active ToDo Lists:</h4>
						<div className='form-inline my-2 my-lg-0'>
							<input
								className='form-control mr-sm-2'
								type='search'
								placeholder='Search Lists'
								aria-label='Search'
								onChange={event => {
									event.preventDefault();
									this.setState({
										listSearch: event.target.value
									});
								}}
							/>
							<i className='material-icons mag-glass'>search</i>
						</div>
					</div>
					<div className='listed-todo-lists'>
						<div className='lists'>{mappedTodos}</div>
					</div>
				</div>
				<div className='add-todo-list-btn'>
					<CustomButton
						data-toggle='modal'
						data-target='#createList'
						onClick={() =>
							setTimeout(
								() => document.querySelector('#newListName').focus(),
								500
							)
						}
					>
						Add New Todo List
					</CustomButton>

					<div
						className='modal fade'
						id='createList'
						tabIndex='-1'
						role='dialog'
						aria-labelledby='createList'
						aria-hidden='true'
					>
						<div className='modal-dialog modal-dialog-centered' role='document'>
							<div className='modal-content'>
								<div className='modal-header'>
									<h5 className='modal-title' id='createListTitle'>
										Create New Todo List
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
										id='newListName'
										name='listName'
										type='text'
										value={listName}
										label='List Name'
										handleChange={this.handleChange}
										onKeyPress={event => this.keyPressHandler(event)}
										maxLength={35}
										required
									/>
									<div className='required-field'>* Required</div>
								</div>
								<div
									className='modal-footer'
									style={{ paddingTop: '0px', borderTop: 'none' }}
								>
									<div className='max-characters'>{`${this.state.listName.length} characters (maximum 35 characters)`}</div>
									<button
										type='button'
										className='btn btn-secondary'
										data-dismiss='modal'
									>
										Cancel
									</button>
									<button
										type='button'
										className='btn btn-primary'
										onClick={() => this.createTodoList()}
									>
										Create
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

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

export default connect(mapStateToProps)(UserLists);

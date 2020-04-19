import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import CustomButton from '../../components/custom-button/custom-button.component';
import FormInput from '../../components/form-input/form-input.component';

import shortid from 'shortid';
import { firestore } from '../../firebase/firebase.utils';

import './user-lists.styles.scss';

class UserLists extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			listName: '',
			todoLists: []
		};
	}

	componentDidMount() {
		this.getLists().then(listData => {
			const userLists = listData.filter(list =>
				this.props.currentUser.todoListIDs.includes(list.id)
			);

			this.setState({
				todoLists: userLists
			});
		});
	}

	createTodoList = async () => {
		if (this.state.listName === '') {
			return;
		}

		if (this.props.currentUser) {
			const { id, userID, todoListIDs } = this.props.currentUser;
			const newListID = shortid.generate().substr(0, 4);
			const listRef = firestore.doc(`todoLists/${newListID}`);
			const listSnapshot = await listRef.get();

			if (!listSnapshot.exists) {
				const createdAt = new Date();

				try {
					listRef.set({
						id: newListID,
						adminID: userID,
						contributorIDs: [],
						listName: this.state.listName,
						todoIDs: [],
						createdAt
					});
				} catch (error) {
					console.log('Error creating todo list', error.message);
				}

				this.getLists().then(listData => {
					const userLists = listData.filter(list =>
						this.props.currentUser.todoListIDs.includes(list.id)
					);

					this.setState({
						listName: '',
						todoLists: userLists
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

		listData.forEach(list => {
			todoLists.unshift(list.data());
		});

		return todoLists;
	};

	updateUserTodoIDs = async (userID, newListID, currentListIDs) => {
		const userRef = firestore.doc(`users/${userID}`);
		const userSnapshot = await userRef.get();

		if (userSnapshot.exists) {
			try {
				userRef.update({
					todoListIDs: [...currentListIDs, newListID]
				});
			} catch (error) {
				console.log("Error updating user's todo lists", error.message);
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

	render() {
		const { history, location, match } = this.props;
		const { listName, todoLists } = this.state;

		let mappedTodos = todoLists.map(list => {
			return (
				<li key={list.id} id={list.id} className='todo-list-li'>
					<Link to={`${match.url}/todo-list/${list.id}`}>{list.listName}</Link>
				</li>
			);
		});

		return (
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
					</div>
					<div className='listed-todo-lists'>
						<ul>{mappedTodos}</ul>
					</div>
				</div>
				<div className='add-todo-list-btn'>
					<CustomButton data-toggle='modal' data-target='#createList'>
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
										type='button'
										className='close'
										data-dismiss='modal'
										aria-label='Close'
									>
										<span aria-hidden='true'>&times;</span>
									</button>
								</div>
								<div className='modal-body'>
									<FormInput
										name='listName'
										type='text'
										value={listName}
										label='List Name'
										handleChange={this.handleChange}
										required
									/>
								</div>
								<div className='modal-footer'>
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
										data-dismiss='modal'
									>
										Create
									</button>
								</div>
							</div>
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

export default connect(mapStateToProps)(UserLists);

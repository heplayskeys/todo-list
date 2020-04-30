import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { firestore } from '../../firebase/firebase.utils';

import TodoForm from '../../components/todo-form/todo-form.component';
import Todo from '../../components/todo/todo.component';
import ListTitle from '../../components/list-title/list-title.component';
import CustomButton from '../../components/custom-button/custom-button.component';
import InviteModal from '../../components/invite-modal/invite-modal.component';
import Toast from '../../components/toast/toast.component';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';
import ReactTooltip from 'react-tooltip';

import './todo-list.styles.scss';

class TodoListPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			allTodos: [],
			todos: [],
			todoFilter: 'all',
			descending: true,
			toastType: null,
			lastUpdated: null,
			isLoaded: false,
			loggedIn: false,
			contributorIDs: [],
			activeContributors: [],
			id: this.currentUser ? this.props.location.state.id : null,
			todoSearch: ''
		};

		this.unsubscribeFromList = null;
	}

	dragSrcIndex = null;

	componentDidMount() {
		this.fetchListData();

		if (!this.props.currentUser) {
			if (this.props.match.url === '/') {
				setTimeout(() => {
					this.setState({
						isLoaded: true
					});
				}, 1000);
			}
		}
	}

	componentDidUpdate() {
		const { currentUser } = this.props;
		const { userID } = this.props.match.params;

		if (currentUser) {
			if (
				currentUser.userID !== userID ||
				!currentUser.todoListIDs.includes(this.state.id)
			) {
				this.renderRedirect();
				return;
			} else if (!this.state.loggedIn && !this.state.isLoaded) {
				this.setState(
					{
						loggedIn: true,
						isLoaded: true
					},
					async () => {
						const listRef = firestore.doc(`todoLists/${this.state.id}`);
						const listSnap = await listRef.get();
						const activeUsers = [...listSnap.data().activeContributors];

						if (!activeUsers.includes(currentUser.userID)) {
							activeUsers.push(currentUser.userID);
						}

						listRef
							.update({
								activeContributors: activeUsers
							})
							.then(() => {
								this.setState({
									activeContributors: activeUsers
								});
							});
					}
				);
			}
		}
	}

	componentWillUnmount() {
		if (!this.state.loggedIn || !this.props.currentUser) {
			return;
		}

		if (this.props.currentUser) {
			this.unsubscribeFromList();
		}
	}

	fetchListData = () => {
		if (this.props.location.state !== undefined) {
			this.unsubscribeFromList = firestore
				.collection('todoLists')
				.doc(`${this.props.location.state.id}`)
				.onSnapshot(doc => {
					if (this.state.todos === undefined || !doc.data()) {
						this.renderRedirect();
						return;
					}

					if (!this.state.todos.length) {
						this.setState({
							...doc.data()
						});
						return;
					}

					if (this.state.todos.length < doc.data().todos.length) {
						let updatedTodos = this.state.descending
							? [doc.data().todos[0], ...this.state.todos]
							: [...this.state.todos, doc.data().todos[0]];
						this.setState({
							...doc.data(),
							todos: updatedTodos
						});
					} else if (this.state.todos.length > doc.data().todos.length) {
						let currentTodos = this.state.todos;
						let updatedTodosIDs = [];

						doc.data().todos.forEach(todo => {
							updatedTodosIDs.push(todo.id);
						});

						let updatedTodos = currentTodos.filter(todo => {
							return updatedTodosIDs.includes(todo.id);
						});
						this.setState({
							...doc.data(),
							todos: updatedTodos
						});
					} else if (this.state.todos.length === doc.data().todos.length) {
						let currentTodos = this.state.todos;
						let updatedTodos = [];

						currentTodos.forEach(todo => {
							for (let i = 0; i < currentTodos.length; i++) {
								if (todo.id === doc.data().todos[i].id) {
									updatedTodos.push(doc.data().todos[i]);
									break;
								}
							}
						});
						this.setState({
							...doc.data(),
							todos: updatedTodos
						});
					}
				});
		} else {
			return;
		}
	};

	renderRedirect = () => {
		document.querySelector('#home').click();
	};

	setTodo = (updateTodo, text) => {
		const updatedTodos = this.state.todos.map(todo => {
			if (todo.id === updateTodo.id) {
				return {
					...todo,
					text: text
				};
			} else {
				return todo;
			}
		});

		this.setState({
			todos: updatedTodos
		});

		this.updateDB();
	};

	addTodo = todo => {
		this.setState(state => ({
			todos: [todo, ...state.todos]
		}));

		this.updateDB();
	};

	deleteTodo = (id, contributorID) => {
		if (this.state.loggedIn) {
			const { userID } = this.props.currentUser;
			const { adminID } = this.state;

			if (userID === contributorID || userID === adminID) {
				this.setState(state => ({
					todos: state.todos.filter(todo => todo.id !== id)
				}));

				this.updateDB(true);
			} else {
				return;
			}
		} else {
			this.setState(state => ({
				todos: state.todos.filter(todo => todo.id !== id)
			}));
		}
	};

	deleteCompleteTodos = () => {
		this.setState(state => ({
			todos: state.todos.filter(todo => !todo.complete)
		}));

		this.updateDB(true);
	};

	markAllComplete = () => {
		this.setState(state => ({
			todos: state.todos.map(todo => ({
				...todo,
				complete: true
			}))
		}));

		this.updateDB();
	};

	setAllActive = () => {
		this.setState(state => ({
			todos: state.todos.map(todo => ({
				...todo,
				complete: false
			}))
		}));

		this.updateDB();
	};

	filterTodos = event => {
		this.setState({
			todoFilter: event.target.name
		});
	};

	reverseSortTodos = () => {
		this.setState(state => ({
			descending: !state.descending,
			todos: state.todos.reverse()
		}));
	};

	toggleComplete = id => {
		this.setState(state => ({
			todos: state.todos.map(todo => {
				if (todo.id === id) {
					todo.complete = !todo.complete;
				}
				return todo;
			})
		}));

		this.updateDB();
	};

	handleInvite = toastMsg => {
		this.setState({
			toastType: toastMsg
		});
	};

	handleListName = name => {
		if (name !== this.state.listName) {
			this.setState(
				{
					listName: name
				},
				() => this.updateDB()
			);
		}
	};

	updateDB = async (deleteAction = false) => {
		if (!this.state.loggedIn) {
			return;
		}

		const { id } = this.props.location.state;
		const todoListRef = firestore.doc(`todoLists/${id}`);
		const todoListSnapshot = await todoListRef.get();

		if (!todoListSnapshot.exists) {
			alert('List has been deleted.');
			this.renderRedirect();
			return;
		}

		let todoIDs = [];
		const updatedTodos = this.state.todos;

		updatedTodos.forEach(todo => {
			if (!todoIDs.includes(todo.id)) {
				todoIDs.push(todo.id);
			}
		});

		if (!deleteAction) {
			todoListSnapshot.data().todos.forEach(todo => {
				if (!todoIDs.includes(todo.id)) {
					todoIDs.push(todo.id);
					updatedTodos.push(todo);
				}
			});
		}

		try {
			const { descending, listName, todoFilter } = this.state;
			const updatedAt = Date.now();
			todoListRef.update({
				descending,
				listName,
				todoFilter,
				todos: updatedTodos.map(todo => todo),
				lastUpdated: updatedAt
			});
		} catch (error) {
			console.log('Error deleting todo', error.message);
		}

		return;
	};

	handleDragStart = event => {
		if (this.state.updating) {
			return;
		}

		event.currentTarget.style.opacity = '0.4';
		this.dragSrcIndex = event.currentTarget.id;

		event.dataTransfer.effectAllowed = 'move';
	};

	handleDragOver = event => {
		event.stopPropagation();
		event.preventDefault();

		event.dataTransfer.dropEffect = 'move';

		return false;
	};

	handleDragEnter = event => {
		event.stopPropagation();
		event.preventDefault();

		if (event.target.classList[0].includes('material-icons')) {
			event.target.classList.add('over');
		}
	};

	handleDragLeave = event => {
		event.stopPropagation();
		event.preventDefault();

		event.target.classList.remove('over');
	};

	handleDrop = event => {
		event.stopPropagation();
		event.preventDefault();

		if (this.dragSrcIndex !== event.currentTarget.id) {
			let updateTodos = this.state.todos;
			let movedTodo = updateTodos.splice(this.dragSrcIndex, 1)[0];

			console.log(event.currentTarget.id);

			if (event.currentTarget.id === 0) {
				updateTodos.unshift(movedTodo);
			}

			if (event.currentTarget.id === `${this.state.todos.length}`) {
				console.log('hello');
				updateTodos.push(movedTodo);
			} else {
				updateTodos.splice(event.currentTarget.id, 0, movedTodo);
			}

			this.setState({
				todos: updateTodos
			});
		}

		return false;
	};

	handleDragEnd = event => {
		event.stopPropagation();
		event.preventDefault();

		event.currentTarget.style.opacity = 1;
		document.querySelectorAll('.material-icons').forEach(icon => {
			icon.classList.remove('over');
		});
	};

	render() {
		const todoContainers = document.querySelectorAll('.todo-container');

		[].forEach.call(todoContainers, container => {
			container.addEventListener('dragstart', this.handleDragStart, false);
			container.addEventListener('dragenter', this.handleDragEnter, false);
			container.addEventListener('dragover', this.handleDragOver, false);
			container.addEventListener('dragleave', this.handleDragLeave, false);
			container.addEventListener('drop', this.handleDrop, false);
			container.addEventListener('dragend', this.handleDragEnd, false);
		});

		let todos = [];
		let clearTodosBtn = this.state.todos.some(todo => todo.complete) ? (
			<button className='dropdown-item' onClick={this.deleteCompleteTodos}>
				Clear Completed
			</button>
		) : (
			<button className='dropdown-item' disabled>
				Clear Completed
			</button>
		);

		let allComplete = this.state.todos.some(todo => !todo.complete) ? (
			<button className='dropdown-item' onClick={this.markAllComplete}>
				Mark All Complete
			</button>
		) : (
			<button className='dropdown-item' disabled>
				Mark All Complete
			</button>
		);

		let allActive = this.state.todos.some(todo => todo.complete) ? (
			<button className='dropdown-item' onClick={this.setAllActive}>
				Set All Active
			</button>
		) : (
			<button className='dropdown-item' disabled>
				Set All Active
			</button>
		);

		let reverseSort = (
			<button className='dropdown-item' onClick={() => this.reverseSortTodos()}>
				Reverse Sort
				{this.state.descending ? (
					<span id='sort-arrow'>&#8673;</span>
				) : (
					<span id='sort-arrow'>&#8675;</span>
				)}
			</button>
		);

		let bulkActionsDropdown = (
			<div className='btn-group btn-container' role='group'>
				<button
					id='bulk-actions-dropdown'
					type='button'
					className='btn btn-sm btn-secondary dropdown-toggle'
					data-toggle='dropdown'
					aria-haspopup='true'
					aria-expanded='false'
				>
					Bulk Actions
				</button>
				<div className='dropdown-menu' aria-labelledby='btnGroupDrop1'>
					{reverseSort}
					{allComplete}
					{allActive}
					{clearTodosBtn}
				</div>
			</div>
		);

		switch (this.state.todoFilter) {
			case 'active':
				todos = this.state.todos.filter(todo => !todo.complete);
				break;

			case 'completed':
				todos = this.state.todos.filter(todo => todo.complete);
				break;

			default:
				todos = this.state.todos;
		}

		return !this.state.isLoaded ? (
			this.props.currentUser ? (
				<LoadingSpinner message='todoList' />
			) : (
				<LoadingSpinner message='contactPage' />
			)
		) : (
			<div className='list-page-container'>
				{this.props.currentUser ? (
					<div className='contributor-count' data-tip='Currently Active Users'>
						{this.state.activeContributors.length}
						<ReactTooltip place='left' />
					</div>
				) : null}
				<ListTitle
					listID={this.state.id}
					listName={this.state.listName}
					listAdmin={this.state.adminID}
					handleListName={this.handleListName}
				/>
				<TodoForm onSubmit={this.addTodo} />
				<div className='filter-buttons'>
					<div>
						<span>Show:</span>
						<div className='btn-group'>
							<button
								className={`btn btn-sm ${
									this.state.todoFilter === 'all'
										? 'btn-secondary'
										: 'btn-outline-secondary'
								}`}
								name='all'
								onClick={this.filterTodos}
							>
								All
							</button>
							<button
								className={`btn btn-sm ${
									this.state.todoFilter === 'active'
										? 'btn-secondary'
										: 'btn-outline-secondary'
								}`}
								name='active'
								onClick={this.filterTodos}
							>
								Active
							</button>
							<button
								className={`btn btn-sm ${
									this.state.todoFilter === 'completed'
										? 'btn-secondary'
										: 'btn-outline-secondary'
								}`}
								name='completed'
								onClick={this.filterTodos}
							>
								Completed
							</button>
						</div>
					</div>
					<div className='bulk-actions bulk-actions-dropdown'>
						{bulkActionsDropdown}
					</div>
					<div className='form-inline my-2 my-lg-0 search-input'>
						<input
							className='form-control mr-sm-2'
							type='search'
							placeholder='Search Lists'
							aria-label='Search'
							onChange={event => {
								event.preventDefault();
								this.setState({
									todoSearch: event.target.value
								});
							}}
						/>
						<i className='material-icons mag-glass'>search</i>
					</div>
				</div>
				<div className='todo-list-container'>
					{todos.map((todo, index) => {
						return todo.text
							.toLowerCase()
							.includes(this.state.todoSearch.toLowerCase()) ? (
							<div
								id={index}
								key={index}
								className='single-todo-container'
								draggable='true'
								onDragStart={this.handleDragStart}
								onDragOver={this.handleDragOver}
								onDragEnter={this.handleDragEnter}
								onDragLeave={this.handleDragLeave}
								onDragEnd={this.handleDragEnd}
								onDrop={this.handleDrop}
								updating={this.state.updating}
							>
								<Todo
									key={todo.id}
									todoId={todo.id}
									deleteTodo={() =>
										this.deleteTodo(todo.id, todo.contributorID)
									}
									toggleComplete={() => this.toggleComplete(todo.id)}
									todo={todo}
									contributorID={todo.contributorID}
									adminID={this.state.adminID}
									listID={this.state.id}
									setTodo={this.setTodo}
									textValue={todo.text}
									index={index}
								/>
							</div>
						) : null;
					})}
				</div>
				<div
					className='more-todos'
					style={todos.length > 6 ? { display: 'block' } : { display: 'none' }}
				>
					<span
						role='img'
						aria-label='additional-items'
						aria-labelledby='additional-items'
					>
						&#9899;
					</span>
				</div>
				<div className='active-todos'>
					Still Todos: {this.state.todos.filter(todo => !todo.complete).length}
					{this.props.currentUser ? (
						this.props.currentUser.userID === this.state.adminID ? (
							<div className='list-extras'>
								<CustomButton
									className='invite-btn btn btn-outline-dark'
									data-toggle='modal'
									data-target='#inviteUser'
									onClick={() =>
										setTimeout(
											() => document.querySelector('#userEmail').focus(),
											500
										)
									}
								>
									Invite to List
								</CustomButton>
								<InviteModal
									handleInvite={this.handleInvite}
									todoListID={this.state.id}
									adminID={this.state.adminID}
								/>
							</div>
						) : null
					) : (
						<div className='list-extras'>
							<Link className='sign-btn btn btn-outline-dark' to='/signin'>
								Sign Up
							</Link>
							<span>* Sign Up to Save Your Lists</span>
						</div>
					)}
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

export default connect(mapStateToProps)(TodoListPage);

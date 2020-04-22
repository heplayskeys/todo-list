import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { firestore } from '../../firebase/firebase.utils';

import TodoForm from '../../components/todo-form/todo-form.component';
import Todo from '../../components/todo/todo.component';
import ListTitle from '../../components/list-title/list-title.component';
import CustomButton from '../../components/custom-button/custom-button.component';
import InviteModal from '../../components/invite-modal/invite-modal.component';
import Toast from '../../components/toast/toast.component';

import './todo-list.styles.scss';

class TodoListPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			allTodos: [],
			todos: [],
			todoFilter: 'all',
			descending: true,
			toastType: null
		};
	}

	async componentDidMount() {
		if (this.props.match.url === '/' && this.props.currentUser) {
			return (
				<Redirect to={`/user/${this.props.currentUser.userID}/todo-lists`} />
			);
		}

		const { todoListID } = this.props.match.params;
		const todoListRef = firestore.doc(`todoLists/${todoListID}`);
		todoListRef.get().then(todoList => this.setState({ ...todoList.data() }));

		if (!this.state.descending) {
			this.reverseSortTodos();
		}
	}

	addTodo = async todo => {
		this.setState(state => ({
			todos: [todo, ...state.todos]
		}));

		this.updateDB();
	};

	deleteTodo = async (id, contributorID) => {
		const { userID } = this.props.currentUser;

		if (userID === contributorID) {
			return;
		}

		this.setState(state => ({
			todos: state.todos.filter(todo => todo.id !== id)
		}));

		this.updateDB();
	};

	deleteCompleteTodos = () => {
		this.setState(state => ({
			todos: state.todos.filter(todo => !todo.complete)
		}));

		this.updateDB();
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

		this.updateDB();
	};

	reverseSortTodos = todos => {
		let reverseTodos = [];
		todos.forEach(todo => {
			reverseTodos.unshift(todo);
		});

		this.setState(state => ({
			todos: reverseTodos,
			descending: !state.descending
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

	handleInvite = async toastMsg => {
		this.setState({
			toastType: toastMsg
		});
	};

	updateDB = async () => {
		const { todoListID } = this.props.match.params;
		const todoListRef = firestore.doc(`todoLists/${todoListID}`);
		const todoListSnapshot = await todoListRef.get();

		if (todoListSnapshot.exists) {
			try {
				todoListRef.update({
					...this.state
				});
			} catch (error) {
				console.log('Error deleting todo', error.message);
			}
		}
	};

	render() {
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
			<button
				className='dropdown-item'
				onClick={() => this.reverseSortTodos(todos)}
			>
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

		return (
			<div className='list-page-container'>
				<ListTitle listID={this.state.id} listName={this.state.listName} />
				<TodoForm onSubmit={this.addTodo} />
				<div className='filter-buttons'>
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
					<div className='bulk-actions bulk-actions-dropdown'>
						{bulkActionsDropdown}
					</div>
				</div>
				<div className='todo-list-container'>
					{todos.map(todo => (
						<Todo
							key={todo.id}
							id={todo.id}
							deleteTodo={() => this.deleteTodo(todo.id, todo.contributorID)}
							toggleComplete={() => this.toggleComplete(todo.id)}
							todo={todo}
							contributorID={todo.contributorID}
							adminID={this.state.adminID}
						/>
					))}
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
						<div className='list-extras'>
							<CustomButton
								className='invite-btn btn btn-outline-dark'
								data-toggle='modal'
								data-target='#inviteUser'
								onClick={this.handleInvite}
							>
								Invite to List
							</CustomButton>
							<InviteModal
								handleInvite={this.handleInvite}
								todoListID={this.state.id}
								adminID={this.state.adminID}
							/>
						</div>
					) : (
						<div className='list-extras'>
							<Link className='sign-btn btn btn-outline-dark' to='/signin'>
								Sign Up
							</Link>
							<span>* Sign Up to Save Your Lists</span>
						</div>
					)}
				</div>
				{this.state.toastType !== null ? (
					<Toast type={this.state.toastType} />
				) : null}
			</div>
		);
	}
}

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

export default connect(mapStateToProps)(TodoListPage);

// {
// 	this.props.currentUser ? (
// 		<div className='sign-up-save'>
// 			<CustomButton
// 				className='invite-btn btn btn-outline-dark'
// 				onClick={this.handleInvite}
// 			>
// 				Invite to List
// 			</CustomButton>
// 		</div>
// 	) : (
// 		<div className='sign-up-save'>
// 			<Link className='sign-btn btn btn-outline-dark' to='/signin'>
// 				Sign Up
// 			</Link>
// 			<span>* Sign Up to Save Your Lists</span>
// 		</div>
// 	);
// }

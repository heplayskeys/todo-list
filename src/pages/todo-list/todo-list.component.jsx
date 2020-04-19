import React from 'react';

import TodoForm from '../../components/todo-form/todo-form.component';
import Todo from '../../components/todo/todo.component';
import ListTitle from '../../components/list-title/list-title.component';
import './todo-list.styles.scss';

class TodoListPage extends React.Component {
	constructor() {
		super();

		this.state = {
			todos: [],
			todoFilter: 'all',
			descending: true
		};
	}

	addTodo = todo => {
		this.setState(state => ({
			todos: [todo, ...state.todos]
		}));
	};

	deleteTodo = id => {
		this.setState(state => ({
			todos: state.todos.filter(todo => todo.id !== id)
		}));
	};

	deleteCompleteTodos = () => {
		this.setState(state => ({
			todos: state.todos.filter(todo => !todo.complete)
		}));
	};

	markAllComplete = () => {
		this.setState(state => ({
			todos: state.todos.map(todo => ({
				...todo,
				complete: true
			}))
		}));
	};

	setAllActive = () => {
		this.setState(state => ({
			todos: state.todos.map(todo => ({
				...todo,
				complete: false
			}))
		}));
	};

	filterTodos = event => {
		this.setState({
			todoFilter: event.target.name
		});
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
	};

	render() {
		//    console.log(this.props); to see Router objects
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
				<ListTitle />
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
							deleteTodo={() => this.deleteTodo(todo.id)}
							toggleComplete={() => this.toggleComplete(todo.id)}
							todo={todo}
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
				</div>
			</div>
		);
	}
}

export default TodoListPage;

// <div className="bulk-actions">
//   {allComplete}
//   {allActive}
//   {clearTodosBtn}
// </div>;

// let clearTodosBtn = this.state.todos.some(todo => todo.complete) ? (
//   <button className="dropdown-item" onClick={this.deleteCompleteTodos}>
//     Clear Completed
//   </button>
// ) : null;

// let allComplete = this.state.todos.some(todo => !todo.complete) ? (
//   <button className="dropdown-item" onClick={this.markAllComplete}>
//     Mark All Complete
//   </button>
// ) : null;

// let allActive = this.state.todos.some(todo => todo.complete) ? (
//   <button className="dropdown-item" onClick={this.setAllActive}>
//     Set All Active
//   </button>
// ) : null;

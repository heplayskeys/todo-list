import React, { useState } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import './todo.styles.scss';

const Todo = props => {
	const {
		todo: { todoId, text, complete },
		adminID,
		contributorID,
		toggleComplete,
		deleteTodo,
		setTodo,
		textValue,
		index
	} = props;

	const [state, setState] = useState({
		editMode: false,
		text: text
	});

	const handleChange = event => {
		const { value } = event.target;
		setState({
			...state,
			text: value
		});
	};

	const setTodoText = async () => {
		setState({
			...state,
			editMode: false
		});

		setTodo(props.todo, state.text);
	};

	const keyPressHandler = event => {
		if (state.text === '') {
			return;
		}

		if (event.key === 'Enter') {
			setTodoText();
		}
	};

	return (
		<div id={index} className='todo-container input-group mb-3' data-tip={text}>
			<div className='input-group-prepend'>
				<div className='input-group-text'>
					<input
						id={todoId}
						type='checkbox'
						checked={complete}
						onChange={state.editMode ? null : toggleComplete}
						className='checkbox-styled'
					/>
					<label className='box-label' htmlFor='checkbox'></label>
				</div>
				{state.text.length > 65 ? <ReactTooltip place='top' /> : null}
			</div>
			<div
				type='text'
				className={`todo-item form-control ${complete ? 'complete' : ''} ${
					state.editMode ? 'edit-input' : ''
				}`}
				onClick={state.editMode ? null : toggleComplete}
			>
				{state.editMode ? (
					<input
						id={`${todoId}-input`}
						type='text'
						className='edit-input-field'
						value={state.text}
						onChange={event => handleChange(event)}
						onBlur={() => {
							setTodoText();
						}}
						onKeyPress={keyPressHandler}
					/>
				) : (
					textValue
				)}
			</div>
			<button
				className={`edit-todo badge badge-light ${
					props.currentUser
						? (props.currentUser.userID === adminID ||
								props.currentUser.userID === contributorID) &&
						  !complete
							? ''
							: 'disable-edit'
						: complete
						? 'disable-edit'
						: ''
				} ${state.editMode ? 'editing' : ''}`}
				onClick={
					complete
						? null
						: () => {
								setState({ ...state, editMode: !state.editMode });
						  }
				}
				disabled={
					props.currentUser
						? props.currentUser.userID === contributorID ||
						  props.currentUser.userID === adminID
							? false
							: true
						: false
				}
			>
				<i className='material-icons'>edit</i>
			</button>
			<button
				className={`delete-todo badge badge-danger ${
					props.currentUser
						? props.currentUser.userID !== contributorID &&
						  props.currentUser.userID !== adminID
							? 'disable-delete'
							: ''
						: ''
				}`}
				onClick={deleteTodo}
				disabled={
					props.currentUser
						? props.currentUser.userID === contributorID ||
						  props.currentUser.userID === adminID
							? false
							: true
						: false
				}
			>
				<i className='material-icons'>delete</i>
			</button>
			<div id={index} className='reorder-todo'>
				<i className='material-icons'>drag_indicator</i>
			</div>
		</div>
	);
};

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

export default connect(mapStateToProps)(Todo);

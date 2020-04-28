import React, { useState } from 'react';
import { connect } from 'react-redux';

import './todo.styles.scss';

const Todo = props => {
	const {
		todo: { id, text, complete },
		adminID,
		contributorID,
		toggleComplete,
		deleteTodo,
		setTodo,
		textValue
	} = props;

	const [state, setState] = useState({
		editMode: false,
		text: text,
		inputSelect: true
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
		<div className='todo-container input-group mb-3'>
			<div className='input-group-prepend'>
				<div className='input-group-text'>
					<input
						id={id}
						type='checkbox'
						checked={complete}
						onChange={state.editMode ? null : toggleComplete}
						className='checkbox-styled'
					/>
					<label className='box-label' htmlFor='checkbox'></label>
				</div>
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
						id={`${id}-input`}
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
				onClick={() => {
					setState({ ...state, editMode: !state.editMode });
				}}
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
						? props.currentUser.userID !== adminID ||
						  props.currentUser.userID !== contributorID
						: false
				}
			>
				<i className='material-icons'>delete</i>
			</button>
		</div>
	);
};

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

export default connect(mapStateToProps)(Todo);

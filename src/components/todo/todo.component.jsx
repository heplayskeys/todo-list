import React from 'react';
import { connect } from 'react-redux';
import './todo.styles.scss';

const Todo = props => {
	const {
		todo: { id, text, complete },
		currentUser: { userID },
		adminID,
		contributorID,
		toggleComplete,
		deleteTodo
	} = props;

	return (
		<div className='todo-container input-group mb-3'>
			<div className='input-group-prepend'>
				<div className='input-group-text'>
					<input
						id={id}
						type='checkbox'
						checked={complete}
						onChange={toggleComplete}
						className='checkbox-round'
					/>
					<label className='box-label' htmlFor='checkbox'></label>
				</div>
			</div>
			<div
				type='text'
				className={`todo-item form-control ${complete ? 'complete' : ''}`}
				onClick={toggleComplete}
			>
				{text}
			</div>
			<button
				className={`delete-todo badge badge-danger ${
					userID !== contributorID && userID !== adminID ? 'disable-delete' : ''
				}`}
				onClick={deleteTodo}
				disabled={userID !== contributorID}
			>
				X
			</button>
		</div>
	);
};

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

export default connect(mapStateToProps)(Todo);

// <input type="checkbox" id={id} name={id} onClick={toggleComplete} />

// return (
//   <div className="todo-container">
//     <div className={`${complete ? "complete" : ""}`} onClick={toggleComplete}>
//       {text}
//     </div>
//     <button className="delete-todo badge badge-danger" onClick={deleteTodo}>
//       X
//     </button>
//   </div>
// );

// <div class="input-group mb-3">
//   <div class="input-group-prepend">
//     <button type="button" class="btn btn-outline-secondary">Action</button>
//     <button type="button" class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//       <span class="sr-only">Toggle Dropdown</span>
//     </button>
//     <div class="dropdown-menu">
//       <a class="dropdown-item" href="#">Action</a>
//       <a class="dropdown-item" href="#">Another action</a>
//       <a class="dropdown-item" href="#">Something else here</a>
//       <div role="separator" class="dropdown-divider"></div>
//       <a class="dropdown-item" href="#">Separated link</a>
//     </div>
//   </div>
//   <input type="text" class="form-control" aria-label="Text input with segmented dropdown button">
// </div>

// <div class="input-group mb-3">
//   <div class="input-group-prepend">
//     <div class="input-group-text">
//       <input type="checkbox" aria-label="Checkbox for following text input">
//     </div>
//   </div>
//   <input type="text" class="form-control" aria-label="Text input with checkbox">
// </div>

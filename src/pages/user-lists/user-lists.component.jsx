import React from 'react';

const UserLists = props => {
	console.log(props);
	if (props.user) {
		const { displayName, todoListIDs } = props.user;
		//     console.log(displayName, todoListIDs);
		console.log(props.user);
	}

	return (
		<div className='lists-container'>
			<div className='list-header'>
				<h2>{`Hello, ${null}!`}</h2>
				<span>Active ToDo Lists:</span>
			</div>
		</div>
	);
};

export default UserLists;

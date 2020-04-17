import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

const UserLists = ({ currentUser }) => {
	const { displayName } = currentUser;
	const history = useHistory();
	console.log(history);

	return (
		<div className='lists-container'>
			<div className='list-header'>
				<h2>{`Hello, ${displayName}!`}</h2>
				<span>Active ToDo Lists:</span>
			</div>
		</div>
	);
};

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

export default connect(mapStateToProps)(UserLists);

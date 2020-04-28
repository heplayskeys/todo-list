import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth, firestore } from '../../firebase/firebase.utils';

import styled from 'styled-components';
import './header.styles.scss';

const Option = styled.div`
	padding: 10px 15px;
	cursor: pointer;
`;

const Header = ({ currentUser }) => {
	const history = useHistory();

	const handleLogout = async () => {
		const listRef = firestore.collection('todoLists');
		const listSnapshot = await listRef.get();
		const listData = listSnapshot.docs;

		listData.forEach(async list => {
			const updateRef = firestore.doc(`todoLists/${list.id}`);
			const updateSnap = await updateRef.get();
			updateRef.update({
				activeContributors: updateSnap
					.data()
					.activeContributors.filter(id => id !== currentUser.userID)
			});
		});

		auth.signOut();
		history.push('/signout');
	};

	const renderHome = () => {
		currentUser
			? history.push(`/user/${currentUser.userID}/todo-lists`)
			: history.push('/');
	};

	return (
		<div className='header navbar navbar-light'>
			<div onClick={() => renderHome()} className='nav-title' id='home'>
				<h1>Cloud ToDo</h1>
			</div>
			<div className='options'>
				<Link
					className='option'
					to={currentUser ? `/user/${currentUser.userID}/todo-lists` : '/'}
				>
					<Option>{currentUser ? 'TODO LISTS' : null}</Option>
				</Link>
				<Link className='option' to='/contact'>
					<Option>CONTACT</Option>
				</Link>
				{currentUser ? (
					<Link to={`/user/${currentUser.userID}/profile`} className='option'>
						<Option>ACCOUNT</Option>
					</Link>
				) : null}
				{currentUser ? (
					<div className='option' onClick={() => handleLogout()}>
						<Option>SIGN OUT</Option>
					</div>
				) : (
					<Link className='option' to='/signin'>
						<Option>SIGN IN</Option>
					</Link>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

export default connect(mapStateToProps)(Header);

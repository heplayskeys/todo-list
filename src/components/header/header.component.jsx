import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';

import { auth } from '../../firebase/firebase.utils';
// import { selectCurrentUser } from '../../redux/user/user.selectors';

// import { ReactComponent as Logo } from '../../assets/crown.svg';

import styled from 'styled-components';
import './header.styles.scss';

const Option = styled.div`
	padding: 10px 15px;
	cursor: pointer;
`;

const Header = ({ currentUser }) => {
	const history = useHistory();

	const handleLogout = () => {
		auth.signOut();
		history.push('/');
	};

	return (
		<div className='header navbar navbar-light'>
			<Link to='/' className='nav-title'>
				<h1>Cloud ToDo</h1>
			</Link>
			<div className='options'>
				<Link
					className='option'
					to={
						currentUser
							? `/user/${currentUser.userID}/todo-lists`
							: '/todo-list'
					}
				>
					<Option>TODO LISTS</Option>
				</Link>
				<Link className='option' to='/contact'>
					<Option>CONTACT</Option>
				</Link>
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

// const mapStateToProps = createStructuredSelector({
//   currentUser: selectCurrentUser,
// });

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

export default connect(mapStateToProps)(Header);

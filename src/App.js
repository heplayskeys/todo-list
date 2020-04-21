import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { connect } from 'react-redux';

import './App.css';

import Header from '../src/components/header/header.component';
import TodoListPage from './pages/todo-list/todo-list.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import UserLists from './pages/user-lists/user-lists.component';
import SignOut from './pages/sign-out/sign-out.component';
import { setCurrentUser } from './redux/user/user.actions';

class App extends React.Component {
	unsubscribeFromAuth = null;

	componentDidMount() {
		console.log(this.props);
		const { setCurrentUser } = this.props;

		this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
			if (userAuth) {
				const userRef = await createUserProfileDocument(userAuth);

				userRef.onSnapshot(snapShot => {
					setCurrentUser({
						id: snapShot.id,
						...snapShot.data()
					});
				});
			} else {
				setCurrentUser(userAuth);
			}
		});
	}

	componentWillUnmount() {
		this.unsubscribeFromAuth();
	}

	render() {
		return (
			<div>
				<Header />
				<Switch>
					<Route
						exact
						path='/signin'
						render={() =>
							this.props.currentUser ? (
								<Redirect
									to={`/user/${this.props.currentUser.userID}/todo-lists`}
								/>
							) : (
								<SignInAndSignUpPage />
							)
						}
					/>
					<Route exact path='/signout' component={SignOut} />
					<Route exact path='/user/:userID/todo-lists' component={UserLists} />
					<Route
						exact
						path='/user/:userID/todo-lists/todo-list/:todoListID'
						component={TodoListPage}
					/>
					<Route path='/' component={TodoListPage} />
					/>
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
});

const mapDispatchToProps = dispatch => ({
	setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { connect } from 'react-redux';
import { setCurrentUser } from './redux/user/user.actions';

import Header from '../src/components/header/header.component';
import TodoListPage from './pages/todo-list/todo-list.component';
import Profile from './pages/profile/profile.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import UserLists from './pages/user-lists/user-lists.component';
import ResetPassword from './pages/reset-password/reset-password.component';
import SignOut from './pages/sign-out/sign-out.component';
import Contact from './pages/contact/contact.component';

import './App.css';

class App extends React.Component {
	unsubscribeFromAuth = null;

	componentDidMount() {
		this.passwordUpdateRequired = auth.isSignInWithEmailLink(
			window.location.href
		);

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
								auth.isSignInWithEmailLink(window.location.href) ? (
									<Redirect
										to={{
											pathname: `/user/${this.props.currentUser.userID}/profile`,
											state: {
												passwordUpdateRequired: true
											}
										}}
									/>
								) : (
									<Redirect
										to={`/user/${this.props.currentUser.userID}/todo-lists`}
									/>
								)
							) : (
								<SignInAndSignUpPage />
							)
						}
					/>
					<Route exact path='/user/:userID/profile' component={Profile} />
					<Route exact path='/user/:userID/todo-lists' component={UserLists} />
					<Route exact path='/contact' component={Contact} />
					<Route
						exact
						path='/user/:userID/todo-lists/todo-list/:todoListID'
						component={TodoListPage}
					/>
					<Route exact path='/signout' component={SignOut} />
					<Route
						exact
						path='/reset-password/:userEmail'
						component={ResetPassword}
					/>
					<Route path='/todo-list' component={TodoListPage} />
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

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';

import Header from '../src/components/header/header.component';
import TodoListPage from './pages/todo-list/todo-list.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import UserLists from './pages/user-lists/user-lists.component';

class App extends React.Component {
	constructor() {
		super();

		this.state = {
			currentUser: null
		};
	}

	// Event Handler for Auth Changes from Firebase
	unsubscribeFromAuth = null;

	componentDidMount() {
		this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
			if (userAuth) {
				const userRef = await createUserProfileDocument(userAuth);

				userRef.onSnapshot(snapshot => {
					this.setState({
						currentUser: {
							id: snapshot.id,
							...snapshot.data()
						}
					});
				});
			} else {
				this.setState({ currentUser: userAuth });
			}
		});
	}

	componentWillUnmount() {
		this.unsubscribeFromAuth();
	}

	render() {
		return (
			<div>
				<Header currentUser={this.state.currentUser} />
				<Switch>
					<Route exact path='/' component={TodoListPage} />
					<Route exact path='/signin' component={SignInAndSignUpPage} />
					<Route
						exact
						path='/user/:userID'
						render={() => <UserLists user={this.state.currentUser} />}
					/>
					<Route
						exact
						path='/todo-lists/:todoListID'
						component={TodoListPage}
					/>
					/>
				</Switch>
			</div>
		);
	}
}

export default App;

import React from "react";
import { Switch, Route /*Redirect*/ } from "react-router-dom";
import { auth } from "./firebase/firebase.utils";

import Header from "../src/components/header/header.component";
import TodoListPage from "./pages/todo-list/todo-list.component";
import SignInAndSignUpPage from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";

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
    this.unsubscribeFromAuth = auth.onAuthStateChanged(user => {
      this.setState({ currentUser: user });
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
          <Route exact path="/" component={TodoListPage} />
          <Route exact path="/signin" component={SignInAndSignUpPage} />
          />
        </Switch>
      </div>
    );
  }
}

export default App;

import Navbar from "../app-navbar";
import Footer from "../app-footer";
import { connect } from "react-redux";
import * as firebase from "firebase/app";
import React, { Component } from "react";
import { firebaseLogOut } from "../../redux/actions";
import { Router, Route, Switch } from "react-router-dom";
import Reset from "../app-auth/reset";
import SignIn from "../app-auth/signin";
import Profile from "../app-profile";
import Person from "../app-person";
import Register from "../app-auth/register";
import Home from "../app-home";
import { NotFound404 } from "../app-404/NotFound404";
import { FirebaseUserContext } from "../../contexts/FirebaseUserContext";

interface IAppProps {
  firebaseUser: firebase.User | null;
  history?: any;
}

interface IAppState {
  firebaseUser: firebase.User | null;
  errors: string | null;
  loading: boolean;
  loadingExit: boolean;
  verifyLinkSent: boolean;
}

class App extends React.Component<IAppProps, IAppState> {

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      errors: null,
      firebaseUser: this.props.firebaseUser,
      loading: false,
      loadingExit: false,
      verifyLinkSent: false,
    };
    this.contextSetFirebaseUser = this.contextSetFirebaseUser.bind(this);
  }

  // Dynamically set user from child components
  // Setting null as a logout
  public contextSetFirebaseUser(firebaseUser: firebase.User | null) {
    this.setState({
      firebaseUser,
    });
  }

  public render() {
    const {history} = this.props;
    const {firebaseUser} = this.state;
    return (
      <>
        <FirebaseUserContext.Provider value={{
          contextSetFirebaseUser: this.contextSetFirebaseUser,
          firebaseUser,
        }}>
          <Navbar {...this.props} />
            <Router history={history}>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/profile" component={Profile} />
                <Route path="/person/:id" component={Person} />
                <Route path="/auth/signin" component={SignIn} />
                <Route path="/auth/register" component={Register} />
                <Route path="/auth/reset" component={Reset} />
                <Route component={NotFound404} />
              </Switch>
            </Router>
          <Footer />
        </FirebaseUserContext.Provider>
      </>
    );
  }
}

export default App;

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

const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  firebaseLogOut: () => dispatch(firebaseLogOut()),
});

interface IAppProps {
  firebaseLogOut?: any;
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
    this.handleLogOut = this.handleLogOut.bind(this);
    this.sendVerifyLink = this.sendVerifyLink.bind(this);
    this.contextSetFirebaseUser = this.contextSetFirebaseUser.bind(this);
  }

  // Dynamically set user from child components
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

  private handleLogOut(): void {
    const self = this;
    self.setState({
      loadingExit: true,
    });
    firebase.auth().signOut().then(() => {
      self.setState({loadingExit: false});
      self.props.firebaseLogOut();
      localStorage.removeItem("localAppCurrentUserID");
      self.props.history.push("/auth/signin");
    }).catch((error) => {
      const errorMessage = error.message;
      self.setState({
        errors: errorMessage,
        loadingExit: false,
      });
    });
  }

  private sendVerifyLink(): void {
    const self = this;
    self.setState({
      loading: true,
    });
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      currentUser.sendEmailVerification({
        url: "http://localhost:3000/",
      }).then(() => {
        self.setState({
          verifyLinkSent: true,
        });
        self.forceUpdate();
      })
      .catch((error) => {
        self.setState({
          errors: error.message,
          loading: false,
        });
      });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

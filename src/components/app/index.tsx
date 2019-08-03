import Navbar from "../shared/app-navbar";
import Footer from "../shared/app-footer";
import { connect } from "react-redux";
import * as firebase from "firebase/app";
import React, { Component } from "react";
import { firebaseLogOut } from "../../redux/actions";
import { Router, Route, Switch } from "react-router-dom";
import Reset from "../auth-firebase/reset";
import SignIn from "../auth-firebase/signin";
import Profile from "../app-profile";
import Person from "../app-person";
import Register from "../auth-firebase/register";
import Home from "../app-home";
import { NotFound404 } from "../app-404/NotFound404";


const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  firebaseLogOut: () => dispatch(firebaseLogOut())
});


interface IAppProps {
  firebaseLogOut?: any;
  history?: any;
};

interface IAppState {
  errors: string | null;
  loading: boolean;
  loadingExit: boolean;
  verifyLinkSent: boolean;
};


class App extends React.Component<IAppProps, IAppState> {

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      errors: null,
      loading: false,
      loadingExit: false,
      verifyLinkSent: false,
    };
    this.handleLogOut = this.handleLogOut.bind(this);
    this.sendVerifyLink = this.sendVerifyLink.bind(this);
  }

  private handleLogOut() {
    const self = this;
    self.setState({
      loadingExit: true
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
        loadingExit: false
      });
    });
  }

  private sendVerifyLink() {
    const self = this;
    self.setState({
      loading: true
    });
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      currentUser.sendEmailVerification({
        url: "http://localhost:3000/"
      }).then(() => {
        self.setState({
          verifyLinkSent: true
        });
        self.forceUpdate();
      })
      .catch((error) => {
        self.setState({
          errors: error.message,
          loading: false
        });
      });
    }
  }

  public render() {
    const {history} = this.props;
    return (
      <>
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
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

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
import Register from "../auth-firebase/register";
import Home from "../app-home";
import { NotFound404 } from "../app-404/NotFound404";


const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  firebaseLogOut: () => dispatch(firebaseLogOut())
});


interface IAppProps {
  firebaseLogOut?: any;
  history: any;
};

interface IAppState {
  errors: string | null;
  loading: boolean;
  loadingExit: boolean;
  verifyLinkSent: boolean;
};


class App extends React.Component<IAppProps, IAppState> {

  constructor(props: any) {
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

  handleLogOut() {
    var self = this;
    self.setState({
      loadingExit: true
    });
    firebase.auth().signOut().then(function() {
      self.setState({loadingExit: false});
      self.props.firebaseLogOut();
      localStorage.removeItem("localAppCurrentUserID");
      self.props.history.push("/auth/signin");
    }).catch(function(error) {
      var errorMessage = error.message;
      self.setState({
        errors: errorMessage,
        loadingExit: false
      });
    });
  }

  sendVerifyLink() {
    var self = this;
    self.setState({
      loading: true
    });
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      currentUser.sendEmailVerification({
        url: "http://localhost:3000/"
      }).then(function() {
        self.setState({
          verifyLinkSent: true
        });
        self.forceUpdate();
      })
      .catch(function(error) {
        self.setState({
          errors: error.message,
          loading: false
        });
      });
    }
  }

  render() {
    return (
      <>
        <Navbar {...this.props} />
          <Router history={this.props.history}>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/profile" component={Profile} />
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

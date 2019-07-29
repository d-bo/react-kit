import './style.css';
import 'firebase/auth';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase/app';
import React, { Component } from 'react';
import DmInput from '../../shared/DmInput';
import DmButton from '../../shared/DmButton';
import { firebaseAuth } from '../../../redux/actions';
import DmFolderWidget from '../../shared/DmFolderWidget';
import { Router } from 'react-router-dom';
import { FirebaseUserContext } from "../../../contexts/FirebaseUserContext";

const mapStateToProps = (state: any) => {
  return state.firebaseAuth;
};

const mapDispatchToProps = (dispatch: any) => ({
  firebaseAuth: (firebaseUser: firebase.User) => dispatch(firebaseAuth(firebaseUser))
});

type RegisterProps = {
  firebaseAuth: any,
  history: any,
  style: any,
};

type RegisterState = {
  errors: string | null,
  email: "",
  password: "",
  displayName: "",
  verifyLinkSent: false,
  user: firebase.User | null,
  loading: boolean,
};


class Register extends React.Component<RegisterProps, RegisterState> {

  constructor(props: any) {
    if (firebase.auth().currentUser) props.history.push('/');
    super(props);
    this.state = {
      errors: null,
      email: "",
      password: "",
      displayName: "",
      verifyLinkSent: false,
      user: props.user,
      loading: false,
    };
    this.handleRegister = this.handleRegister.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleKeyboardEnter = this.handleKeyboardEnter.bind(this);
  }

  handleKeyboardEnter (e: any) {
    if (e.key === 'Enter') {
      this.handleRegister(e);
    }
  };

  handleRegister(e: any) {
    if (this.state.loading) return;

    const currentUser = firebase.auth().currentUser;

    // Validate email
    var re = /\S+@\S+\.\S+/;
    if (!re.test(this.state.email)) {
      this.setState({
        errors: "Incorrect email",
        loading: false,
      });
      return;
    }
    // Validate password
    if (this.state.password.length < 6) {
      this.setState({
        errors: "Password min 6 symbols length",
        loading: false
      });
      return;
    }

    // Validate name
    if (this.state.displayName.length < 6) {
      this.setState({
        errors: "Name min 6 symbols length",
        loading: false
      });
      return;
    }

    var self = this;
    this.setState({
      errors: null,
      loading: true
    });

    firebase.auth().createUserWithEmailAndPassword(
        this.state.email, 
        this.state.password
      ).then(function(userCredential) {

        self.props.firebaseAuth(firebase.auth().currentUser);
        // Send email verify
        if (currentUser) {
          currentUser.sendEmailVerification({
            url: 'http://localhost:3000/'
          }).then(function() {
            self.setState({
              loading: false
            });
            // User created and email verify sent
            self.props.history.push('/');
          })
          .catch(function(error) {
            self.setState({
              errors: error.message,
              loading: false
            });
          });
        }
      }).catch(function(error) {

        var errorMessage = error.message;

        self.setState({
          errors: errorMessage,
          loading: false
        });
      });
  }

  handlePasswordChange(e: any) {
    this.setState({
      password: e
    });
  }

  handleEmailChange(e: any) {
    this.setState({
      email: e
    });
  }

  handleNameChange(e: any) {
    this.setState({
      displayName: e
    });
  }

  render() {
    return (
      <>
      <div className="container">
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6 px-xl-5">

          <div className="vertical-center">
            <DmFolderWidget title="Register" className="fade-in-fx">
              {!this.context &&
              <div style={this.props.style}>

                <DmInput type="text" value={this.state.displayName} 
                placeholder="NAME" onChange={this.handleNameChange} />

                <DmInput type="text" value={this.state.email} 
                placeholder="EMAIL" onChange={this.handleEmailChange} />

                <DmInput type="password" value={this.state.password} 
                onChange={this.handlePasswordChange} placeholder="PASSWORD" />

                <DmButton text="Ok" loading={this.state.loading} 
                onClick={this.handleRegister} onKeyPress={this.handleKeyboardEnter}
                style={{marginTop: '35px'}} />

                {this.state.errors && 
                  <div className="error-message round-border-5px">{this.state.errors}</div>}

                <Router history={this.props.history}>
                  <div className="margin-top custom-a">
                    <table className="full-width"><tbody><tr>
                    <td style={{textAlign: 'left'}}>
                        <Link to="/auth/reset">FORGOT PASSWORD ?</Link>
                    </td>
                    <td style={{textAlign: 'right'}}>
                        <Link to="/auth/signin">SIGN IN</Link>
                    </td>
                    </tr></tbody></table>
                  </div>
                </Router>

              </div>
              }
            </DmFolderWidget>
          </div>

          </div>
          <div className="col-sm-3"></div>
        </div>
      </div>
    </>
    );
  }
}

Register.contextType = FirebaseUserContext;

export default connect(mapStateToProps, mapDispatchToProps)(Register);

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

const mapStateToProps = state => {
  return state.firebaseAuth;
};
const mapDispatchToProps = dispatch => ({
  firebaseAuth: firebaseUser => dispatch(firebaseAuth(firebaseUser))
});

class Register extends Component {

  constructor(props) {
    if (firebase.auth().currentUser) props.history.push('/');
    super(props);
    this.state = {
      errors: null,
      email: props.email,
      password: props.password,
      displayName: props.displayName,
      verifyLinkSent: false,
      user: props.user
    };
    this.handleRegister = this.handleRegister.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleRegister(e) {
    if (this.state.loading) return;
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
        firebase.auth().currentUser.sendEmailVerification({
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

      }).catch(function(error) {

        var errorMessage = error.message;

        self.setState({
          errors: errorMessage,
          loading: false
        });
      });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e
    });
  }

  handleEmailChange(e) {
    this.setState({
      email: e
    });
  }

  handleNameChange(e) {
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

            <DmFolderWidget title="Register" className="fade-in-fx vertical-center">
              {!this.state.user &&
              <div style={this.props.style}>

                <DmInput type="text" value={this.state.displayName} 
                placeholder="NAME" onChange={this.handleNameChange} />

                <DmInput type="text" value={this.state.email} 
                placeholder="EMAIL" onChange={this.handleEmailChange} />

                <DmInput type="password" value={this.state.password} 
                onChange={this.handlePasswordChange} placeholder="PASSWORD" />

                <DmButton text="Ok" loading={this.state.loading} 
                onClick={this.handleRegister} style={{marginTop: '35px'}} />

                {this.state.errors && 
                  <div className="error-message round-border-5px">{this.state.errors}</div>}

                <Router history={this.props.history}>
                  <div className="margin-top custom-a">
                    <table width="100%"><tbody><tr>
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
          <div className="col-sm-3"></div>
        </div>
      </div>
    </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
import './style.scss';
import 'firebase/auth';
import React, { Component } from 'react';
import DmButton from '../../shared/DmButton';
import DmInput from '../../shared/DmInput';
import { connect } from 'react-redux';
import * as firebase from 'firebase/app';
import { firebaseAuth } from '../../../redux/actions';
import { Link } from 'react-router-dom';
import DmFolderWidget from '../../shared/DmFolderWidget';
import { FaGithub, FaGoogle } from "react-icons/fa";
import { FirebaseUserContext } from "../../../contexts/FirebaseUserContext";


const mapStateToProps = state => state.firebaseAuth;
const mapDispatchToProps = dispatch => ({
  firebaseAuth: firebaseUser => dispatch(firebaseAuth(firebaseUser))
});


class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errorSignIn: null,
      email: "",
      password: "",
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleGithub = this.handleGithub.bind(this);
    this.handleGoogle = this.handleGoogle.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleSignIn() {
    if (this.state.loading) return;
    
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

    this.setState({
      errors: null,
      loading: true
    });

    const self = this;
    firebase.auth().signInWithEmailAndPassword(
        this.state.email, 
        this.state.password
      ).then(() => {
        self.props.firebaseAuth(firebase.auth().currentUser);
        self.props.history.push('/');
      }).catch((error) => {

        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
          self.setState({
            errors: 'Wrong password',
            loading: false
          });
        } else {
          self.setState({
            errors: errorMessage,
            loading: false
          });
        }
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

  handleGithub() {
    if (this.state.loading) return;
    this.setState({loading: true});
    // With popup.
    var self = this;
    var provider = new firebase.auth.GithubAuthProvider();
     provider.addScope('repo');
     firebase.auth().signInWithPopup(provider).then(function(result) {
       self.props.firebaseAuth(result.user);
       self.setState({loading: false});
       self.props.history.push('/');
     }).catch(function(error) {
       self.setState({loading: false, errors: error.message});
     });
  }

  handleGoogle() {
    if (this.state.loading) return;
    this.setState({loading: true});
    // Using a popup.
    var self = this;
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function(result) {
       self.props.firebaseAuth(result.user);
       self.setState({loading: false});
       self.props.history.push('/');
    }).catch(function(error) {
       self.setState({loading: false, errors: error.message});
     });
  }

  render() {

    const firebaseUser = this.context;

    return (
      <>
      <div className="container">
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6 px-xl-5">

            <DmFolderWidget title="Sign In" className="fade-in-fx vertical-center">
              {!firebaseUser &&
              <div style={this.props.style}>

                <DmInput type="text" value={this.state.email} 
                placeholder="EMAIL" onChange={this.handleEmailChange} />
                <DmInput type="password" value={this.state.password} 
                onChange={this.handlePasswordChange} placeholder="PASSWORD" />

                <DmButton text="OK" loading={this.state.loading} 
                onClick={this.handleSignIn} style={{marginTop: '35px'}} />

                {this.state.errors && 
                  <div className="error-message round-border-5px">{this.state.errors}</div>}

                <div className="margin-top custom-a">
                  <table width="100%"><tbody><tr>
                  <td style={{textAlign: 'left'}}>
                      <Link to="/auth/reset">FORGOT PASSWORD ?</Link>
                  </td>
                  <td style={{textAlign: 'right'}}>
                      <Link to="/auth/register">REGISTER</Link>
                  </td>
                  </tr></tbody></table>
                </div>

                <div className="margin-top custom-a">
                  <table width="100%"><tbody><tr>
                  <td>
                    <DmButton text={<FaGithub />} loading={this.state.loading} 
                    onClick={this.handleGithub} className="button-grey" />
                  </td>
                  <td>
                    <DmButton text={<FaGoogle />} loading={this.state.loading} 
                    onClick={this.handleGithub} className="button-grey" />
                  </td>
                  </tr></tbody></table>
                </div>

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

SignIn.contextType = FirebaseUserContext;

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);

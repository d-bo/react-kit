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


const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  firebaseAuth: (firebaseUser: any) => dispatch(firebaseAuth(firebaseUser))
});

interface ISigninProps {
  history: any;
  firebaseAuth: any;
  style: any;
};

interface ISigninState {
  loading: boolean;
  errors: string | null;
  email: string | null;
  password: string | null;
};


class SignIn extends React.Component<ISigninProps, ISigninState> {

  constructor(props: ISigninProps) {
    super(props);
    this.state = {
      loading: false,
      errors: null,
      email: null,
      password: null,
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleGithub = this.handleGithub.bind(this);
    this.handleGoogle = this.handleGoogle.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  private handleSignIn() {
    if (this.state.loading) return;
    
    const self = this;
    const {password} = this.state;
    // Validate email
    const re = /\S+@\S+\.\S+/;
    if (!re.test(this.state.email as string)) {
      this.setState({
        errors: "Incorrect email",
        loading: false,
      });
      return;
    }
    // Validate password
    if (password && password.length < 6) {
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

    firebase.auth().signInWithEmailAndPassword(
        this.state.email as string, 
        this.state.password as string
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

  private handlePasswordChange(e: any) {
    this.setState({
      password: e
    });
  }

  private handleEmailChange(e: any) {
    this.setState({
      email: e
    });
  }

  private handleGithub() {
    if (this.state.loading) return;
    this.setState({loading: true});
    // With popup.
    const self = this;
    const provider = new firebase.auth.GithubAuthProvider();
     provider.addScope('repo');
     firebase.auth().signInWithPopup(provider).then((result) => {
       self.props.firebaseAuth(result.user);
       self.setState({loading: false});
       self.props.history.push('/');
     }).catch((error) => {
       self.setState({loading: false, errors: error.message});
     });
  }

  private handleGoogle() {
    if (this.state.loading) return;
    this.setState({loading: true});
    // Using a popup.
    var self = this;
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then((result) => {
       self.props.firebaseAuth(result.user);
       self.setState({loading: false});
       self.props.history.push('/');
    }).catch((error) => {
      self.setState({loading: false, errors: error.message});
    });
  }

  public render() {

    const firebaseUser = this.context;
    const {style} = this.props;
    const {errors, email, loading, password} = this.state;

    return (
      <>
      <div className="container">
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6 px-xl-5">

          <div className="vertical-center">
            <DmFolderWidget title="Sign In" className="fade-in-fx">
              {!firebaseUser &&
              <div style={style}>

                <DmInput type="text" value={email} 
                  placeholder="EMAIL" onChange={this.handleEmailChange} />
                <DmInput type="password" value={password} 
                  onChange={this.handlePasswordChange} placeholder="PASSWORD" />

                <DmButton text="OK" loading={loading} 
                  onClick={this.handleSignIn} style={{marginTop: '35px'}} />

                {errors && 
                  <div className="error-message round-border-5px">{errors}</div>}

                <div className="margin-top custom-a">
                  <table className="full-width"><tbody><tr>
                  <td style={{textAlign: 'left'}}>
                      <Link to="/auth/reset">FORGOT PASSWORD ?</Link>
                  </td>
                  <td style={{textAlign: 'right'}}>
                      <Link to="/auth/register">REGISTER</Link>
                  </td>
                  </tr></tbody></table>
                </div>

                <div className="margin-top custom-a">
                  <table className="full-width"><tbody><tr>
                  <td>
                    <DmButton text={<FaGithub />} loading={loading} 
                      onClick={this.handleGithub} className="button-grey" />
                  </td>
                  <td>
                    <DmButton text={<FaGoogle />} loading={loading} 
                      onClick={this.handleGithub} className="button-grey" />
                  </td>
                  </tr></tbody></table>
                </div>

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

SignIn.contextType = FirebaseUserContext;

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);

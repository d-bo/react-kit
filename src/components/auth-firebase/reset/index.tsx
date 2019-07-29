import './style.css';
import React, { Component } from 'react';
import DmButton from '../../shared/DmButton';
import DmInput from '../../shared/DmInput';
import { connect } from 'react-redux';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { firebaseAuth } from '../../../redux/actions';
import { Link } from 'react-router-dom';
import DmFolderWidget from '../../shared/DmFolderWidget';
import { Router } from 'react-router-dom';


const mapStateToProps = (state: any) => {
  return state.firebaseAuth;
};

const mapDispatchToProps = (dispatch: any) => ({
  firebaseAuth: (firebaseUser: any) => dispatch(firebaseAuth(firebaseUser))
});

interface IResetProps {
  history: any;
  style: any;
};

interface IResetState {
  loading: boolean;
  errors: string | null;
  email: string;
  password: string | null;
  resetSent: boolean;
  user: firebase.User | null;
};


class Reset extends React.Component<IResetProps, IResetState> {

  constructor(props: any) {
    if (firebase.auth().currentUser) props.history.push('/');
    super(props);
    this.state = {
      loading: false,
      errors: null,
      email: props.email,
      password: props.password,
      resetSent: false,
      user: props.user
    };
    this.handleReset = this.handleReset.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleReset() {
    const { email } = this.state;

    if (this.state.loading) return;
    this.setState({
      loading: true,
      errors: null
    });
    var self = this;
    firebase.auth().sendPasswordResetEmail(
        email,
        {url: 'http://localhost:3000'}
      ).then(function() {
      self.setState({
        resetSent: true,
        loading: false
      });
    }).catch(function(error) {
      self.setState({
        errors: error.message,
        loading: false
      });
    });
  }

  handleEmailChange(e: any) {
    this.setState({
      email: e
    });
  }

  render() {
    const {style} = this.props;
    return (
      <>
      <div className="container">
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6 px-xl-5">

          <div className="vertical-center">
            <DmFolderWidget title="Reset password" className="fade-in-fx">
              {!this.state.user &&
              <div style={style}>
                {!this.state.resetSent &&
                  <>
                  <div className="action-message round-border-3px">
                  Enter your email address. We will send you reset link.
                  </div>

                  <DmInput type="text" value={this.state.email} 
                  placeholder="EMAIL" onChange={this.handleEmailChange} />

                  <DmButton text="Ok" loading={this.state.loading} 
                  onClick={this.handleReset} style={{marginTop: '35px'}} />

                  {this.state.errors && 
                    <div className="error-message round-border-3px">{this.state.errors}</div>}
                  </>
                }
                {this.state.resetSent &&
                  <>
                  <div className="action-message round-border-5px">
                    Check your email. We have send you reset link.
                  </div>
                  </>
                }
                <Router history={this.props.history}>
                  <div className="margin-top custom-a">
                    <table className="full-width"><tbody><tr>
                    <td style={{textAlign: 'left'}}>
                        <Link to="/auth/signin">SIGN IN</Link>
                    </td>
                    <td style={{textAlign: 'right'}}>
                        <Link to="/auth/register">REGISTER</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Reset);
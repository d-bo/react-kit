import './style.css';
import React, { Component } from 'react';
import DmButton from '../../shared/DmButton';
import DmInput from '../../shared/DmInput';
import { connect } from 'react-redux';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { firebaseAuth } from '../../../redux/actions';
import { Link } from 'react-router-dom';
import Navbar from '../../app-navbar';
import DmFolderWidget from '../../shared/DmFolderWidget';

const mapStateToProps = state => {
  return state.firebaseAuth;
};
const mapDispatchToProps = dispatch => ({
  firebaseAuth: firebase_user => dispatch(firebaseAuth(firebase_user))
});

class Reset extends Component {

  constructor(props) {
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
    if (this.state.loading) return;
    this.setState({
      loading: true,
      errors: null
    });
    var self = this;
    firebase.auth().sendPasswordResetEmail(
        this.state.email, 
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

  handleEmailChange(e) {
    this.setState({
      email: e
    });
  }

  render() {
    return (
      <>
      <Navbar {...this.props} />
      <div className="container">
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6 px-xl-5">

            <DmFolderWidget title="Reset password" className="fade-in-fx vertical-center">
              {!this.state.user &&
              <div style={this.props.style}>
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
                <div className="margin-top custom-a">
                  <table width="100%"><tbody><tr>
                  <td style={{textAlign: 'left'}}><Link to="/auth/signin">SIGN IN</Link></td>
                  <td style={{textAlign: 'right'}}><Link to="/auth/register">REGISTER</Link></td>
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

export default connect(mapStateToProps, mapDispatchToProps)(Reset);
import Navbar from '../app-navbar';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import * as firebase from 'firebase/app';
import DmButton from '../shared/DmButton';
import DmInput from '../shared/DmInput';
import { firebaseLogOut } from '../../redux/actions';
import { FaCheck } from "react-icons/fa";
import DmFolderWidget from '../shared/DmFolderWidget';
import 'firebase/firestore';


const mapStateToProps = state => state.firebaseAuth;
const mapDispatchToProps = dispatch => ({
  firebaseLogOut: () => dispatch(firebaseLogOut())
});


class Profile extends Component {

  constructor(props) {
    var logged_user = firebase.auth().currentUser;
    if (!logged_user) props.history.push('/auth/signin');
    super(props);
    this.state = {
      user: logged_user,
      loading: false,
      loadingExit: false,
      verifyLinkSent: false,
    };

    // TODO
    if (logged_user) {
      firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        .onSnapshot(function(doc) {
          return {
            ...this.state,
            ...doc.data()
          }
        });
    }

    this.handleLogOut = this.handleLogOut.bind(this);
    this.sendVerifyLink = this.sendVerifyLink.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
  }

  handleLogOut() {
    var self = this;
    self.setState({
      loadingExit: true
    });
    firebase.auth().signOut().then(function() {
      self.setState({user: null, loadingExit: false});
      self.props.firebaseLogOut();
      self.props.history.push('/auth/signin');
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
    firebase.auth().currentUser.sendEmailVerification({
      url: 'http://localhost:3000/'
    }).then(function() {
      self.setState({
        verifyLinkSent: true
      });
      self.forceUpdate();
    }).catch(function(error) {
      self.setState({
        errors: error.message,
        loading: false
      });
    });
  }

  handleCityChange(e) {
    this.setState({
      city: e
    });
  }

  handleUpdateUser() {
    var self = this;
    self.setState({
      loading: true
    });
    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    .set({
      city: this.state.city
    }, {merge: true}).then(function(e) {
      self.setState({
        errors: '',
        loading: false
      });
    }).catch(function(error) {
      self.setState({
        errors: error.message,
        loading: false
      });
    });
  }

  render() {
    return (
      <>
      <Navbar {...this.props} />
      <div className="container">
        <div className="row">

          <div className="col-sm-6 px-xl-5">
            <DmFolderWidget title="Profile" className="fade-in-fx">
              <img src="/bio_1.jpg" alt="" />
              <DmButton text="UPLOAD PICTURE" loading={this.state.loading} 
                className="margin-top" />
            </DmFolderWidget>
          </div>

          <div className="col-sm-6 px-xl-5">
            <DmFolderWidget title="Settings" className="fade-in-fx">

              <h3>City</h3>
              <table style={{width: '100%'}}><tbody><tr>
              <td>
                <DmInput type="text" value={this.state.city} 
                placeholder="Enter your city ..." onChange={this.handleCityChange} />
              </td>
              <td>
                <DmButton icon={<FaCheck />} loading={this.state.loading} 
                onClick={() => this.props.history.push('/profile')} 
                className="button-icon" />
              </td>
              </tr></tbody></table>

              {this.state.user && 
                <>
                  {this.state.user.displayName &&
                    <p>Hello, <b>{this.state.user.displayName}</b></p>
                  }
                  {(this.state.user.email && !this.state.user.displayName) &&
                    <p>Hello, <b>{this.state.user.email}</b></p>
                  }
                  {this.state.user.photoURL &&
                    <>
                    <img style={{width: '100px'}} src={this.state.user.photoURL} alt="" />
                    </>
                  }
                  {this.state.user.providerId &&
                    <div className="action-message round-border-5px margin-top">
                      {this.state.user.providerId}
                    </div>
                  }
                  {this.state.user.uid &&
                    <div className="action-message round-border-5px margin-top">
                      UID: <b>{this.state.user.uid}</b>
                    </div>
                  }
                  {(!this.state.user.emailVerified && !this.state.verifyLinkSent) &&
                    <>
                      <div className="action-message round-border-5px">
                        Please, verify link from your email address
                      </div>
                      <DmButton text="Send again" loading={this.state.loading} 
                      onClick={this.sendVerifyLink} class="margin-top" />
                    </>
                  }
                  <p/>

                  {this.state.errors && 
                    <div className="error-message round-border-5px">
                      {this.state.errors}
                    </div>
                  }

                  <DmButton text="SAVE" loading={this.state.loading} onClick={this.handleUpdateUser}
                  style={{ marginTop: '35px'}} />

                  <DmButton text="EXIT" loading={this.state.loadingExit} onClick={this.handleLogOut}
                  style={{ marginTop: '7px'}} />
                </>
              }

            </DmFolderWidget>
          </div>
      </div>
    </div>
    </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
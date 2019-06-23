import './style.scss';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import * as firebase from 'firebase/app';
import DmButton from '../shared/DmButton';
import DmInput from '../shared/DmInput';
import DmFolderWidget from '../shared/DmFolderWidget';
import { firebaseLogOut, setProfileImgUrl } from '../../redux/actions';
import { MdClear, MdDone } from "react-icons/md";


const mapStateToProps = state => state.firebaseAuth;
const mapDispatchToProps = dispatch => ({
  firebaseLogOut: () => dispatch(firebaseLogOut()),
  setProfileImgUrl: img_url => dispatch(setProfileImgUrl(img_url))
});


class Profile extends Component {

  constructor(props) {
    // Firebase user instance
    var logged_user = firebase.auth().currentUser;
    // Not authenticated ? Redirect to signin
    if (!logged_user) props.history.push('/auth/signin');
    super(props);
    this.state = {
      user: logged_user,
      loading: false,
      loadingExit: false,
      loadingImg: false,
      verifyLinkSent: false,
      imgFile: '',
      uploadedImg: '',
      showSaveImgDialog: false
    };

    this.handleLogOut = this.handleLogOut.bind(this);
    this.sendVerifyLink = this.sendVerifyLink.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleUploadClick = this.handleUploadClick.bind(this);
    this.handleSaveImage = this.handleSaveImage.bind(this);
    this.cancelImgUpload = this.cancelImgUpload.bind(this);
  }

  handleLogOut() {
    var self = this;
    self.setState({
      loadingExit: true
    });
    firebase.auth().signOut().then(function() {
      self.setState({user: null, loadingExit: false});
      self.props.firebaseLogOut();
      localStorage.removeItem('localAppState');
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

  handleCountryChange(e) {
    this.setState({
      country: e
    });
  }

  handleUpdateUser() {
    var self = this;
    self.setState({
      loading: true
    });
    firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid)
      .set({
        city: this.props.city,
        country: this.props.country,
        profileImg: this.props.profileImg
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

  handleImageChange(e) {
    e.preventDefault();
    this.setState({loadingImg: true});
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({
        imgFile: file,
        showSaveImgDialog: true,
        uploadedImg: reader.result,
        loadingImg: false
      });
      //this.props.setProfileImgUrl(reader.result);
    }
  }

  handleUploadClick() {
    document.getElementById("img-file-upload").click();
  }

  handleSaveImage() {
    var self = this;
    self.setState({
      loadingImg: true
    });
    if (this.state.imgFile !== "") {

      var storageRef = firebase.storage().ref();
      var extension = this.state.imgFile.name.split('.').pop().toLowerCase();
      var fileName = `users/${firebase.auth().currentUser.uid}.${extension}`;
      var imgRef = storageRef.child(fileName);

      // Upload file to firebase
      // Get uploaded file url
      // Cache url to localStorage
      imgRef.put(this.state.imgFile)
        .then(snapshot => {
            imgRef.getDownloadURL().then((url) => {
              self.props.setProfileImgUrl(url);
              self.setState({
                loadingImg: false,
                showSaveImgDialog: false
              });
            }).catch((e) => {
              console.log("ERR", e);
            });
        })
        .catch(e => console.log("ERR:", e));
    }
  }

  cancelImgUpload() {
    this.setState({
      imgFile: '',
      showSaveImgDialog: false,
      uploadedImg: ''
    });
  }

  // Retrieve firebase profile img url
  // Cache it to the local storage
  // Call this once after the new image accepted
  syncFirebaseUserProfile() {
    var logged_user = firebase.auth().currentUser;
    var self = this;

    if (logged_user) {
      firebase.firestore().collection('users').doc(logged_user.uid)
        .onSnapshot(function(doc) {
          self.setState({
            ...doc.data()
          });
          // Get profile image URL
          var photoRef = firebase.storage().ref(`${doc.data().photo}`);
          photoRef.getDownloadURL().then((url) => {
            this.props.setProfileImgUrl(url);
            self.setState({
              profileImg: url
            });
          }).catch((e) => {
            console.log("ERR", e);
          });
        });
    }
  }

  render() {
    return (
      <>
      <div className="container">
        <div className="row">

          <div className="col-sm-6 px-xl-5">
            <DmFolderWidget title="Profile" className="fade-in-fx">

              { // Default profile img
                this.props.profileImg !== '' && this.state.uploadedImg === '' &&
                <>
                  <div style={{textAlign: 'center'}}>
                    <img src={this.props.profileImg} 
                    className="profile-img round-border-5px" alt="" />
                  </div>
                </>
              }

              { // Handle uploaded profile img
                // Show uploaded image
                ((this.props.profileImg !== "" && this.state.uploadedImg !== "") || 
                (this.props.profileImg === "" && this.state.uploadedImg !== "")) &&
                <>
                  <div style={{textAlign: 'center'}}>
                    <img src={this.state.uploadedImg} 
                    className="profile-img round-border-5px" alt="" />
                  </div>
                </>
              }

              { // No default, no uploaded image -> show no-user picture
                (this.props.profileImg === "" && this.state.uploadedImg === "") &&
                <>
                  <div style={{textAlign: 'center'}}>
                    <img src="/no-user.png"
                    className="profile-img round-border-5px" alt="" />
                  </div>
                </>
              }

              { // Cancel image upload or save dialog
                this.state.showSaveImgDialog &&
                <table style={{width: '100%'}}><tbody><tr>
                <td>
                  <DmButton icon={<MdDone style={{fontSize: '32px'}} />} loading={this.state.loadingImg} 
                    className="margin-top button-grey" onClick={this.handleSaveImage} />
                </td>
                <td>
                  <DmButton icon={<MdClear style={{fontSize: '32px'}} />} loading={this.state.loadingImg} 
                    className="margin-top button-grey" onClick={this.cancelImgUpload} />
                </td>
                </tr></tbody></table>
              }

              <input type="file" className="input-hidden" 
              onChange={this.handleImageChange} id="img-file-upload" />
              <DmButton text="CHANGE PROFILE IMAGE" loading={this.state.loadingImg} 
                className="margin-top" onClick={this.handleUploadClick} />

            </DmFolderWidget>
          </div>

          <div className="col-sm-6 px-xl-5">
            <DmFolderWidget title="Settings" className="fade-in-fx">
              
              <table style={{width: '100%'}}><tbody><tr>
              <td>
                <h3>Country</h3>
                <DmInput type="text" value={this.state.country} 
                placeholder="Enter your city ..." onChange={this.handleCountryChange} />
              </td>
              <td>
                <h3>City</h3>
                <DmInput type="text" value={this.state.city} 
                placeholder="Enter your city ..." onChange={this.handleCityChange} />
              </td>
              </tr></tbody></table>

              {this.state.user && 
                <>
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
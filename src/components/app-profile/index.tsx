import "./style.scss";
import { connect } from "react-redux";
import React, { Component, SyntheticEvent } from "react";
import * as firebase from "firebase/app";
import DmButton from "../shared/DmButton";
import DmInput from "../shared/DmInput";
import DmFolderWidget from "../shared/DmFolderWidget";
import { firebaseLogOut, setProfileImgUrl } from "../../redux/actions";
import { MdClear, MdDone } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FirebaseUserContext } from "../../contexts/FirebaseUserContext";
import { any } from "prop-types";


const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  firebaseLogOut: () => dispatch(firebaseLogOut()),
  setProfileImgUrl: (img_url: string) => dispatch(setProfileImgUrl(img_url)),
});

interface IProfileProps {
  history: any;
  setProfileImgUrl: any;
  firebaseLogOut: any;
};

interface IProfileState {
  country: string | null;
  city: string | null;
  user: firebase.User | null;
  loading: boolean;
  loadingExit: boolean;
  loadingImg: boolean;
  verifyLinkSent: boolean;
  imgFile: File | null;
  uploadedImg: string | ArrayBuffer | null;
  showSaveImgDialog: boolean;
  errors: string;
};


class Profile extends React.Component<IProfileProps, IProfileState> {

  constructor(props: IProfileProps) {
    // Firebase user instance
    var logged_user = firebase.auth().currentUser;
    // Not authenticated ? Redirect to signin
    if (!logged_user) props.history.push("/auth/signin");
    super(props);
    this.state = {
      city: null,
      country: null,
      errors: "",
      user: logged_user,
      loading: false,
      loadingExit: false,
      loadingImg: false,
      verifyLinkSent: false,
      imgFile: null,
      uploadedImg: null,
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
      localStorage.removeItem('localAppCurrentUserID');
      self.props.setProfileImgUrl("");
      self.props.firebaseLogOut();
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
    if (currentUser != null) {
      currentUser.sendEmailVerification({
        url: "http://localhost:3000/"
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
  }

  handleCityChange(city: string | null) {
    this.setState({
      city,
    });
  }

  handleCountryChange(country: string | null) {
    this.setState({
      country,
    });
  }

  handleUpdateUser() {
    var self = this;
    self.setState({
      loading: true
    });
    const currentUser = firebase.auth().currentUser;
    if (currentUser != null) {
      firebase.firestore().collection("users")
        .doc(currentUser.uid)
        .set({
          city: this.state.city,
          country: this.state.country,
          profileImgUrl: this.state.uploadedImg,
        }, {merge: true}).then(function(e) {
          self.setState({
            errors: "",
            loading: false,
          });
        }).catch(function(error) {
          self.setState({
            errors: error.message,
            loading: false,
          });
        });
    }
  }

  handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    this.setState({loadingImg: true});
    let reader = new FileReader();
    if (e.target != null) {
      if (e.target.files != null) {
        let file = e.target.files[0];
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          this.setState({
            imgFile: file,
            showSaveImgDialog: true,
            uploadedImg: reader.result,
            loadingImg: false
          });
        }
      }
    }
  }

  handleUploadClick() {
    let el: HTMLElement = document.getElementById("img-file-upload") as HTMLElement;
    el.click();
  }

  handleSaveImage() {
    var self = this;
    self.setState({
      loadingImg: true
    });
    const imgFile = this.state.imgFile;
    if (imgFile) {

      let extension;    // file extension
      let fileName;
      let imgRef: firebase.storage.Reference | null = null;
      const storageRef = firebase.storage().ref();
      const name = imgFile.name;

      if (name) {
        let __extension = name.split(".");
        let extension = __extension.pop();
        if (extension) {
          extension = extension.toLowerCase();
        }
      }
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        fileName = `users/${currentUser.uid}.${extension}`;
      }
      if (fileName) {
        imgRef = storageRef.child(fileName);
      }
      const user = firebase.auth().currentUser;

      // Upload file to firebase
      // Get uploaded file url
      // Cache url to localStorage
      // Update firebase user profile
      if (imgRef) {
        imgRef.put(this.state.imgFile)
          .then((snapshot) => {
            if (imgRef) {
              imgRef.getDownloadURL().then((url: string) => {
                self.props.setProfileImgUrl(url);
                if (user) {
                  user.updateProfile({
                    photoURL: url
                  }).then(function() {
                    self.setState({
                      loadingImg: false,
                      showSaveImgDialog: false,
                      imgFile: null,
                    });
                  }).catch(function(error) {
                    self.setState({
                      errors: error.message,
                      loading: false,
                    });
                  });
                }
              }).catch((e: any) => {
                self.setState({
                  errors: e.message,
                  loading: false,
                });
              });
            }
          }).catch((e) => {
                self.setState({
                  errors: e.message,
                  loading: false,
                });
          });
      }
    }
  }

  cancelImgUpload() {
    this.setState({
      imgFile: null,
      showSaveImgDialog: false,
      uploadedImg: "",
    });
  }

  // Retrieve firebase profile img url
  // Cache it to the local storage
  // Call this once after the new image accepted
  syncFirebaseUserProfile() {
    var logged_user = firebase.auth().currentUser;
    var self = this;

    if (logged_user) {
      firebase.firestore().collection("users").doc(logged_user.uid)
        .onSnapshot(function(doc) {
          /*
          self.setState({
            ...doc.data()
          });
          console.log(doc.data());
          */
          // Get profile image URL
          /*
          var photoRef = firebase.storage().ref(`${doc.data().photo}`);
          photoRef.getDownloadURL().then((url) => {
            this.props.setProfileImgUrl(url);
            self.setState({
              profileImgUrl: url
            });
          }).catch((e) => {
            console.log("ERR", e);
          });
          */
        });
    }
  }

  render() {

    const {uploadedImg} = this.state;
    const firebaseUser = this.context;

    return (
      <>
      <div className="container">
        <div className="row">

          <div className="col-sm-6 px-xl-5">
            <DmFolderWidget title="Profile" className="fade-in-fx">
            {(firebaseUser && firebaseUser.hasOwnProperty('photoURL')) &&
              <>
              {(firebaseUser.photoURL && !uploadedImg) &&
                <>
                  <div style={{textAlign: "center"}}>
                    <LazyLoadImage
                      src={firebaseUser.photoURL}
                      placeholderSrc="/no-image-slide.png"
                      effect="blur"
                      className="profile-img round-border-5px" />
                  </div>
                </>
              }

              {(firebaseUser.photoURL && uploadedImg) &&
                <>
                  <div style={{textAlign: "center"}}>
                    <LazyLoadImage
                      src={uploadedImg as string}
                      placeholderSrc="/no-image-slide.png"
                      effect="blur"
                      className="profile-img round-border-5px" />
                  </div>
                </>
              }

              { // No image uploaded
                (!firebaseUser.photoURL && !uploadedImg) &&
                <>
                  <div style={{textAlign: "center"}}>
                    <img src="/no-user.png" alt="" />
                  </div>
                </>
              }

              {
                (!firebaseUser.photoURL && uploadedImg) &&
                <>
                  <div style={{textAlign: "center"}}>
                    <LazyLoadImage
                      src={uploadedImg as string}
                      placeholderSrc="/no-image-slide.png"
                      effect="blur"
                      className="profile-img round-border-5px" />
                  </div>
                </>
              }
              </>
            }

              { // Cancel image upload or save dialog
                this.state.showSaveImgDialog &&
                <table style={{width: "100%"}}><tbody><tr>
                <td>
                  <DmButton icon={<MdDone style={{fontSize: "32px"}} />} loading={this.state.loadingImg} 
                    className="margin-top button-grey" onClick={this.handleSaveImage} />
                </td>
                <td>
                  <DmButton icon={<MdClear style={{fontSize: "32px"}} />} loading={this.state.loadingImg} 
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

              <table style={{width: "100%"}}><tbody><tr>
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
                  style={{ marginTop: "35px", fontSize: "14px"}} className="button-grey" />

                  <DmButton text="EXIT" loading={this.state.loadingExit} onClick={this.handleLogOut}
                  style={{ marginTop: "7px"}} />
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

Profile.contextType = FirebaseUserContext;

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

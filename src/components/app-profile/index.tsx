import "./style.scss";
import { connect } from "react-redux";
import React, { Component, SyntheticEvent } from "react";
import * as firebase from "firebase/app";
import DmButton from "../shared/DmButton";
import DmInput from "../shared/DmInput";
import DmFolderWidget from "../shared/DmFolderWidget";
import { firebaseLogOut, setProfileImgUrl, setUserFirestoreData } from "../../redux/actions";
import { MdClear, MdDone } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FirebaseUserContext } from "../../contexts/FirebaseUserContext";
import { any } from "prop-types";


const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  firebaseLogOut: () => dispatch(firebaseLogOut()),
  setProfileImgUrl: (img_url: string) => dispatch(setProfileImgUrl(img_url)),
  setUserFirestoreData: (userData: object | null) => dispatch(setUserFirestoreData(userData)),
});

interface IProfileProps {
  history: any;
  setProfileImgUrl: any;
  firebaseLogOut: any;
  setUserFirestoreData: any;
  userData: any;
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
    const logged_user = firebase.auth().currentUser;
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

  private handleLogOut(): void {
    const self = this;
    self.setState({
      loadingExit: true
    });
    firebase.auth().signOut().then(() => {
      self.setState({user: null, loadingExit: false});
      localStorage.removeItem('localAppCurrentUserID');
      self.props.setProfileImgUrl("");
      self.props.firebaseLogOut();
      self.props.history.push("/auth/signin");
    }).catch((error) => {
      const errorMessage = error.message;
      self.setState({
        errors: errorMessage,
        loadingExit: false,
      });
    });
  }

  private sendVerifyLink(): void {
    const self = this;
    const currentUser = firebase.auth().currentUser;
    this.setState({
      loading: true
    });
    if (currentUser != null) {
      currentUser.sendEmailVerification({
        url: "http://localhost:3000/"
      }).then(() => {
        self.setState({
          verifyLinkSent: true
        });
        self.forceUpdate();
      }).catch((error) => {
        self.setState({
          errors: error.message,
          loading: false,
        });
      });
    }
  }

  private handleCityChange(city: string | null): void {
    this.setState({
      city,
    });
  }

  private handleCountryChange(country: string | null): void {
    this.setState({
      country,
    });
  }

  // Save additional user data to firestore
  private handleUpdateUser(): void {
    const self = this;
    const {userData, setUserFirestoreData} = this.props;
    const {city, country} = this.state;
    const currentUser = firebase.auth().currentUser;
    const _userData = {
      city,
      country,
    };
    setUserFirestoreData(_userData);
    this.setState({
      loading: true,
    });
    if (currentUser != null) {
      firebase.firestore().collection("users")
        .doc(currentUser.uid)
        .set(_userData, {merge: true}).then((e) => {
          self.setState({
            errors: "",
            loading: false,
          });
        }).catch((error) => {
          self.setState({
            errors: error.message,
            loading: false,
          });
        });
    }
  }

  private handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void {
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
            loadingImg: false,
            showSaveImgDialog: true,
            uploadedImg: reader.result,
          });
        }
      }
    }
  }

  private handleUploadClick(): void {
    let el: HTMLElement = document.getElementById("img-file-upload") as HTMLElement;
    el.click();
  }

  private handleSaveImage(): void {
    const self = this;
    const currentUser = firebase.auth().currentUser;
    const {imgFile} = this.state;
    const storageRef = firebase.storage().ref();
    self.setState({
      loadingImg: true
    });
  
    if (imgFile) {
      let extension;
      let fileName;
      let imgRef: firebase.storage.Reference | null = null;
      const name = imgFile.name;
      if (name) {
        let __extension = name.split(".");
        let extension = __extension.pop();
        if (extension) {
          extension = extension.toLowerCase();
        }
      }
      
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
                  }).then(() => {
                    self.setState({
                      loadingImg: false,
                      showSaveImgDialog: false,
                      imgFile: null,
                    });
                  }).catch((error) => {
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
          }).catch((e: any) => {
                self.setState({
                  errors: e.message,
                  loading: false,
                });
          });
      }
    }
  }

  private cancelImgUpload(): void {
    this.setState({
      imgFile: null,
      showSaveImgDialog: false,
      uploadedImg: "",
    });
  }

  public render(): JSX.Element {

    const {userData} = this.props;
    const {uploadedImg} = this.state;
    const firebaseUser = this.context;
    const {
      showSaveImgDialog,
      loadingImg,
      country,
      city,
      verifyLinkSent,
      errors,
      loading,
      loadingExit,
    } = this.state;

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
                showSaveImgDialog &&
                <table style={{width: "100%"}}><tbody><tr>
                <td>
                  <DmButton icon={<MdDone style={{fontSize: "32px"}} />} loading={loadingImg} 
                    className="margin-top button-grey" onClick={this.handleSaveImage} />
                </td>
                <td>
                  <DmButton icon={<MdClear style={{fontSize: "32px"}} />} loading={loadingImg} 
                    className="margin-top button-grey" onClick={this.cancelImgUpload} />
                </td>
                </tr></tbody></table>
              }

              <input type="file" className="input-hidden" 
              onChange={this.handleImageChange} id="img-file-upload" />
              <DmButton text="CHANGE PROFILE IMAGE" loading={loadingImg} 
                className="margin-top" onClick={this.handleUploadClick} />

            </DmFolderWidget>
          </div>

          <div className="col-sm-6 px-xl-5">
            <DmFolderWidget title="Settings" className="fade-in-fx">
              <p></p>
              <table style={{width: "100%"}}><tbody><tr>
              <td>
                <div style={{textAlign: "center"}}>
                  <b>Country</b>
                </div>
                <DmInput type="text"
                value={userData ? userData.country : ""}
                placeholder="Enter your city ..." onChange={this.handleCountryChange} />
              </td>
              <td>
              <div style={{textAlign: "center"}}>
                  <b>City</b>
                </div>
                <DmInput type="text"
                value={userData ? userData.city : ""}
                placeholder="Enter your city ..." onChange={this.handleCityChange} />
              </td>
              </tr></tbody></table>

              {firebaseUser && 
                <>
                  {(!firebaseUser.emailVerified && !verifyLinkSent) &&
                    <>
                      <div className="action-message round-border-5px">
                        Please, verify link from your email address
                      </div>
                      <DmButton text="Send again" loading={loading} 
                      onClick={this.sendVerifyLink} className="margin-top" />
                    </>
                  }
                  <p/>

                  {errors && 
                    <div className="error-message round-border-5px">
                      {errors}
                    </div>
                  }

                  <DmButton icon={<MdDone style={{fontSize: "32px"}} />}
                  loading={loading} onClick={this.handleUpdateUser}
                  style={{ marginTop: "35px",}} className="button-grey" />

                  <DmButton text="EXIT" loading={loadingExit} onClick={this.handleLogOut}
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

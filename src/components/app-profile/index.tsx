import "./style.scss";
import { connect } from "react-redux";
import React, { Component, SyntheticEvent } from "react";
import firebase from "firebase/app";
import DmButton from "../shared/elements/DmButton";
import DmInput from "../shared/elements/DmInput";
import DmFolderWidget from "../shared/widgets/DmFolderWidget";
import { setProfileImgUrl, setUserFirestoreData } from "../../redux/actions";
import { MdClear, MdDone } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FirebaseUserContext } from "../../contexts/FirebaseUserContext";
import { FaTrashAlt } from "react-icons/fa";
import { withRouter } from "react-router";

const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  setProfileImgUrl: (imgUrl: string) => dispatch(setProfileImgUrl(imgUrl)),
  setUserFirestoreData: (userData: object | null) => dispatch(setUserFirestoreData(userData)),
});

interface IProfileProps {
  history: any;
  setProfileImgUrl: any;
  setUserFirestoreData: any;
  userData: any;
  location?: any;
}

interface IProfileState {
  country: string | null;
  city: string | null;
  loading: boolean;
  loadingExit: boolean;
  loadingImg: boolean;
  verifyLinkSent: boolean;
  imgFile: File | null;
  uploadedImg: string | ArrayBuffer | null;
  showSaveImgDialog: boolean;
  showDropImgDialog: boolean;
  errors: string;
}

class Profile extends React.Component<IProfileProps, IProfileState> {

  constructor(props: IProfileProps) {
    super(props);
    this.state = {
      city: null,
      country: null,
      errors: "",
      imgFile: null,
      loading: false,
      loadingExit: false,
      loadingImg: false,
      showDropImgDialog: false,
      showSaveImgDialog: false,
      uploadedImg: null,
      verifyLinkSent: false,
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
    this.handleDropImage = this.handleDropImage.bind(this);
    this.handleDropImageDialog = this.handleDropImageDialog.bind(this);
    this.cancelDropImg = this.cancelDropImg.bind(this);
  }

  public componentDidMount() {
    if (!this.context.firebaseUser) {
      this.props.history.push("/auth/signin");
    }
  }

  public componentDidUpdate(prevProps: IProfileProps): void {
    const {location} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  public render(): JSX.Element {
    const {userData} = this.props;
    const {uploadedImg} = this.state;
    const {firebaseUser} = this.context;
    const {
      showSaveImgDialog,
      loadingImg,
      country,
      city,
      verifyLinkSent,
      errors,
      loading,
      loadingExit,
      showDropImgDialog,
    } = this.state;

    return (
      <>
      <div className="container">
        <div className="row">

          <div className="col-sm-6 px-xl-5">
            <DmFolderWidget title="Profile" className="fade-in-fx">

            <p></p>

            {(firebaseUser && firebaseUser.hasOwnProperty("photoURL")) &&
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
              <>
                <p></p>
                <div className="action-message text-center round-border-3px">
                  Are you sure you want to upload image ?
                </div>
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
              </>
            }

            <table style={{width: "100%"}}><tbody><tr>
              <td style={{width: "80%"}}>
                <input type="file" className="input-hidden"
                  onChange={this.handleImageChange} id="img-file-upload" />
                <DmButton text="LOAD PROFILE IMAGE" loading={loadingImg}
                  className="margin-top" onClick={this.handleUploadClick} />
              </td>
              <td style={{width: "80%"}}>
                <DmButton text={<FaTrashAlt />} loading={loadingImg}
                  className="margin-top button-transparent"
                  onClick={this.handleDropImageDialog} />
              </td>
            </tr></tbody></table>

            { // Cancel drop image dialog
              showDropImgDialog &&
              <>
                <p></p>
                <div className="action-message text-center round-border-3px">
                  Are you sure you want to delete image ?
                </div>
                <table style={{width: "100%"}}><tbody><tr>
                <td>
                  <DmButton icon={<MdDone style={{fontSize: "32px"}} />} loading={loadingImg}
                    className="margin-top button-grey" onClick={this.handleDropImage} />
                </td>
                <td>
                  <DmButton icon={<MdClear style={{fontSize: "32px"}} />} loading={loadingImg}
                    className="margin-top button-grey" onClick={this.cancelDropImg} />
                </td>
                </tr></tbody></table>
              </>
            }

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
                      <p></p>
                      <div className="error-message round-border-5px">
                        Please, verify link from your email address
                      </div>
                      <DmButton text="Send again" loading={loading}
                      onClick={this.sendVerifyLink} />
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
                  style={{marginTop: "35px"}} className="button-grey" />

                  <DmButton text="EXIT" loading={loadingExit} onClick={this.handleLogOut}
                  style={{marginTop: "7px"}} />
                </>
              }

            </DmFolderWidget>
          </div>
      </div>
    </div>
    </>
    );
  }

  private handleLogOut(): void {
    const self = this;
    const {setProfileImgUrl, history} = this.props;
    const {contextSetFirebaseUser} = this.context;
    self.setState({
      loadingExit: true,
    });
    firebase.auth().signOut().then(() => {
      contextSetFirebaseUser(null);
      self.setState({loadingExit: false});
      localStorage.removeItem("localAppCurrentUserID");
      setProfileImgUrl(null);
      history.push("/auth/signin");
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
    const {firebaseUser} = this.context;
    this.setState({
      loading: true,
    });
    if (firebaseUser) {
      firebaseUser.sendEmailVerification({
        url: `${location.protocol}//${location.hostname}${(location.port ? `:${location.port}` : "")}`,
      }).then(() => {
        self.setState({
          verifyLinkSent: true,
        });
        self.forceUpdate();
      }).catch((error: any) => {
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
    const userDataTemp = {
      city,
      country,
    };
    setUserFirestoreData(userDataTemp);
    this.setState({
      loading: true,
    });
    if (currentUser != null) {
      firebase.firestore().collection("users")
        .doc(currentUser.uid)
        .set(userDataTemp, {merge: true}).then((e) => {
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
    const reader = new FileReader();
    if (e.target != null) {
      if (e.target.files != null) {
        const file = e.target.files[0];
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
    const el: HTMLElement = document.getElementById("img-file-upload") as HTMLElement;
    el.click();
  }

  private handleDropImageDialog(): void {
    this.setState({
      showDropImgDialog: true,
    });
  }

  private handleDropImage(): void {
    this.setState({
      loadingImg: true,
    });
    const self = this;
    const {firebaseUser, contextSetFirebaseUser} = this.context;
    if (firebaseUser) {
      this.props.setProfileImgUrl("");
      firebaseUser.updateProfile({
        photoURL: "",
      }).then(() => {
        contextSetFirebaseUser(firebase.auth().currentUser);
        self.setState({
          imgFile: null,
          loadingImg: false,
          showDropImgDialog: false,
        });
      }).catch((error: any) => {
        self.setState({
          errors: error.message,
          loading: false,
        });
      });
    }
  }

  private handleSaveImage(): void {
    const self = this;
    const {firebaseUser} = this.context;
    const {imgFile} = this.state;
    const storageRef = firebase.storage().ref();
    self.setState({
      loadingImg: true,
    });
    if (imgFile) {
      let fileName;
      let extension;
      let imgRef: firebase.storage.Reference | null = null;
      const name = imgFile.name;
      if (name) {
        const ext = name.split(".");
        const extpop = ext.pop();
        if (extpop) {
          extension = extpop.toLowerCase();
        }
      }

      if (firebaseUser) {
        fileName = `users/${firebaseUser.uid}.${extension}`;
      }
      if (fileName) {
        imgRef = storageRef.child(fileName);
      }

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
                if (firebaseUser) {
                  firebaseUser.updateProfile({
                    photoURL: url,
                  }).then(() => {
                    self.setState({
                      imgFile: null,
                      loadingImg: false,
                      showSaveImgDialog: false,
                    });
                  }).catch((error: any) => {
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

  private cancelDropImg(): void {
    this.setState({
      showDropImgDialog: false,
    });
  }
}

Profile.contextType = FirebaseUserContext;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile) as any);

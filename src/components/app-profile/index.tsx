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
import Footer from "../app-footer";
import produce from "immer";
import { LoadingFacebookBlack } from "../../components/shared/elements/Loader";

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

interface IFileObject {
  name?: string;
}

interface IProfileState {
  country: string | null;
  city: string | null;
  loading: boolean;
  loadingExit: boolean;
  loadingImg: boolean;
  verifyLinkSent: boolean;
  imgFile: Blob | ArrayBuffer | Uint8Array | null | IFileObject;
  uploadedImg: string | ArrayBuffer | null;
  showSaveImgDialog: boolean;
  showDropImgDialog: boolean;
  errors: string | null;
  errorsUploadPhoto: string | null;
}

class Profile extends React.PureComponent<IProfileProps, IProfileState> {

  constructor(props: IProfileProps) {
    super(props);
    this.state = {
      city: null,
      country: null,
      errors: null,
      errorsUploadPhoto: null,
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
    const {history} = this.props;
    if (!this.context.firebaseUser) {
      history.push("/auth/signin");
    }
  }

  public componentDidUpdate(prevProps: IProfileProps): void {
    const {location} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  public render(): JSX.Element {
    const {userData} = this.props;
    const {firebaseUser} = this.context;
    const {
      showSaveImgDialog,
      loadingImg,
      verifyLinkSent,
      errors,
      loading,
      loadingExit,
      showDropImgDialog,
      uploadedImg,
      errorsUploadPhoto,
    } = this.state;

    return (
      <>
      <div className="container-fluid body-page-color body-page-margin-top">
        <div className="row">

          <div className="col-sm-4">
            <DmFolderWidget title="Photo" className="fade-in-fx">

            <p></p>

            {(firebaseUser && firebaseUser.hasOwnProperty("photoURL")) &&
              <>
              {(firebaseUser.photoURL && !uploadedImg) &&
                <>
                  <div style={{textAlign: "center"}}>
                    <LazyLoadImage
                      src={firebaseUser.photoURL}
                      placeholderSrc="/img/no-image-slide.png"
                      effect="blur"
                      className="profile-img round-border-5px fade-in-fx" />
                  </div>
                </>
              }

              {(firebaseUser.photoURL && uploadedImg) &&
                <>
                  <div style={{textAlign: "center"}}>
                    <LazyLoadImage
                      src={uploadedImg as string}
                      placeholderSrc="/img/no-image-slide.png"
                      effect="blur"
                      className="profile-img round-border-5px fade-in-fx" />
                  </div>
                </>
              }

              { // No image uploaded
                (!firebaseUser.photoURL && !uploadedImg) &&
                <>
                  <div style={{textAlign: "center"}}>
                    <LazyLoadImage
                        src="/img/no-user.png"
                        placeholderSrc="/img/no-image-slide.png"
                        effect="blur"
                        className="profile-img round-border-5px fade-in-fx" />
                  </div>
                </>
              }

              {
                (!firebaseUser.photoURL && uploadedImg) &&
                <>
                  <div style={{textAlign: "center"}}>
                    <LazyLoadImage
                      src={uploadedImg as string}
                      placeholderSrc="/img/no-image-slide.png"
                      effect="blur"
                      className="profile-img round-border-5px fade-in-fx" />
                  </div>
                </>
              }
              </>
            }

            {loadingImg &&
              <>
                <p></p>
                <LoadingFacebookBlack/>
              </>
            }

            { // Cancel image upload or save dialog
              showSaveImgDialog &&
              <div>
                <p></p>
                <div className="text-center">
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
              </div>
            }

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

            {errorsUploadPhoto &&
              <div className="error-message round-border-5px">
                {errorsUploadPhoto}
              </div>
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

            </DmFolderWidget>
          </div>

          <div className="col-sm-4">
            <DmFolderWidget title="Skills" className="fade-in-fx">
                Rizzle - Serenity <b>[Dispatch Recordings]</b><br/>
                Kasra - Alburz <b>[Critical Music]</b><br/>
                Skeptical - Mechanism <b>[Exit Records]</b><br/>
                Neve - Ping Pong <b>[Guidance]</b><br/>
                Mefjus - Sinkhole (Skeptical Remix) <b>[Vision Recordings]</b><br/>
                Trex & Qu3st - Eye Spy <b>[The Dreamers]</b><br/>
                Alix Perez & Monty - Good to Me <b>[1985 Music]</b><br/>
                Nucleus & Paradox - Azha <b>[Metalheadz]</b><br/>
                Frame & Base - Pony Express <b>[Delta9 Recordings]</b><br/>
                Blacklight - Enormous Machine <b>[Subplate Recordings]</b><br/>
                Doctor Jeep - Natural Selection <b>[Plush Recordings]</b><br/>
                Ground - Attract <b>[Flexout Audio]</b><br/>
            </DmFolderWidget>
          </div>

          <div className="col-sm-4">
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
    <Footer />
    </>
    );
  }

  public handleLogOut(): void {
    const self = this;
    const {setProfileImgUrl, history} = this.props;
    const {contextSetFirebaseUser} = this.context;
    self.setState(
      produce(self.state, (draft) => {
        draft.loadingExit = true;
      }),
    );
    firebase.auth().signOut().then(() => {
      contextSetFirebaseUser(null);
      self.setState(
        produce(self.state, (draft) => {
          draft.loadingExit = false;
        }),
      );
      localStorage.removeItem("localAppCurrentUserID");
      setProfileImgUrl(null);
      history.push("/auth/signin");
    }).catch((error) => {
      const errorMessage = error.message;
      self.setState(
        produce(self.state, (draft) => {
          draft.errors = errorMessage;
          draft.loadingExit = false;
        }),
      );
    });
  }

  private sendVerifyLink(): void {
    const self = this;
    const {firebaseUser} = this.context;
    this.setState(
      produce(this.state, (draft) => {
        draft.loading = true;
      }),
    );
    if (firebaseUser) {
      firebaseUser.sendEmailVerification({
        url: `${location.protocol}//${location.hostname}${(location.port ? `:${location.port}` : "")}`,
      }).then(() => {
        self.setState(
          produce(self.state, (draft) => {
            draft.verifyLinkSent = true;
          }),
        );
        self.forceUpdate();
      }).catch((error: any) => {
        self.setState(
          produce(self.state, (draft) => {
            draft.errors = error.message;
            draft.loading = false;
          }),
        );
      });
    }
  }

  private handleCityChange(city: string | null): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.city = city;
      }),
    );
  }

  private handleCountryChange(country: string | null): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.country = country;
      }),
    );
  }

  // Save additional user data to firestore
  private handleUpdateUser(): void {
    const self = this;
    const {setUserFirestoreData} = this.props;
    const {city, country} = this.state;
    const currentUser = firebase.auth().currentUser;
    const userDataTemp = {
      city,
      country,
    };
    setUserFirestoreData(userDataTemp);
    this.setState(
      produce(self.state, (draft) => {
        draft.loading = true;
      }),
    );
    if (currentUser != null) {
      firebase.firestore().collection("users")
        .doc(currentUser.uid)
        .set(userDataTemp, {merge: true}).then((e) => {
          self.setState(
            produce(self.state, (draft) => {
              draft.loading = false;
              draft.errors = null;
            }),
          );
        }).catch((error) => {
          self.setState(
            produce(self.state, (draft) => {
              draft.loading = false;
              draft.errors = error.message;
            }),
          );
        });
    }
  }

  private handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    const self = this;
    this.setState(
      produce(this.state, (draft) => {
        draft.loadingImg = true;
      }),
    );
    const reader = new FileReader();
    if (e.target != null) {
      if (e.target.files != null) {
        const file = e.target.files[0];
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          self.setState(
            produce(self.state, (draft) => {
              draft.imgFile = file;
              draft.loadingImg = false;
              draft.showSaveImgDialog = true;
              draft.uploadedImg = reader.result;
            }),
          );
        };
      }
    }
  }

  private handleUploadClick(): void {
    const el: HTMLElement = document.getElementById("img-file-upload") as HTMLElement;
    el.click();
  }

  private handleDropImageDialog(): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.showDropImgDialog = true;
      }),
    );
  }

  private handleDropImage(): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.loadingImg = true;
      }),
    );
    const self = this;
    const {setProfileImgUrl} = this.props;
    const {firebaseUser, contextSetFirebaseUser} = this.context;
    if (firebaseUser) {
      setProfileImgUrl(null);
      firebaseUser.updateProfile({
        photoURL: null,
      }).then(() => {
        contextSetFirebaseUser(firebase.auth().currentUser);
        self.setState(
          produce(self.state, (draft) => {
            draft.imgFile = null;
            draft.loadingImg = false;
            draft.showDropImgDialog = false;
          }),
        );
      }).catch((error: any) => {
        self.setState(
          produce(self.state, (draft) => {
            draft.errors = error.message;
            draft.loading = false;
          }),
        );
      });
    }
  }

  private handleSaveImage(): void {
    const self = this;
    const {firebaseUser, contextSetPhotoURL} = this.context;
    const {imgFile} = this.state;
    const {setProfileImgUrl} = this.props;
    const storageRef = firebase.storage().ref();
    this.setState(
      produce(this.state, (draft) => {
        draft.loadingImg = true;
      }),
    );
    try {
      if (imgFile) {
        let fileName;
        let extension;
        let imgRef: firebase.storage.Reference | null = null;
        if (imgFile.hasOwnProperty("name")) {
          const name = (imgFile as IFileObject).name;
          if (name) {
            const ext = name.split(".");
            const extpop = ext.pop();
            if (extpop) {
              extension = extpop.toLowerCase();
            }
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
          imgRef.put(imgFile as Blob)
            .then((snapshot: any) => {
              if (imgRef) {
                imgRef.getDownloadURL().then((url: string) => {
                  setProfileImgUrl(url);
                  if (firebaseUser) {
                    firebaseUser.updateProfile({
                      photoURL: url,
                    }).then(() => {
                      contextSetPhotoURL(url);
                      self.setState(
                        produce(self.state, (draft) => {
                          draft.imgFile = null;
                          draft.loadingImg = false;
                          draft.showSaveImgDialog = false;
                        }),
                      );
                    }).catch((error: any) => {
                      self.setState(
                        produce(self.state, (draft) => {
                          draft.errors = error.message;
                          draft.loading = false;
                        }),
                      );
                    });
                  }
                }).catch((e: any) => {
                  self.setState(
                    produce(self.state, (draft) => {
                      draft.errors = e.message;
                      draft.loading = false;
                    }),
                  );
                });
              }
            }).catch((e: any) => {
              self.setState(
                produce(self.state, (draft) => {
                  draft.errors = e.message;
                  draft.loading = false;
                }),
              );
            });
        }
      }
    } catch (e) {
      self.setState(
        produce(self.state, (draft) => {
          draft.errorsUploadPhoto = e;
        }),
      );
    }
  }

  private cancelImgUpload(): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.imgFile = null;
        draft.showSaveImgDialog = false;
        draft.uploadedImg = null;
      }),
    );
  }

  private cancelDropImg(): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.showDropImgDialog = false;
      }),
    );
  }
}

Profile.contextType = FirebaseUserContext;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile) as any);

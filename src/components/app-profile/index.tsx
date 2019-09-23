import "./style.scss";
import { connect } from "react-redux";
import React from "react";
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
import { IPropsGlobal } from "../shared/Interfaces";
import Modal from "react-responsive-modal";

const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  setProfileImgUrl: (imgUrl: string) => dispatch(setProfileImgUrl(imgUrl)),
  setUserFirestoreData: (userData: object | null) => dispatch(setUserFirestoreData(userData)),
});

interface IProfileProps extends IPropsGlobal {
  readonly setProfileImgUrl: any;
  readonly setUserFirestoreData: any;
  readonly userData: any;
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
  modalIsOpen: boolean;
  uploadedImg: string | ArrayBuffer | null;
  showSaveImgDialog: boolean;
  showDropImgDialog: boolean;
  showUploadImgDialog: boolean;
  errors: string | null;
  errorsUploadPhoto: string | null;
}

interface IProfileProto {
  [k: string]: any;
  [z: number]: any;
  handleLogOut(): void;
  sendVerifyLink(): void;
  handleCityChange(city: string | null): void;
  handleCountryChange(country: string | null): void;
  handleUpdateUser(): void;
  handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void;
  handleUploadClick(): void;
  handleDropImageDialog(): void;
  handleDropImage(): void;
  handleSaveImage(): void;
  cancelImgUpload(): void;
  cancelDropImg(): void;
}

class Profile
extends React.PureComponent<IProfileProps, IProfileState>
implements IProfileProto {

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
      modalIsOpen: false,
      showDropImgDialog: false,
      showSaveImgDialog: false,
      showUploadImgDialog: true,
      uploadedImg: null,
      verifyLinkSent: false,
    };

    [
      "handleLogOut",
      "sendVerifyLink",
      "handleCityChange",
      "handleUpdateUser",
      "handleCountryChange",
      "handleImageChange",
      "handleUploadClick",
      "handleSaveImage",
      "cancelImgUpload",
      "handleDropImage",
      "handleDropImageDialog",
      "cancelDropImg",
    ].forEach((propToBind: string) => {
      // @ts-ignore: Cannot find a proper solution
      this[propToBind as keyof IProfileProto] = this[propToBind as keyof Profile].bind(this);
    });
  }

  public componentDidMount() {
    const {history: {push}} = this.props;
    if (!this.context.firebaseUser) {
      push("/auth/signin");
    }
  }

  public componentDidUpdate(prevProps: IProfileProps): void {
    const {location} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  public onOpenModal = () => {
    this.context.contextShowStaticNavbar(false);
    this.setState(
      produce(this.state, (draft) => {
        draft.modalIsOpen = true;
      }),
    );
  }

  public onCloseModal = () => {
    this.context.contextShowStaticNavbar(true);
    this.setState(
      produce(this.state, (draft) => {
        draft.modalIsOpen = false;
      }),
    );
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
      modalIsOpen,
      showDropImgDialog,
      showUploadImgDialog,
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
                  <div style={{textAlign: "center"}} onClick={this.onOpenModal}>
                    <LazyLoadImage
                      src={firebaseUser.photoURL}
                      placeholderSrc="/img/no-image-slide.png"
                      effect="blur"
                      className="profile-img round-border-5px fade-in-fx" />
                  </div>
                  <Modal open={modalIsOpen}
                    onClose={this.onCloseModal} blockScroll={false}
                    overlayId="profile-modal-overlay" modalId="profile-modal" center>
                    <img src={firebaseUser.photoURL} className="profile-modal-image" />
                  </Modal>
                </>
              }

              {(firebaseUser.photoURL && uploadedImg) &&
                <>
                  <div style={{textAlign: "center"}} onClick={this.onOpenModal}>
                    <LazyLoadImage
                      src={uploadedImg as string}
                      placeholderSrc="/img/no-image-slide.png"
                      effect="blur"
                      className="profile-img round-border-5px fade-in-fx" />
                  </div>
                  <Modal open={modalIsOpen}
                    onClose={this.onCloseModal} blockScroll={false}
                    overlayId="profile-modal-overlay" modalId="profile-modal" center>
                    <img src={uploadedImg as string} className="profile-modal-image" />
                  </Modal>
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
                  <div style={{textAlign: "center"}} onClick={this.onOpenModal}>
                    <LazyLoadImage
                      src={uploadedImg as string}
                      placeholderSrc="/img/no-image-slide.png"
                      effect="blur"
                      className="profile-img round-border-5px fade-in-fx" />
                  </div>
                  <Modal open={modalIsOpen}
                    onClose={this.onCloseModal} blockScroll={false}
                    overlayId="profile-modal-overlay" modalId="profile-modal" center>
                    <img src={uploadedImg as string} className="profile-modal-image" />
                  </Modal>
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
                  <DmButton icon={<MdDone style={{fontSize: "32px"}} />} disabled={loadingImg}
                    className="margin-top button-grey" onClick={this.handleSaveImage} />
                </td>
                <td>
                  <DmButton icon={<MdClear style={{fontSize: "32px"}} />} disabled={loadingImg}
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
                  <DmButton icon={<MdDone style={{fontSize: "32px"}} />} disabled={loadingImg}
                    className="margin-top button-grey" onClick={this.handleDropImage} />
                </td>
                <td>
                  <DmButton icon={<MdClear style={{fontSize: "32px"}} />} disabled={loadingImg}
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

            {showUploadImgDialog &&
              <table style={{width: "100%"}} className="animated pulse"><tbody><tr>
                <td style={{width: "80%"}}>
                  <input type="file" className="input-hidden"
                    onChange={this.handleImageChange} id="img-file-upload" />
                  <DmButton text="LOAD PROFILE IMAGE" disabled={loadingImg}
                    className="margin-top" onClick={this.handleUploadClick} />
                </td>
                <td style={{width: "80%"}}>
                  <DmButton text={<FaTrashAlt />}
                    className="margin-top button-transparent"
                    onClick={this.handleDropImageDialog} />
                </td>
              </tr></tbody></table>
            }

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

  public sendVerifyLink(): void {
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

  public handleCityChange(city: string | null): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.city = city;
      }),
    );
  }

  public handleCountryChange(country: string | null): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.country = country;
      }),
    );
  }

  // Save additional user data to firestore
  public handleUpdateUser(): void {
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

  public handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const self = this;
    this.setState(
      produce(this.state, (draft) => {
        draft.loadingImg = true;
        draft.showUploadImgDialog = false;
      }),
    );
    const reader = new FileReader();
    if (e.target != null) {
      if (e.target.files != null) {
        const file = e.target.files[0];
        if (file) {
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
        } else {
          this.setState(
            produce(this.state, (draft) => {
              draft.loadingImg = false;
              draft.showUploadImgDialog = true;
            }),
          );
        }
      }
    }
  }

  public handleUploadClick(): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.loadingImg = true;
      }),
    );
    const el: HTMLElement = document.getElementById("img-file-upload") as HTMLElement;
    el.click();
  }

  public handleDropImageDialog(): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.showDropImgDialog = true;
        draft.showUploadImgDialog = false;
      }),
    );
  }

  public handleDropImage(): void {
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
            draft.showUploadImgDialog = true;
          }),
        );
      }).catch((error: any) => {
        self.setState(
          produce(self.state, (draft) => {
            draft.errors = error.message;
            draft.loading = false;
            draft.showUploadImgDialog = true;
          }),
        );
      });
    }
  }

  public handleSaveImage(): void {
    const self = this;
    try {
      const {firebaseUser, contextSetPhotoURL} = this.context;
      const {imgFile} = this.state;
      const {setProfileImgUrl} = this.props;
      const storageRef = firebase.storage().ref();
      this.setState(
        produce(this.state, (draft) => {
          draft.loadingImg = true;
          draft.showSaveImgDialog = false;
        }),
      );

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
                          draft.showUploadImgDialog = true;
                        }),
                      );
                    }).catch((error: any) => {
                      self.setState(
                        produce(self.state, (draft) => {
                          draft.errors = error.message;
                          draft.loading = false;
                          draft.showSaveImgDialog = false;
                          draft.showUploadImgDialog = true;
                        }),
                      );
                    });
                  }
                }).catch((e: any) => {
                  self.setState(
                    produce(self.state, (draft) => {
                      draft.errors = e.message;
                      draft.loading = false;
                      draft.showSaveImgDialog = false;
                      draft.showUploadImgDialog = true;
                    }),
                  );
                });
              }
            }).catch((e: any) => {
              self.setState(
                produce(self.state, (draft) => {
                  draft.errors = e.message;
                  draft.loading = false;
                  draft.showSaveImgDialog = false;
                  draft.showUploadImgDialog = true;
                }),
              );
            });
        }
      }
    } catch (e) {
      this.setState(
        produce(this.state, (draft) => {
          draft.errorsUploadPhoto = e;
          draft.showSaveImgDialog = false;
          draft.showUploadImgDialog = true;
        }),
      );
    }
  }

  public cancelImgUpload(): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.imgFile = null;
        draft.showSaveImgDialog = false;
        draft.uploadedImg = null;
        draft.showUploadImgDialog = true;
      }),
    );
  }

  public cancelDropImg(): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.showDropImgDialog = false;
        draft.showUploadImgDialog = true;
      }),
    );
  }
}

Profile.contextType = FirebaseUserContext;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile) as any);

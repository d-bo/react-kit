import "./style.scss";
import "firebase/auth";
import React from "react";
import DmButton from "../../shared/elements/DmButton";
import DmInput from "../../shared/elements/DmInput";
import { connect } from "react-redux";
import firebase from "firebase/app";
import { setProfileImgUrl, setUserFirestoreData } from "../../../redux/actions";
import { Link } from "react-router-dom";
import DmFolderWidget from "../../shared/widgets/DmFolderWidget";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { FirebaseUserContext } from "../../../contexts/FirebaseUserContext";
import { withRouter } from "react-router";
import ReCaptchav2 from "../../shared/elements/ReCaptchav2";
import { IWindow } from "../../shared/Interfaces";
import produce from "immer";
import { LoadingRollingBlack } from "../../shared/elements/Loader";
import { IPropsGlobal } from "../../shared/Interfaces";
import { validateEmail, validatePassword } from "../../shared/helpers/validate";
import { Toaster } from "../../shared/hocs/toast-notes";


const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  setProfileImgUrl: (url: string) => dispatch(setProfileImgUrl(url)),
  setUserFirestoreData: (userData: object | null) => dispatch(setUserFirestoreData(userData)),
});

interface ISigninProps extends IPropsGlobal {
  readonly context: any;
  readonly style: any;
  readonly setProfileImgUrl: any;
  readonly setUserFirestoreData: any;
}

interface ISigninState {
  captchaLoading: boolean;
  loading: boolean;
  errors: string | null;
  email: string | null;
  password: string | null;
  showSigninSubmitButton: boolean;
}

interface ISigninProto {
  handleSignIn(): void;
  setUserGlobalData(firebaseUser: firebase.User | null): void;
  getUserFirestoreData(firebaseUser: firebase.User | null): void;
  handlePasswordChange(e: string): void;
  handleEmailChange(e: string): void;
  handleGithub(): void;
  handleGoogle(): void;
}

class SignIn
extends React.PureComponent<ISigninProps, ISigninState>
implements ISigninProto {

  constructor(props: ISigninProps) {
    super(props);
    this.state = {
      captchaLoading: true,
      email: null,
      errors: null,
      loading: false,
      password: null,
      showSigninSubmitButton: false,
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleGithub = this.handleGithub.bind(this);
    this.handleGoogle = this.handleGoogle.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  public toast() {
    Toaster.show(
      `<b>Error:</b> Not authenticated 33g 3g 3g 34 3g3g5g5hh5h5 j5j5 56h5h6`,
      {animateSpeed: "faster", width: '100%', "text-align": "center", "border-radius": "0", vertical: "bottom", padding: "30px"}
    );
  }

  public componentDidMount() {
    this.toast();
    const {history: {push}, networkStatus} = this.props;
    if (this.context.firebaseUser) {
      push("/profile");
    }
    const self = this;
    // Offline ? reCaptcha disabled
    if (networkStatus === "online") {
      try {
        (window as unknown as IWindow).recaptchaVerifier = new
          firebase.auth.RecaptchaVerifier("recaptcha-container", {
            "callback": () => {
              self.setState(
                produce(self.state, (draft) => {
                  draft.captchaLoading = false;
                  draft.showSigninSubmitButton = true;
                }),
              );
            },
            "expired-callback": () => {
              self.setState(
                produce(self.state, (draft) => {
                  draft.errors = "Please, check out the captcha";
                  draft.showSigninSubmitButton = false;
                }),
              );
            },
            "size": "normal",
            "theme": "light",
        });
        (window as unknown as IWindow).recaptchaVerifier.render().then((widgetId: any) => {
          self.setState(
            produce(self.state, (draft) => {
              draft.captchaLoading = false;
            }),
          );
          (window as unknown as IWindow).recaptchaWidgetId = widgetId;
        });
        if (this.context.firebaseUser) {
          push("/profile");
        }
      } catch (e) {
        // reCaptcha may not render on enzyme mount test
        self.setState(
          produce(this.state, (draft) => {
            draft.errors = "reCaptcha can not load";
          }),
        );
      }
    }
    if (networkStatus === "offline") {
      self.setState(
        produce(this.state, (draft) => {
          draft.errors = "Network offline. Can not use auth service.";
        }),
      );
    }
  }

  public componentDidUpdate(prevProps: ISigninProps): void {
    const {location, networkStatus} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }

    // Internet connection status
    if (networkStatus !== prevProps.networkStatus) {
      if (networkStatus === "online") {
        this.setState(
          produce(this.state, (draft) => {
            draft.errors = null;
          }),
        );
      }
      if (networkStatus === "offline") {
        this.setState(
          produce(this.state, (draft) => {
            draft.errors = "Network offline. Can not use auth service.";
          }),
        );
      }
    }
  }

  public render(): JSX.Element {
    const {firebaseUser} = this.context;
    const {style, networkStatus} = this.props;
    const {
      captchaLoading,
      errors,
      email,
      loading,
      password,
      showSigninSubmitButton,
    } = this.state;
    return (
      <>
      <div className="container-fluid body-page-color body-page-margin-top-when-centered">
        <div className="row">
          <div className="col-md-3 col-sm-2 col-lg-4"></div>
          <div className="col-md-6 col-sm-8 col-lg-4">

          <div className="flex-vertical-center">
            <DmFolderWidget title="Sign In" className="fade-in-fx">
              {!firebaseUser &&
              <div style={style}>

                <DmInput type="text" value={email}
                  placeholder="EMAIL" onChange={this.handleEmailChange} />
                <DmInput type="password" value={password} className="input-margin-half-top"
                  onChange={this.handlePasswordChange} placeholder="PASSWORD" />

                {networkStatus === "online" &&
                  <ReCaptchav2></ReCaptchav2>
                }

                { // Is captcha solved ?
                  showSigninSubmitButton &&
                  <DmButton text="OK" disabled={loading}
                  onClick={this.handleSignIn} />
                }

                { // Captcha loading
                  captchaLoading && networkStatus === "online" &&
                  <LoadingRollingBlack/>
                }

                {errors &&
                  <div className="error-message round-border-5px">{errors}</div>
                }

                <div className="flex-space-between flex-button-link margin-top-double">
                  <div>
                    <Link to="/auth/reset">FORGOT PASSWORD ?</Link>
                  </div>
                  <div>
                    <Link to="/auth/register">REGISTER</Link>
                  </div>
                  <div>
                    <DmButton onClick={this.toast} text="ewioh" />
                  </div>
                </div>

                {networkStatus === "online" &&
                  <div className="signin-flex-box margin-top">
                    <div className="signin-flex-item">
                      <DmButton icon={<FaGithub />} text="Github" disabled={loading}
                        onClick={this.handleGithub} className="button-grey" />
                    </div>
                    <div className="signin-flex-item">
                      <DmButton icon={<FaGoogle />} text="Google" disabled={loading}
                        onClick={this.handleGithub} className="button-grey" />
                    </div>
                  </div>
                }

              </div>
              }
            </DmFolderWidget>
          </div>

          </div>
        <div className="col-md-3 col-sm-2 col-lg-4"></div>
      </div>
    </div>
    </>
    );
  }

  public setError(e: string): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.errors = e;
        draft.loading = false;
      }),
    );
  }

  public handleSignIn(): void {
    let error: string | false;  // error message
    const {contextSetFirebaseUser} = this.context;  // react context API
    if (this.state.loading) {
      return;
    }
    const self = this;
    const {password, email} = this.state;
    const {history} = this.props;

    // Validate email
    if (!validateEmail(email)) {
      this.setError("Incorrect email");
      return;
    }

    // Validate password
    error = validatePassword(password as string);
    if (error) {
      this.setError(error);
      return;
    }

    this.setState(
      produce(this.state, (draft) => {
        draft.errors = null;
        draft.loading = true;
      }),
    );

    firebase.auth().signInWithEmailAndPassword(
        email as string,
        this.state.password as string,
      ).then(() => {
        contextSetFirebaseUser(firebase.auth().currentUser);
        this.setUserGlobalData(firebase.auth().currentUser as firebase.User);
        history.push("/profile");
      }).catch((error) => {

        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === "auth/wrong-password") {
          self.setState(
            produce(self.state, (draft) => {
              draft.errors = "Wrong password";
              draft.loading = false;
            }),
          );
        } else {
          self.setState(
            produce(self.state, (draft) => {
              draft.errors = errorMessage;
              draft.loading = false;
            }),
          );
        }
      });
  }

  // Update storage user data after success sign in
  public setUserGlobalData(firebaseUser: firebase.User | null): void {
    const {setProfileImgUrl} = this.props;
    if (firebaseUser) {
      // User avatar
      if (firebaseUser.photoURL) {
        setProfileImgUrl(firebaseUser.photoURL);
      } else {
        setProfileImgUrl(null);
      }
      // Additional user data
      this.getUserFirestoreData(firebaseUser);
    }
  }

  // Update user additional profile data
  // From firestore user storage by uid
  public getUserFirestoreData(firebaseUser: firebase.User | null): void {
    const {setUserFirestoreData} = this.props;
    if (firebaseUser) {
      firebase.firestore().collection("users").doc(firebaseUser.uid)
        .onSnapshot((doc) => {
          setUserFirestoreData(doc.data());
        });
    }
  }

  public handlePasswordChange(e: string): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.password = e;
      }),
    );
  }

  public handleEmailChange(e: string): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.email = e;
      }),
    );
  }

  public handleGithub(): void {
    const {contextSetFirebaseUser} = this.context;
    const {history} = this.props;
    const {loading} = this.state;
    if (loading) {
      return;
    }
    this.setState(
      produce(this.state, (draft) => {
        draft.loading = true;
      }),
    );
    // With popup.
    const self = this;
    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope("repo");
    firebase.auth().signInWithPopup(provider).then((result) => {
      contextSetFirebaseUser(result.user);
      this.setUserGlobalData(result.user);
      self.setState(
        produce(self.state, (draft) => {
          draft.loading = false;
        }),
      );
      history.push("/profile");
    }).catch((error) => {
      self.setState(
        produce(self.state, (draft) => {
          draft.loading = false;
          draft.errors = error.message;
        }),
      );
    });
  }

  public handleGoogle(): void {
    const {history} = this.props;
    const {loading} = this.state;
    if (loading) {
      return;
    }
    const {contextSetFirebaseUser} = this.context;
    this.setState(
      produce(this.state, (draft) => {
        draft.loading = true;
      }),
    );
    // Using a popup.
    const self = this;
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    firebase.auth().signInWithPopup(provider).then((result) => {
      contextSetFirebaseUser(result.user);
      this.setUserGlobalData(result.user);
      self.setState(
        produce(self.state, (draft) => {
          draft.loading = false;
        }),
      );
      history.push("/");
    }).catch((error) => {
      self.setState(
        produce(self.state, (draft) => {
          draft.loading = false;
          draft.errors = error.message;
        }),
      );
    });
  }

  public componentWillUnmount() {
    // TODO: stop captcha loading
  }
}

SignIn.contextType = FirebaseUserContext;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn) as any);

import "./style.scss";
import "firebase/auth";
import React, { Component } from "react";
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
import { IWindow } from "../register";
import Footer from "../../app-footer";
import produce from "immer";
import {LoadingFacebookBlack} from "../../shared/elements/loading";

const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  setProfileImgUrl: (url: string) => dispatch(setProfileImgUrl(url)),
  setUserFirestoreData: (userData: object | null) => dispatch(setUserFirestoreData(userData)),
});

interface ISigninProps {
  context: React.Context<any>;
  history: any;
  style: any;
  setProfileImgUrl: any;
  setUserFirestoreData: any;
  location: any;
}

interface ISigninState {
  captchaLoading: boolean;
  loading: boolean;
  errors: string | null;
  email: string | null;
  password: string | null;
  showSigninSubmitButton: boolean;
}

class SignIn extends React.PureComponent<ISigninProps, ISigninState> {

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

  public componentDidMount() {
    const {context, history} = this.props;
    if (context) {
      history.push("/");
    }
    const self = this;
    // Google captcha prepared
    (window as IWindow).recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
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
      "size": "big",
    });
    (window as IWindow).recaptchaVerifier.render().then((widgetId: any) => {
      self.setState(
        produce(self.state, (draft) => {
          draft.captchaLoading = false;
        }),
      );
      (window as IWindow).recaptchaWidgetId = widgetId;
    });
    if (this.context.firebaseUser) {
      this.props.history.push("/profile");
    }
  }

  public componentDidUpdate(prevProps: ISigninProps): void {
    const {location} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  public render(): JSX.Element {
    const {firebaseUser} = this.context;
    const {style} = this.props;
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
      <div className="container-fluid body-page-color">
        <div className="row">
          <div className="col-sm-3 col-lg-4"></div>
          <div className="col-sm-6 col-lg-4">

          <div className="vertical-center">
            <DmFolderWidget title="Sign In" className="fade-in-fx"
              shadow="soft-left-bottom-shadow">
              {!firebaseUser &&
              <div style={style}>

                <DmInput type="text" value={email}
                  placeholder="EMAIL" onChange={this.handleEmailChange} />
                <DmInput type="password" value={password}
                  onChange={this.handlePasswordChange} placeholder="PASSWORD" />

                <ReCaptchav2></ReCaptchav2>

                { // Is captcha solved ?
                  showSigninSubmitButton &&
                  <DmButton text="OK" disabled={loading}
                  onClick={this.handleSignIn} />
                }

                { // Captcha loading
                  captchaLoading &&
                  <LoadingFacebookBlack/>
                }

                {errors &&
                  <div className="error-message round-border-5px">{errors}</div>
                }

                <div className="margin-top custom-a">
                  <table className="full-width"><tbody><tr>
                  <td style={{textAlign: "left"}}>
                      <Link to="/auth/reset">FORGOT PASSWORD ?</Link>
                  </td>
                  <td style={{textAlign: "right"}}>
                      <Link to="/auth/register">REGISTER</Link>
                  </td>
                  </tr></tbody></table>
                </div>

                <div className="margin-top custom-a">
                  <table className="full-width"><tbody><tr>
                  <td>
                    <DmButton text={<FaGithub />} disabled={loading}
                      onClick={this.handleGithub} className="button-grey" />
                  </td>
                  <td>
                    <DmButton text={<FaGoogle />} disabled={loading}
                      onClick={this.handleGithub} className="button-grey" />
                  </td>
                  </tr></tbody></table>
                </div>

              </div>
              }
            </DmFolderWidget>
          </div>

          </div>
        <div className="col-sm-3 col-lg-4"></div>
      </div>
    </div>
    <Footer />
    </>
    );
  }

  private handleSignIn(): void {
    const {contextSetFirebaseUser, firebaseUser} = this.context;
    if (this.state.loading) {
      return;
    }
    const self = this;
    const {password, email} = this.state;
    const {history} = this.props;
    // Validate email
    const re = /\S+@\S+\.\S+/;
    if (!re.test(this.state.email as string)) {
      this.setState(
        produce(this.state, (draft) => {
          draft.errors = "Incorrect email";
          draft.loading = false;
        }),
      );
      return;
    }
    // Validate password
    if (password && password.length < 6) {
      this.setState(
        produce(this.state, (draft) => {
          draft.errors = "Password min 6 symbols length";
          draft.loading = false;
        }),
      );
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
        history.push("/");
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
  private setUserGlobalData(firebaseUser: firebase.User | null): void {
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
  private getUserFirestoreData(firebaseUser: firebase.User | null): void {
    const {setUserFirestoreData} = this.props;
    if (firebaseUser) {
      firebase.firestore().collection("users").doc(firebaseUser.uid)
        .onSnapshot((doc) => {
          setUserFirestoreData(doc.data());
        });
    }
  }

  private handlePasswordChange(e: any): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.password = e;
      }),
    );
  }

  private handleEmailChange(e: any): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.email = e;
      }),
    );
  }

  private handleGithub(): void {
    const {contextSetFirebaseUser} = this.context;
    if (this.state.loading) {
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
      self.props.history.push("/");
    }).catch((error) => {
      self.setState(
        produce(self.state, (draft) => {
          draft.loading = false;
          draft.errors = error.message;
        }),
      );
    });
  }

  private handleGoogle(): void {
    if (this.state.loading) {
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
      self.props.history.push("/");
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

SignIn.contextType = FirebaseUserContext;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn) as any);

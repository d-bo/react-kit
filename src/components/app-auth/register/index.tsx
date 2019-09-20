import "./style.css";
import "firebase/auth";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import React from "react";
import DmInput from "../../shared/elements/DmInput";
import DmButton from "../../shared/elements/DmButton";
import DmFolderWidget from "../../shared/widgets/DmFolderWidget";
import ReCaptchav2 from "../../shared/elements/ReCaptchav2";
import { Router } from "react-router-dom";
import { FirebaseUserContext } from "../../../contexts/FirebaseUserContext";
import { withRouter } from "react-router";
import Footer from "../../app-footer";
import produce from "immer";
import { LoadingRollingBlack } from "../../shared/elements/Loader";
import { networkStatusType } from "../../../redux/actions";
import { connect } from "react-redux";

const mapStateToProps = (state: any) => state.firebaseAuth;

interface IRegisterProps {
  context: any;
  firebaseAuth: any;
  history: any;
  style: any;
  location: any;
  networkStatus?: networkStatusType;
}

interface IRegisterState {
  captchaLoading: boolean;
  errors: string | null;
  email: string | null;
  password: string | null;
  displayName: string | null;
  showRegisterButtonAfterCaptcha: boolean;
  verifyLinkSent: false;
  loading: boolean;
}

export interface IWindow extends Window {
  recaptchaVerifier: any;
  recaptchaWidgetId: any;
}

// Object index string | number types
interface IRegister {
  [k: string]: any;
  [z: number]: any;
}

class Register extends React.PureComponent<IRegisterProps, IRegisterState> implements IRegister {

  constructor(props: IRegisterProps) {
    super(props);
    this.state = {
      captchaLoading: true,
      displayName: null,
      email: null,
      errors: null,
      loading: false,
      password: null,
      showRegisterButtonAfterCaptcha: false,
      verifyLinkSent: false,
    };
    [
      "handleRegister",
      "handleEmailChange",
      "handlePasswordChange",
      "handleNameChange",
      "handleKeyboardEnter",
    ].forEach((propToBind: string) => {
      // @ts-ignore: Cannot find a proper solution
      this[propToBind as keyof IRegister] = this[propToBind as keyof Register].bind(this);
    });
  }

  public componentDidMount() {
    const {history, networkStatus} = this.props;
    if (this.context.firebaseUser) {
      history.push("/profile");
    }
    const self = this;
    // Offline ? reCaptcha disabled
    if (networkStatus === "online") {
      try {
        (window as unknown as IWindow).recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
          "callback": () => {
            self.setState(
              produce(self.state, (draft) => {
                draft.captchaLoading = false;
                draft.showRegisterButtonAfterCaptcha = true;
              }),
            );
          },
          "expired-callback": () => {
            self.setState(
              produce(self.state, (draft) => {
                draft.errors = "Please, check out the captcha";
                draft.showRegisterButtonAfterCaptcha = false;
              }),
            );
          },
          "size": "big",
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
          this.props.history.push("/profile");
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
      this.setState(
        produce(this.state, (draft) => {
          draft.errors = "Network offline. Can not use auth service.";
        }),
      );
    }
  }

  public componentDidUpdate(prevProps: IRegisterProps): void {
    const {location, networkStatus} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
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

    const {style, history, networkStatus} = this.props;
    const {
      captchaLoading,
      displayName,
      email,
      password,
      errors,
      loading,
      showRegisterButtonAfterCaptcha,
    } = this.state;

    return (
      <>
      <div className="container-fluid body-page-color body-page-margin-top-when-centered">
        <div className="row">
          <div className="col-md-3 col-sm-2 col-lg-4"></div>
          <div className="col-md-6 col-sm-8 col-lg-4">

          <div className="vertical-center">
            <DmFolderWidget title="Register" className="fade-in-fx"
              shadow="soft-left-bottom-shadow">
              {!this.context.firebaseUser &&
              <div style={style}>

                <DmInput type="text" value={displayName}
                placeholder="NAME" onChange={this.handleNameChange} />

                <DmInput type="text" value={email}
                placeholder="EMAIL" onChange={this.handleEmailChange} />

                <DmInput type="password" value={password}
                onChange={this.handlePasswordChange} placeholder="PASSWORD" />

                {networkStatus === "online" &&
                  <ReCaptchav2></ReCaptchav2>
                }

                {errors &&
                  <div className="error-message round-border-5px">{errors}</div>
                }

                { // Is captcha solved ?
                  showRegisterButtonAfterCaptcha &&
                    <DmButton text="Ok" loading={loading}
                    onClick={this.handleRegister} onKeyPress={this.handleKeyboardEnter} />
                }

                { // Captcha loading
                  captchaLoading && networkStatus === "online" &&
                  <LoadingRollingBlack/>
                }

                <Router history={history}>
                  <div className="margin-top custom-a">
                    <table className="full-width"><tbody><tr>
                    <td style={{textAlign: "left"}}>
                        <Link to="/auth/reset">FORGOT PASSWORD ?</Link>
                    </td>
                    <td style={{textAlign: "right"}}>
                        <Link to="/auth/signin">SIGN IN</Link>
                    </td>
                    </tr></tbody></table>
                  </div>
                </Router>

              </div>
              }
            </DmFolderWidget>
          </div>

          </div>
          <div className="col-md-3 col-sm-2 col-lg-4"></div>
        </div>
      </div>
      <Footer />
    </>
    );
  }

  private handleKeyboardEnter(e: any): void {
    if (e.key === "Enter") {
      this.handleRegister();
    }
  }

  private handleRegister(): void {
    if (this.state.loading) {
      return;
    }
    const self = this;
    const {history} = this.props;
    const {password, displayName, email} = this.state;
    const {contextSetFirebaseUser} = this.context;

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

    // Validate name
    if (displayName && displayName.length < 6) {
      this.setState(
        produce(this.state, (draft) => {
          draft.errors = "Name min 6 symbols length";
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

    firebase.auth().createUserWithEmailAndPassword(
        email as string,
        password as string,
      ).then(() => {
        const currentUser = firebase.auth().currentUser;
        // Send email verify
        if (currentUser) {
          contextSetFirebaseUser(currentUser);
          const url = `${location.protocol}//${location.hostname}${(location.port ? `:${location.port}` : "")}`;
          currentUser.sendEmailVerification({
            url,
          }).then(() => {
            self.setState(
              produce(self.state, (draft) => {
                draft.loading = false;
              }),
            );
            // User created and email verify sent
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

      }).catch((error) => {
        const errorMessage = error.message;
        self.setState(
          produce(self.state, (draft) => {
            draft.loading = false;
            draft.errors = error.message;
          }),
        );
      });
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

  private handleNameChange(e: any): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.displayName = e;
      }),
    );
  }
}

Register.contextType = FirebaseUserContext;

export default withRouter(connect(mapStateToProps)(Register) as any);

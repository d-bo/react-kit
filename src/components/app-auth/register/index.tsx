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
import { connect } from "react-redux";
import { IPropsGlobal } from "../../shared/Interfaces";
import { withFirebaseAuth, IFirebaseAuth } from "../../shared/hocs/FirebaseAuth";
import * as helpers from "../../shared/helpers/validate";

const mapStateToProps = (state: any) => state.firebaseAuth;

interface IRegisterProps extends IPropsGlobal, IFirebaseAuth {
  readonly context: any;
  readonly firebaseAuth: any;
  readonly style: any;
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

interface IRegisterProto {
  [k: string]: any;
  [z: number]: any;
  recaptchaElement?: any;
  handleKeyboardEnter?(e: any): void;
  handleRegister(): void;
  handlePasswordChange(e: string): void;
  handleEmailChange(e: string): void;
  handleNameChange(e: string): void;
}

class Register
extends React.PureComponent<IRegisterProps, IRegisterState>
implements IRegisterProto {

  // recaptcha elementId
  // TODO: make captcha container ref
  public recaptchaElement: IRegisterProto["recaptchaElement"] = null;

  constructor(props: IRegisterProps) {
    super(props);

    this.state = {
      captchaLoading: true,
      displayName: "",
      email: "",
      errors: null,
      loading: false,
      password: "",
      showRegisterButtonAfterCaptcha: false,
      verifyLinkSent: false,
    };
    [
      "handleRegister",
      "handleEmailChange",
      "handlePasswordChange",
      "handleNameChange",
      "handleKeyboardEnter",
      "setRecaptchaRef",
    ].forEach((propToBind: string) => {
      // @ts-ignore: Cannot find a proper solution
      this[propToBind as keyof IRegister] = this[propToBind as keyof Register].bind(this);
    });
  }

  public setRecaptchaRef = (id: string) => {
    this.recaptchaElement = id;
  }

  public componentDidMount() {
    const {history: {push}, networkStatus} = this.props;
    if (this.context.firebaseUser) {
      push("/profile");
    }
    const self = this;
    // Offline ? reCaptcha disabled
    if (networkStatus === "online") {
      this.props.firebaseRecaptchaRender(
        this.recaptchaElement,
        {
          captchaError: (e: any) => {
            self.setState(
              produce(this.state, (draft) => {
                draft.errors = "reCaptcha can not load";
              }),
            );
          },
          captchaIsVerified: () => {
            self.setState(
              produce(self.state, (draft) => {
                draft.captchaLoading = false;
                draft.showRegisterButtonAfterCaptcha = true;
              }),
            );
          },
          captchaRendered: () => {
            self.setState(
              produce(self.state, (draft) => {
                draft.captchaLoading = false;
              }),
            );
          },
          expiredCallback: () => {
            self.setState(
              produce(self.state, (draft) => {
                draft.errors = "Please, check out the captcha";
                draft.showRegisterButtonAfterCaptcha = false;
              }),
            );
          },
        },
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
                  <ReCaptchav2 setRef={this.setRecaptchaRef} />
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

  public handleKeyboardEnter(e: any): void {
    if (e.key === "Enter") {
      this.handleRegister();
    }
  }

  public setError(e: string): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.errors = e;
        draft.loading = false;
      }),
    );
  }

  public handleRegister(): void {
    if (this.state.loading) {
      return;
    }

    const self = this;
    let error: string | false;
    const {
      history,
      createUserWithEmailAndPassword,
    } = this.props;
    const {password, displayName, email} = this.state;
    const {contextSetFirebaseUser} = this.context;

    // Validate name
    error = helpers.validateName(displayName as string);
    if (error) {
      this.setError(error);
      return;
    }

    // Validate password
    error = helpers.validatePassword(password as string);
    if (error) {
      this.setError(error);
      return;
    }

    // Validate email
    if (!helpers.validateEmail(email)) {
      this.setError("Incorrect email");
      return;
    }

    // Loading ...
    this.setState(
      produce(this.state, (draft) => {
        draft.errors = null;
        draft.loading = true;
      }),
    );

    createUserWithEmailAndPassword(email as string, password as string, {}, {
      afterCreate: () => {
        /*
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
        */
      },
      onError: (error: any) => {
        self.setState(
          produce(self.state, (draft) => {
            draft.loading = false;
            draft.errors = error.message;
          }),
        );
      },
    });
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

  public handleNameChange(e: string): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.displayName = e;
      }),
    );
  }
}

Register.contextType = FirebaseUserContext;

export default withFirebaseAuth(withRouter(connect(mapStateToProps)(Register) as any));

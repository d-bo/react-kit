import "./style.scss";
import "firebase/auth";
import { Link } from "react-router-dom";
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
  errors: string | null | boolean;
  email: string | null;
  password: string | null;
  displayName: string | null;
  showRegisterButtonAfterCaptcha: boolean;
  verifyLinkSent: false;
  loading: boolean;
  passwordConfirm: string | null;
  passwordMatch: boolean | null;
  emailValidate: boolean | null;
  nameValidate: boolean | null;
  passwordValidate: boolean | null;
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
  handlePasswordConfirmChange(e: string): void;
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
      emailValidate: null,
      errors: null,
      loading: false,
      nameValidate: null,
      password: "",
      passwordConfirm: "",
      passwordMatch: null,
      passwordValidate: null,
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
      "handlePasswordConfirmChange",
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
      passwordConfirm,
      passwordValidate,
      nameValidate,
      emailValidate,
      passwordMatch,
      showRegisterButtonAfterCaptcha,
    } = this.state;

    return (
      <>
      <div className="container-fluid body-page-color body-page-margin-top-when-centered">
        <div className="row">
          <div className="col-md-3 col-sm-2 col-lg-4"></div>
          <div className="col-md-6 col-sm-8 col-lg-4">

          <div className="flex-vertical-center">
            <DmFolderWidget title="Register" className="fade-in-fx"
              shadow="soft-left-bottom-shadow">
              {!this.context.firebaseUser &&
                <>
                  <DmInput type="text" value={displayName}
                    placeholder="NAME" onChange={this.handleNameChange}
                    rightWidget={nameValidate} />

                  <DmInput type="text" value={email}
                    placeholder="EMAIL" onChange={this.handleEmailChange}
                    rightWidget={emailValidate} className="input-margin-top" />

                  <DmInput
                      type="password"
                      value={password}
                      onChange={this.handlePasswordChange}
                      placeholder="PASSWORD"
                      rightWidget={passwordValidate} className="input-margin-top" />

                  <DmInput
                      type="password"
                      value={passwordConfirm}
                      onChange={this.handlePasswordConfirmChange}
                      placeholder="CONFIRM PASSWORD"
                      rightWidget={passwordMatch} className="input-margin-top" />

                  {errors &&
                    <div className="error-message round-border-5px">{errors}</div>
                  }

                  { // Captcha loading
                    captchaLoading && networkStatus === "online" &&
                    <>
                      <LoadingRollingBlack/>
                    </>
                  }

                  {networkStatus === "online" &&
                    <ReCaptchav2 setRef={this.setRecaptchaRef} />
                  }

                  { // Is captcha solved ?
                    showRegisterButtonAfterCaptcha &&
                      <DmButton text="Ok" loading={loading}
                      onClick={this.handleRegister} onKeyPress={this.handleKeyboardEnter} />
                  }

                  <Router history={history}>
                    <div className="register-flex-space-between register-link margin-top">
                      <div>
                        <Link to="/auth/reset">FORGOT PASSWORD ?</Link>
                      </div>
                      <div>
                        <Link to="/auth/signin">SIGN IN</Link>
                      </div>
                    </div>
                  </Router>
                </>
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
    // Doing nothing while loading
    if (this.state.loading) {
      return;
    }
    const self = this;
    const {
      createUserWithEmailAndPassword,
      history,
      firebaseGetUser,
      sendEmailVerification,
    } = this.props;
    const {
      password,
      email,
      displayName,
      passwordConfirm,
      nameValidate,
      passwordValidate,
      passwordMatch,
      emailValidate,
    } = this.state;
    const {contextSetFirebaseUser} = this.context;

    this.handleNameChange(displayName);
    this.handleEmailChange(email);
    this.handlePasswordChange(password);
    this.handlePasswordConfirmChange(passwordConfirm);

    if (!nameValidate || !passwordMatch || !passwordValidate || !emailValidate) {
      return;
    }

    // Loading ...
    this.setState(
      produce(this.state, (draft) => {
        draft.errors = null;
        draft.loading = true;
      }),
    );

    // Create firebase user
    createUserWithEmailAndPassword(email as string, password as string,
      // Success callback
      // Scenario: create, auto log in, check email link to activate
      () => {
        this.setState(
          produce(self.state, (draft) => {
            draft.loading = false;
          }),
        );
        sendEmailVerification({}, (error) => {
          this.setState(
            produce(self.state, (draft) => {
              draft.errors = error;
            }),
          );
        });
        contextSetFirebaseUser(firebaseGetUser());
        history.push("/profile");
      },
      // Error
      (error: any) => {
        self.setState(
          produce(self.state, (draft) => {
            draft.loading = false;
            draft.errors = error.message;
          }),
        );
      },
    );
  }

  /**
   * Handle email change and validate
   * @param e Email string
   */
  public handleEmailChange(e: string | null): void {
    let error: string | false;
    // Validate email
    if (!helpers.validateEmail(e)) {
      error = "Incorrect email";
    } else {
      error = false;
    }
    this.setState(
      produce(this.state, (draft) => {
        draft.email = e;
        draft.errors = error ? error : null;
        draft.emailValidate = error ? false : true;
      }),
    );
  }

  /**
   * Handle user name change
   * @param e User name string
   */
  public handleNameChange(e: string | null): void {
    let error: string | false;
    error = helpers.validateName(e);
    this.setState(
      produce(this.state, (draft) => {
        draft.displayName = e;
        draft.errors = error ? error : null;
        draft.nameValidate = error ? false : true;
      }),
    );
  }

  /**
   * Handle password change
   * @param e Original password string
   */
  public handlePasswordChange(e: string | null): void {
    let error: string | false;
    // Validate password
    error = helpers.validatePassword(e);
    this.setState(
      produce(this.state, (draft) => {
        draft.password = e;
        draft.errors = error ? error : null;
        draft.passwordValidate = error ? false : true;
      }),
    );
  }

  /**
   * Handle change of confirmed password
   * @param e Confirm password string
   */
  public handlePasswordConfirmChange(e: string | null): void {
    const {password} = this.state;
    const match = [password].includes(e);
    this.setState(
      produce(this.state, (draft) => {
        draft.passwordConfirm = e;
        draft.errors = !match ? "Password mismatch" : null;
        draft.passwordMatch = match;
      }),
    );
  }
}

Register.contextType = FirebaseUserContext;

export default withFirebaseAuth(withRouter(connect(mapStateToProps)(Register) as any));

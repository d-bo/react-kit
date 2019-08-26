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

interface IRegisterProps {
  firebaseAuth: any;
  history: any;
  style: any;
  location: any;
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

class Register extends React.PureComponent<IRegisterProps, IRegisterState> {

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
    this.handleRegister = this.handleRegister.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleKeyboardEnter = this.handleKeyboardEnter.bind(this);
  }

  public componentDidMount() {
    const self = this;
    (window as IWindow).recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
      "callback": () => {
        self.setState({
          captchaLoading: false,
          showRegisterButtonAfterCaptcha: true,
        });
      },
      "expired-callback": () => {
        self.setState({
          errors: "Please, check out the captcha",
          showRegisterButtonAfterCaptcha: false,
        });
      },
      "size": "big",
    });
    (window as IWindow).recaptchaVerifier.render().then((widgetId: any) => {
      self.setState({
        captchaLoading: false,
      });
      (window as IWindow).recaptchaWidgetId = widgetId;
    });
    if (this.context.firebaseUser) {
      this.props.history.push("/profile");
    }
  }

  public componentDidUpdate(prevProps: IRegisterProps): void {
    const {location} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  public render(): JSX.Element {

    const {style, history} = this.props;
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
      <div className="container-fluid body-page-color">
        <div className="row">
          <div className="col-sm-2 col-lg-4"></div>
          <div className="col-sm-8 col-lg-4">

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

                <ReCaptchav2 />

                {errors &&
                  <div className="error-message round-border-5px">{errors}</div>
                }

                { // Is captcha solved ?
                  showRegisterButtonAfterCaptcha &&
                    <DmButton text="Ok" loading={loading}
                    onClick={this.handleRegister} onKeyPress={this.handleKeyboardEnter} />
                }

                { // Captcha loading
                  captchaLoading &&
                  <DmButton loading={true} />
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
          <div className="col-sm-2 col-lg-4"></div>
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
      this.setState({
        errors: "Incorrect email",
        loading: false,
      });
      return;
    }

    // Validate password
    if (password && password.length < 6) {
      this.setState({
        errors: "Password min 6 symbols length",
        loading: false,
      });
      return;
    }

    // Validate name
    if (displayName && displayName.length < 6) {
      this.setState({
        errors: "Name min 6 symbols length",
        loading: false,
      });
      return;
    }

    this.setState({
      errors: null,
      loading: true,
    });

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
            self.setState({
              loading: false,
            });
            // User created and email verify sent
            history.push("/");
          }).catch((error) => {
            self.setState({
              errors: error.message,
              loading: false,
            });
          });
        }

      }).catch((error) => {
        const errorMessage = error.message;
        self.setState({
          errors: errorMessage,
          loading: false,
        });
      });
  }

  private handlePasswordChange(e: any): void {
    this.setState({
      password: e,
    });
  }

  private handleEmailChange(e: any): void {
    this.setState({
      email: e,
    });
  }

  private handleNameChange(e: any): void {
    this.setState({
      displayName: e,
    });
  }
}

Register.contextType = FirebaseUserContext;

export default withRouter(Register as any);

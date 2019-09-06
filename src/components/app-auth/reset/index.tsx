import "./style.css";
import React, { Component } from "react";
import DmButton from "../../shared/elements/DmButton";
import DmInput from "../../shared/elements/DmInput";
import { connect } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";
import { firebaseAuth } from "../../../redux/actions";
import { Link } from "react-router-dom";
import DmFolderWidget from "../../shared/widgets/DmFolderWidget";
import { Router } from "react-router-dom";
import { FirebaseUserContext } from "../../../contexts/FirebaseUserContext";
import { withRouter } from "react-router";
import { IWindow } from "../register";
import ReCaptchav2 from "../../shared/elements/ReCaptchav2";
import Footer from "../../app-footer";
import produce from "immer";
import {LoadingRollingBlack} from "../../shared/elements/Loader";
import { networkStatusType } from "../../../redux/actions";

const mapStateToProps = (state: any) => {
  return state.firebaseAuth;
};

const mapDispatchToProps = (dispatch: any) => ({
  firebaseAuth: (firebaseUser: any) => dispatch(firebaseAuth(firebaseUser)),
});

interface IResetProps {
  context: any;
  history: any;
  networkStatus?: networkStatusType;
  style: any;
  email: string | null;
  password: string | null;
  user: firebase.User | null;
  location: any;
}

interface IResetState {
  captchaLoading: boolean;
  loading: boolean;
  errors: string | null;
  email: string | null;
  password: string | null;
  resetSent: boolean;
  user: firebase.User | null;
  showResetSubmitButton: any;
}

class Reset extends React.PureComponent<IResetProps, IResetState> {

  constructor(props: IResetProps) {
    super(props);
    this.state = {
      captchaLoading: true,
      email: props.email,
      errors: null,
      loading: false,
      password: props.password,
      resetSent: false,
      showResetSubmitButton: false,
      user: props.user,
    };
    this.handleReset = this.handleReset.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  public componentDidMount(): void {
    const {history, networkStatus} = this.props;
    if (this.context.firebaseUser) {
      history.push("/profile");
    }
    const self = this;
    if (networkStatus === "online") {
      try {
        (window as IWindow).recaptchaVerifier = new
          firebase.auth.RecaptchaVerifier("recaptcha-container", {
            "callback": () => {
              self.setState(
                produce(self.state, (draft) => {
                  draft.captchaLoading = false;
                  draft.showResetSubmitButton = true;
                }),
              );
            },
            "expired-callback": () => {
              self.setState(
                produce(self.state, (draft) => {
                  draft.errors = "Please, check out the captcha";
                  draft.showResetSubmitButton = false;
                }),
              );
            },
            "size": "normal",
            "theme": "light",
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

  public componentDidUpdate(prevProps: IResetProps): void {
    const {location} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  public render(): JSX.Element {
    const {style, history} = this.props;
    const {firebaseUser} = this.context;
    const {
      captchaLoading,
      email,
      errors,
      resetSent,
      loading,
      showResetSubmitButton,
    } = this.state;
    return (
      <>
      <div className="container-fluid body-page-color body-page-margin-top-when-centered">
        <div className="row">
          <div className="col-md-3 col-sm-2 col-lg-4"></div>
          <div className="col-md-6 col-sm-8 col-lg-4">
          <div className="vertical-center">
            <DmFolderWidget title="Reset password" className="fade-in-fx"
              shadow="soft-left-bottom-shadow">
              <p></p>
              {!firebaseUser &&
              <div style={style}>
                {!resetSent &&
                  <>
                  <div className="action-message round-border-3px">
                  Enter your email address. We will send you reset link.
                  </div>

                  <DmInput type="text" value={email}
                  placeholder="EMAIL" onChange={this.handleEmailChange} />

                <ReCaptchav2 />

                { // Is captcha solved ?
                  showResetSubmitButton &&
                  <DmButton text="Ok" loading={loading}
                    onClick={this.handleReset} />
                }

                { // Captcha loading
                  captchaLoading &&
                  <LoadingRollingBlack/>
                }

                {errors &&
                  <div className="error-message round-border-3px">{errors}</div>}
                </>
                }
                {resetSent &&
                  <>
                  <div className="action-message round-border-5px">
                    Check your email. We have send you reset link.
                  </div>
                  </>
                }
                <Router history={history}>
                  <div className="margin-top custom-a">
                    <table className="full-width"><tbody><tr>
                    <td style={{textAlign: "left"}}>
                        <Link to="/auth/signin">SIGN IN</Link>
                    </td>
                    <td style={{textAlign: "right"}}>
                        <Link to="/auth/register">REGISTER</Link>
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

  private handleReset(): void {
    const self = this;
    const {email, loading} = this.state;
    if (loading) {
      return;
    }
    this.setState(
      produce(this.state, (draft) => {
        draft.errors = null;
        draft.loading = true;
      }),
    );
    firebase.auth().sendPasswordResetEmail(
        email as string,
        {url: `${location.protocol}//${location.hostname}${(location.port ? `:${location.port}` : "")}`},
      ).then(() => {
      self.setState(
        produce(self.state, (draft) => {
          draft.resetSent = true;
          draft.loading = false;
        }),
      );
    }).catch((error) => {
      self.setState(
        produce(self.state, (draft) => {
          draft.errors = error.message;
          draft.loading = false;
        }),
      );
    });
  }

  private handleEmailChange(e: any): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.email = e;
      }),
    );
  }
}

Reset.contextType = FirebaseUserContext;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reset) as any);

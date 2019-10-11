import "./style.css";
import React from "react";
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
import { IWindow } from "../../shared/Interfaces";
import ReCaptchav2 from "../../shared/elements/ReCaptchav2";
import Footer from "../../app-footer";
import produce from "immer";
import { LoadingRollingBlack } from "../../shared/elements/Loader";
import { IPropsGlobal } from "../../shared/Interfaces";

const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  firebaseAuth: (firebaseUser: any) => dispatch(firebaseAuth(firebaseUser)),
});

interface IResetProps extends IPropsGlobal {
  readonly context: any;
  readonly style: any;
  readonly email: string | null;
  readonly password: string | null;
  readonly user: firebase.User | null;
  readonly location: any;
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

interface IResetProto {
  handleEmailChange(e: string): void;
  handleReset(): void;
}

class Reset
extends React.PureComponent<IResetProps, IResetState>
implements IResetProto {

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
    const {history: {push}, networkStatus} = this.props;
    if (this.context.firebaseUser) {
      push("/profile");
    }
    const self = this;
    if (networkStatus === "online") {
      try {
        (window as unknown as IWindow).recaptchaVerifier = new
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

  public componentDidUpdate(prevProps: IResetProps): void {
    const {location} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  public render(): JSX.Element {
    const {style, history, networkStatus} = this.props;
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
          <div className="flex-vertical-center">
            <DmFolderWidget title="Reset password" className="fade-in-fx"
               >
              {!firebaseUser &&
              <div style={style}>
                {!resetSent &&
                  <>
                  <div className="action-message round-border-3px">
                  Enter your email address. We will send you reset link.
                  </div>

                  <DmInput type="text" value={email} className="input-margin-top"
                  placeholder="EMAIL" onChange={this.handleEmailChange} />

                {networkStatus === "online" &&
                  <ReCaptchav2 />
                }

                { // Is captcha solved ?
                  showResetSubmitButton &&
                  <DmButton text="Ok" loading={loading}
                    onClick={this.handleReset} />
                }

                { // Captcha loading
                  captchaLoading && networkStatus === "online" &&
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
                  <div className="flex-space-between flex-button-link margin-top">
                    <div>
                        <Link to="/auth/signin">SIGN IN</Link>
                    </div>
                    <div>
                        <Link to="/auth/register">REGISTER</Link>
                    </div>
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

  public handleReset(): void {
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
        {url: `${window.location.protocol}//${window.location.hostname}${(window.location.port ? `:${window.location.port}` : "")}`},
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

  public handleEmailChange(e: any): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.email = e;
      }),
    );
  }
}

Reset.contextType = FirebaseUserContext;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reset) as any);

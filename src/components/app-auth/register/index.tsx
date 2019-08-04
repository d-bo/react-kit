import "./style.css";
import "firebase/auth";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as firebase from "firebase/app";
import React from "react";
import DmInput from "../../shared/elements/DmInput";
import DmButton from "../../shared/elements/DmButton";
import { firebaseAuth } from "../../../redux/actions";
import DmFolderWidget from "../../shared/widgets/DmFolderWidget";
import { Router } from "react-router-dom";
import { FirebaseUserContext } from "../../../contexts/FirebaseUserContext";
import { withRouter } from "react-router";

const mapStateToProps = (state: any) => {
  return state.firebaseAuth;
};

const mapDispatchToProps = (dispatch: any) => ({
  firebaseAuth: (firebaseUser: firebase.User) => dispatch(firebaseAuth(firebaseUser)),
});

interface IRegisterProps {
  firebaseAuth: any;
  history: any;
  style: any;
  user: firebase.User | null;
  location: any;
}

interface IRegisterState {
  errors: string | null;
  email: string | null;
  password: string | null;
  displayName: string | null;
  verifyLinkSent: false;
  user: firebase.User | null;
  loading: boolean;
}

class Register extends React.Component<IRegisterProps, IRegisterState> {

  constructor(props: IRegisterProps) {
    if (firebase.auth().currentUser) {
      props.history.push("/");
    }
    super(props);
    this.state = {
      displayName: null,
      email: null,
      errors: null,
      loading: false,
      password: null,
      user: props.user,
      verifyLinkSent: false,
    };
    this.handleRegister = this.handleRegister.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleKeyboardEnter = this.handleKeyboardEnter.bind(this);
  }

  public componentDidUpdate(prevProps: IRegisterProps): void {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  public render(): JSX.Element {

    const {style, history} = this.props;
    const {
      displayName,
      email,
      password,
      errors,
      loading,
    } = this.state;

    return (
      <>
      <div className="container">
        <div className="row">
          <div className="col-sm-2 col-lg-4"></div>
          <div className="col-sm-8 col-lg-4">

          <div className="vertical-center">
            <DmFolderWidget title="Register" className="fade-in-fx"
              shadow="soft-left-bottom-shadow">
              {!this.context &&
              <div style={style}>

                <DmInput type="text" value={displayName} 
                placeholder="NAME" onChange={this.handleNameChange} />

                <DmInput type="text" value={email} 
                placeholder="EMAIL" onChange={this.handleEmailChange} />

                <DmInput type="password" value={password}
                onChange={this.handlePasswordChange} placeholder="PASSWORD" />

                <DmButton text="Ok" loading={loading} 
                onClick={this.handleRegister} onKeyPress={this.handleKeyboardEnter}
                style={{marginTop: "35px"}} />

                {errors &&
                  <div className="error-message round-border-5px">{errors}</div>}

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
    </>
    );
  }

  private handleKeyboardEnter (e: any) {
    if (e.key === "Enter") {
      this.handleRegister();
    }
  }

  private handleRegister() {
    if (this.state.loading) {
      return;
    }
    const self = this;
    const currentUser = firebase.auth().currentUser;
    const {password, displayName, email} = this.state;
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

        self.props.firebaseAuth(currentUser);
        // Send email verify
        if (currentUser) {
          currentUser.sendEmailVerification({
            url: "http://localhost:3000/",
          }).then(() => {
            self.setState({
              loading: false,
            });
            // User created and email verify sent
            self.props.history.push("/");
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

  private handlePasswordChange(e: any) {
    this.setState({
      password: e,
    });
  }

  private handleEmailChange(e: any) {
    this.setState({
      email: e,
    });
  }

  private handleNameChange(e: any) {
    this.setState({
      displayName: e,
    });
  }
}

Register.contextType = FirebaseUserContext;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register as any) as any);

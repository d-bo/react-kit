import "./style.scss";
import "firebase/auth";
import React, { Component } from "react";
import DmButton from "../../shared/elements/DmButton";
import DmInput from "../../shared/elements/DmInput";
import { connect } from "react-redux";
import firebase from "firebase/app";
import { firebaseAuth, setProfileImgUrl, setUserFirestoreData } from "../../../redux/actions";
import { Link } from "react-router-dom";
import DmFolderWidget from "../../shared/widgets/DmFolderWidget";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { FirebaseUserContext } from "../../../contexts/FirebaseUserContext";
import { withRouter } from "react-router";

const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  firebaseAuth: (firebaseUser: any) => dispatch(firebaseAuth(firebaseUser)),
  setProfileImgUrl: (url: string) => dispatch(setProfileImgUrl(url)),
  setUserFirestoreData: (userData: object | null) => dispatch(setUserFirestoreData(userData)),
});

interface ISigninProps {
  history: any;
  firebaseAuth: any;
  style: any;
  setProfileImgUrl: any;
  setUserFirestoreData: any;
  location: any;
}

interface ISigninState {
  loading: boolean;
  errors: string | null;
  email: string | null;
  password: string | null;
}

class SignIn extends React.Component<ISigninProps, ISigninState> {

  constructor(props: ISigninProps) {
    super(props);
    this.state = {
      email: null,
      errors: null,
      loading: false,
      password: null,
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleGithub = this.handleGithub.bind(this);
    this.handleGoogle = this.handleGoogle.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  public componentDidUpdate(prevProps: ISigninProps): void {
    const {location} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  public render(): JSX.Element {
    const firebaseUser = this.context;
    const {style} = this.props;
    const {errors, email, loading, password} = this.state;
    return (
      <>
      <div className="container">
        <div className="row">
          <div className="col-sm-2 col-lg-4"></div>
          <div className="col-sm-8 col-lg-4">

          <div className="vertical-center">
            <DmFolderWidget title="Sign In" className="fade-in-fx"
              shadow="soft-left-bottom-shadow">
              {!firebaseUser &&
              <div style={style}>

                <DmInput type="text" value={email} 
                  placeholder="EMAIL" onChange={this.handleEmailChange} />
                <DmInput type="password" value={password} 
                  onChange={this.handlePasswordChange} placeholder="PASSWORD" />

                <DmButton text="OK" loading={loading} 
                  onClick={this.handleSignIn} style={{marginTop: "35px"}} />

                {errors && 
                  <div className="error-message round-border-5px">{errors}</div>}

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
                    <DmButton text={<FaGithub />} loading={loading} 
                      onClick={this.handleGithub} className="button-grey" />
                  </td>
                  <td>
                    <DmButton text={<FaGoogle />} loading={loading} 
                      onClick={this.handleGithub} className="button-grey" />
                  </td>
                  </tr></tbody></table>
                </div>

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

  private handleSignIn(): void {
    if (this.state.loading) {
      return;
    }
    const self = this;
    const {password, email} = this.state;
    const {firebaseAuth, history} = this.props;
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

    this.setState({
      errors: null,
      loading: true,
    });

    firebase.auth().signInWithEmailAndPassword(
        email as string,
        this.state.password as string,
      ).then(() => {
        firebaseAuth(firebase.auth().currentUser);
        this.setUserGlobalData(firebase.auth().currentUser as firebase.User);
        history.push("/");
      }).catch((error) => {

        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === "auth/wrong-password") {
          self.setState({
            errors: "Wrong password",
            loading: false,
          });
        } else {
          self.setState({
            errors: errorMessage,
            loading: false,
          });
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
        setProfileImgUrl("");
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
    this.setState({
      password: e,
    });
  }

  private handleEmailChange(e: any): void {
    this.setState({
      email: e,
    });
  }

  private handleGithub(): void {
    if (this.state.loading) {
      return;
    }
    this.setState({loading: true});
    // With popup.
    const self = this;
    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope("repo");
    firebase.auth().signInWithPopup(provider).then((result) => {
      self.props.firebaseAuth(result.user);
      this.setUserGlobalData(result.user);
      self.setState({loading: false});
      self.props.history.push("/");
    }).catch((error) => {
      self.setState({loading: false, errors: error.message});
    });
  }

  private handleGoogle(): void {
    if (this.state.loading) {
      return;
    }
    this.setState({loading: true});
    // Using a popup.
    const self = this;
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    firebase.auth().signInWithPopup(provider).then((result) => {
       self.props.firebaseAuth(result.user);
       this.setUserGlobalData(result.user);
       self.setState({loading: false});
       self.props.history.push("/");
    }).catch((error) => {
      self.setState({loading: false, errors: error.message});
    });
  }
}

SignIn.contextType = FirebaseUserContext;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn) as any);

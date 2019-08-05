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

const mapStateToProps = (state: any) => {
  return state.firebaseAuth;
};

const mapDispatchToProps = (dispatch: any) => ({
  firebaseAuth: (firebaseUser: any) => dispatch(firebaseAuth(firebaseUser)),
});

interface IResetProps {
  history: any;
  style: any;
  email: string | null;
  password: string | null;
  user: firebase.User | null;
  location: any;
}

interface IResetState {
  loading: boolean;
  errors: string | null;
  email: string | null;
  password: string | null;
  resetSent: boolean;
  user: firebase.User | null;
}

class Reset extends React.Component<IResetProps, IResetState> {

  constructor(props: IResetProps) {
    if (firebase.auth().currentUser) {
      props.history.push("/");
    }
    super(props);
    this.state = {
      email: props.email,
      errors: null,
      loading: false,
      password: props.password,
      resetSent: false,
      user: props.user,
    };
    this.handleReset = this.handleReset.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  public componentDidUpdate(prevProps: IResetProps): void {
    const {location} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  public render(): JSX.Element {
    const {style, history} = this.props;
    const firebaseUser = this.context;
    const {email, errors, resetSent, loading} = this.state;
    return (
      <>
      <div className="container">
        <div className="row">
          <div className="col-sm-2 col-lg-4"></div>
          <div className="col-sm-8 col-lg-4">

          <div className="vertical-center">
            <DmFolderWidget title="Reset password" className="fade-in-fx"
              shadow="soft-left-bottom-shadow">
              {!firebaseUser &&
              <div style={style}>
                {!resetSent &&
                  <>
                  <div className="action-message round-border-3px">
                  Enter your email address. We will send you reset link.
                  </div>

                  <DmInput type="text" value={email}
                  placeholder="EMAIL" onChange={this.handleEmailChange} />

                  <DmButton text="Ok" loading={loading}
                  onClick={this.handleReset} style={{marginTop: "35px"}} />

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
        <div className="col-sm-2 col-lg-4"></div>
      </div>
    </div>
    </>
    );
  }

  private handleReset(): void {
    const self = this;
    const {email, loading} = this.state;
    if (loading) {
      return;
    }
    this.setState({
      errors: null,
      loading: true,
    });
    firebase.auth().sendPasswordResetEmail(
        email as string,
        {url: "http://localhost:3000"}
      ).then(() => {
      self.setState({
        loading: false,
        resetSent: true,
      });
    }).catch((error) => {
      self.setState({
        errors: error.message,
        loading: false,
      });
    });
  }

  private handleEmailChange(e: any): void {
    this.setState({
      email: e,
    });
  }
}

Reset.contextType = FirebaseUserContext;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reset) as any);

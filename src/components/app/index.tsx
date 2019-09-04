import Navbar from "../app-navbar";
import firebase from "firebase/app";
import React, { Suspense } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { FirebaseUserContext } from "../../contexts/FirebaseUserContext";
import * as LazyComponents from "./LazyComponents";
import produce from "immer";
import { connect } from "react-redux";
import { hideSidebar } from "../../redux/actions";

const mapStateToProps = (state: any) => state.firebaseAuth;

const mapDispatchToProps = (dispatch: any) => {
  return {
    handleHideSidebar: () => dispatch(hideSidebar()),
  };
};

interface IAppProps {
  firebaseUser?: firebase.User | null;
  history?: any;
  handleHideSidebar?: any;
  setProfileImgUrl?: any;
}

interface IAppState {
  firebaseUser: firebase.User | undefined | null ;
  errors: string | null;
  loading: boolean;
  loadingExit: boolean;
  verifyLinkSent: boolean;
}

class App extends React.Component<IAppProps, IAppState> {

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      errors: null,
      firebaseUser: this.props.firebaseUser,
      loading: false,
      loadingExit: false,
      verifyLinkSent: false,
    };
    this.contextSetFirebaseUser = this.contextSetFirebaseUser.bind(this);
    this.clickBodyListener = this.clickBodyListener.bind(this);
  }

  // Dynamically set user from child components
  // Setting null as a logout
  public contextSetFirebaseUser(firebaseUser: firebase.User | null) {
    this.setState(
      produce(this.state, (draft) => {
        draft.firebaseUser = firebaseUser;
      }),
    );
  }

  // TODO: sidebar hides, so i can't click and execute click event listener
  public clickBodyListener(e: MouseEvent) {
    //this.props.handleHideSidebar(e);
  }
  public componentDidMount() {
    //document.addEventListener("mousedown", this.clickBodyListener, true);
  }
  public componentWillUnmount() {
    //document.removeEventListener("mousedown", this.clickBodyListener);
  }

  public render() {
    const {history} = this.props;
    const {firebaseUser} = this.state;
    return (
      <>
        <FirebaseUserContext.Provider value={{
          contextSetFirebaseUser: this.contextSetFirebaseUser,
          firebaseUser,
        }}>
          <Navbar {...this.props} />
            <Router history={history}>
              <Suspense fallback="">
                <Switch>
                  <Route path="/" exact>
                    <LazyComponents.HomeComponent/>
                  </Route>
                  <Route path="/profile">
                    <LazyComponents.ProfileComponent/>
                  </Route>
                  <Route path="/person/:id">
                    <LazyComponents.PersonComponent/>
                  </Route>
                  <Route path="/auth/signin">
                    <LazyComponents.SignInComponent/>
                  </Route>
                  <Route path="/auth/register">
                    <LazyComponents.RegisterComponent/>
                  </Route>
                  <Route path="/auth/reset">
                    <LazyComponents.ResetComponent/>
                  </Route>
                  <Route>
                    <LazyComponents.NotFound404Component/>
                  </Route>
                </Switch>
              </Suspense>
            </Router>
        </FirebaseUserContext.Provider>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

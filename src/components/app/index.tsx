import Navbar from "../app-navbar";
import Footer from "../app-footer";
import firebase from "firebase/app";
import React, { lazy, Suspense } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { FirebaseUserContext } from "../../contexts/FirebaseUserContext";

const ResetComponent = (
  lazy(() => (
    import("../app-auth/reset")
  ))
);

const SignInComponent = (
  lazy(() => (
    import("../app-auth/signin")
  ))
);

const ProfileComponent = (
  lazy(() => (
    import("../app-profile")
  ))
);

const HomeComponent = (
  lazy(() => (
    import("../app-home")
  ))
);

const RegisterComponent = (
  lazy(() => (
    import("../app-auth/register")
  ))
);

const PersonComponent = (
  lazy(() => (
    import("../app-person")
  ))
);

const NotFound404Component = (
  lazy(() => (
    import("../app-404")
  ))
);

interface IAppProps {
  firebaseUser: firebase.User | null;
  history?: any;
}

interface IAppState {
  firebaseUser: firebase.User | null;
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
  }

  // Dynamically set user from child components
  // Setting null as a logout
  public contextSetFirebaseUser(firebaseUser: firebase.User | null) {
    this.setState({
      firebaseUser,
    });
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
              <Suspense fallback="Loading ...">
                <Switch>
                  <Route path="/" exact>
                    <HomeComponent/>
                  </Route>
                  <Route path="/profile">
                    <ProfileComponent/>
                  </Route>
                  <Route path="/person/:id">
                    <PersonComponent/>
                  </Route>
                  <Route path="/auth/signin">
                    <SignInComponent/>
                  </Route>
                  <Route path="/auth/register">
                    <RegisterComponent/>
                  </Route>
                  <Route path="/auth/reset">
                    <ResetComponent/>
                  </Route>
                  <Route>
                    <NotFound404Component/>
                  </Route>
                </Switch>
              </Suspense>
            </Router>
          <Footer />
        </FirebaseUserContext.Provider>
      </>
    );
  }
}

export default App;

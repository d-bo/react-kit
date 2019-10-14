import firebase from "firebase/app";
import React, { Suspense } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { FirebaseUserContext } from "../../contexts/FirebaseUserContext";
import * as LazyComponents from "./LazyComponents";
import produce from "immer";
import { connect } from "react-redux";
import { hideSidebar, receiveNetworkStatus, networkStatusType } from "../../redux/actions";
import { IPropsGlobal } from "../shared/Interfaces";
import { LoadingRollingBlack } from "../shared/elements/Loader";
import { withToaster } from "../shared/hocs/toast-notes";


const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  handleHideSidebar: () => dispatch(hideSidebar()),
  receiveNetworkStatus: (networkStatus: networkStatusType) => {
    dispatch(receiveNetworkStatus(networkStatus));
  },
});

interface IAppProps extends IPropsGlobal {
  readonly history: any;
  readonly firebaseUser?: firebase.User | null;
  readonly handleHideSidebar?: any;
  readonly receiveNetworkStatus?: (networkStatus: networkStatusType) => {};
}

interface IAppState {
  firebaseUser: firebase.User | undefined | null;
  errors: string | null;
  loading: boolean;
  verifyLinkSent: boolean;
  photoURL: string | null;
  staticNavbar: boolean;   // <Navbar> toggler
}

interface IAppProto {
  contextSetFirebaseUser(firebaseUser: firebase.User | null): void;
  contextSetPhotoURL(url: string | null): void;
  contextShowStaticNavbar(show: boolean): void;
}

export class MainApp
extends React.Component<IAppProps, IAppState>
implements IAppProto {

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      errors: null,
      firebaseUser: this.props.firebaseUser,
      loading: false,
      photoURL: null,
      staticNavbar: true,
      verifyLinkSent: false,
    };
    this.contextSetFirebaseUser = this.contextSetFirebaseUser.bind(this);
    this.contextSetPhotoURL = this.contextSetPhotoURL.bind(this);
    this.contextShowStaticNavbar = this.contextShowStaticNavbar.bind(this);
    this.onRouterUpdate = this.onRouterUpdate.bind(this);
  }

  // Dynamically set user from child components
  // Setting null as a logout
  public contextSetFirebaseUser(firebaseUser: firebase.User | null): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.firebaseUser = firebaseUser;
      }),
    );
    if (firebaseUser) {
      this.contextSetPhotoURL(firebaseUser.photoURL);
    }
  }

  // Set main photo url
  public contextSetPhotoURL(url: string | null) {
    this.setState(
      produce(this.state, (draft) => {
        draft.photoURL = url;
      }),
    );
  }

  // Toggle <Navbar/> component
  public contextShowStaticNavbar(show: boolean) {
    this.setState(
      produce(this.state, (draft) => {
        draft.staticNavbar = show;
      }),
    );
  }

  public componentDidMount() {
    const {receiveNetworkStatus, firebaseUser} = this.props;

    window.addEventListener("online", () => {
      if (receiveNetworkStatus) {
        receiveNetworkStatus("online");
      }
    });

    window.addEventListener("offline", () => {
      if (receiveNetworkStatus) {
        receiveNetworkStatus("offline");
      }
    });

    const offlineStatus = navigator.onLine ? "online" : "offline";
    if (this.props.networkStatus !== offlineStatus) {
      if (receiveNetworkStatus) {
        receiveNetworkStatus(offlineStatus);
      }
    }

    // Set user photo on load
    if (firebaseUser) {
      this.contextSetPhotoURL(firebaseUser.photoURL);
    }
  }

  componentWillUnmount() {
    // Remove event listeners
    window.removeEventListener("online", () => {
      if (receiveNetworkStatus) {
        receiveNetworkStatus("online");
      }
    });
    window.removeEventListener("offline", () => {
      if (receiveNetworkStatus) {
        receiveNetworkStatus("offline");
      }
    });
  }

  public componentDidUpdate() {
    const offlineStatus = navigator.onLine ? "online" : "offline";
    if (this.props.networkStatus !== offlineStatus) {
      receiveNetworkStatus(offlineStatus);
    }
  }

  public onRouterUpdate() {
    return (
      <div style={{textAlign: "center"}}>
        <div style={{display: "inline-block"}}>
          <div className="flex-vertical-center">
            <LoadingRollingBlack className="home-loader animated fadeInDown" />
          </div>
        </div>
      </div>);
  }

  public render() {
    const {history} = this.props;
    const {firebaseUser, photoURL, staticNavbar} = this.state;
    return (
      <>
        <FirebaseUserContext.Provider value={{
          contextSetFirebaseUser: this.contextSetFirebaseUser,
          contextSetPhotoURL: this.contextSetPhotoURL,
          contextShowStaticNavbar: this.contextShowStaticNavbar,
          firebaseUser,
          photoURL,
          staticNavbar,
        }}>
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

export default withToaster(connect(mapStateToProps, mapDispatchToProps)(MainApp));

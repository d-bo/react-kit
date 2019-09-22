import "./style.scss";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import React from "react";
import DmButton from "../shared/elements/DmButton";
import { Router } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FirebaseUserContext } from "../../contexts/FirebaseUserContext";
import {
  FaBars, FaFastBackward,
  FaPlay, FaFastForward,
} from "react-icons/fa";
import Sidebar from "../shared/widgets/Sidebar";
import { toggleSidebar, setProfileImgUrl, networkStatusType } from "../../redux/actions";
import firebase from "firebase/app";
import produce from "immer";
import { MdSignalWifiOff } from "react-icons/md";
import { IPropsGlobal } from "../shared/Interfaces";

const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => {
  return {
    handleToggleSidebar: (e: MouseEvent) => dispatch(toggleSidebar()),
    setProfileImgUrl: (imgUrl: string) => dispatch(setProfileImgUrl(imgUrl)),
  };
};

interface INavbarProps extends IPropsGlobal {
  profileImgUrl?: string | null;
  setProfileImgUrl?: any;
  sidebar?: boolean;
  handleToggleSidebar?: any;
}

interface INavbarState {
  errors: string | null;
  loading: boolean;
  loadingExit: boolean;
  verifyLinkSent: boolean;
}

interface INavbarProto {
  handleLogOut(): void;
  redirectProfile(): void;
}

class Navbar
extends React.PureComponent<INavbarProps, INavbarState>
implements INavbarProto {

  constructor(props: INavbarProps) {
    super(props);
    this.state = {
      errors: null,
      loading: false,
      loadingExit: false,
      verifyLinkSent: false,
    };
    this.redirectProfile = this.redirectProfile.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  public handleLogOut(): void {
    const self = this;
    const {setProfileImgUrl, history} = this.props;
    const {contextSetFirebaseUser} = this.context;
    self.setState(
      produce(self.state, (draft) => {
        draft.loadingExit = true;
      }),
    );
    firebase.auth().signOut().then(() => {
      contextSetFirebaseUser(null);
      self.setState(
        produce(self.state, (draft) => {
          draft.loadingExit = false;
        }),
      );
      localStorage.removeItem("localAppCurrentUserID");
      setProfileImgUrl(null);
      history.push("/auth/signin");
    }).catch((error) => {
      const errorMessage = error.message;
      self.setState(
        produce(self.state, (draft) => {
          draft.errors = errorMessage;
          draft.loadingExit = false;
        }),
      );
    });
  }

  public render() {
    const {
      history,
      handleToggleSidebar,
      sidebar,
      networkStatus,
    } = this.props;
    const {firebaseUser, photoURL} = this.context;
    const {loading} = this.state;
    return (
      <header>
        <nav>
          <div className="navbar-body soft-left-bottom-shadow fade-in-fx">
            <div className="container-fluid navbar">
              <div className="row">

                <div id="navbar-sidebar-button" className="fade-in-fx">
                  {// Show network disconnect status
                    networkStatus &&
                    <div style={{paddingRight: "30px", display: "inline-block", color: "#c0c0c0"}}>
                      {networkStatus === "offline" &&
                        <MdSignalWifiOff/>
                      }
                    </div>
                  }
                  <FaBars style={{cursor: "pointer"}} onClick={handleToggleSidebar} />
                </div>

                <div id="navbar-bottom-menu" className="soft-left-top-shadow">
                  <table style={{width: "100%"}}>
                    <tbody>
                      <tr>
                        <td><FaFastBackward/></td>
                        <td><FaFastForward/></td>
                        <td><FaPlay/></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <Sidebar history={history}
                  onClick={handleToggleSidebar}
                  sidebarStatus={sidebar}
                  firebaseUser={firebaseUser}
                  logOut={this.handleLogOut} />

                <div className="col-sm-4 navbar-mobile-disabled">
                  {!firebaseUser &&
                    <table style={{width: "100%"}}>
                      <tbody><tr>
                        <td style={{width: "50%"}}>
                        <DmButton text="REGISTER"
                            onClick={() => history.push("/auth/register")}
                            style={{padding: "7px 0"}} />
                        </td>
                        <td style={{width: "50%"}}></td>
                      </tr></tbody>
                    </table>
                  }
                </div>

                <div className="col-sm-4">
                  <div style={{textAlign: "center"}}>
                    <Router history={history}>
                      <Link to="/"><img src="/favicons/apple-touch-icon.png"
                        alt="" className="img-navbar" />
                      </Link>
                    </Router>
                  </div>
                </div>

                <div className="col-sm-4 navbar-user">
                  <div id="navbar-media-query">

                  {firebaseUser &&
                    <div style={{textAlign: "right"}}>
                      <span onClick={this.redirectProfile} style={{cursor: "pointer"}}>
                      {firebaseUser.displayName &&
                        <b>{firebaseUser.displayName}</b>
                      }
                      {(firebaseUser.email && !firebaseUser.displayName) &&
                        <b>{firebaseUser.email}</b>
                      }

                      {photoURL &&
                        <LazyLoadImage
                          src={photoURL}
                          placeholderSrc="/img/no-image-slide.png"
                          effect="blur" className="img-navbar" />
                      }

                      {!photoURL &&
                        <LazyLoadImage
                          src="/img/no-user.png"
                          placeholderSrc="/img/no-image-slide.png"
                          effect="blur" className="img-navbar" />
                      }
                      </span>
                    </div>
                  }
                  {!firebaseUser &&
                    <table style={{width: "100%"}}>
                      <tbody><tr>
                        <td style={{width: "50%"}}>
                          {// Show network disconnect status
                            networkStatus &&
                            <div style={{
                              color: "#c0c0c0",
                              display: "inline-block",
                              paddingRight: "30px",
                            }}>
                            {networkStatus === "offline" &&
                              <MdSignalWifiOff/>
                            }
                            </div>
                          }
                        </td>
                        <td style={{width: "50%"}}>
                          <DmButton text="SIGN IN" loading={loading}
                            onClick={() => history.push("/profile")}
                            theme="outlined" />
                        </td>
                      </tr></tbody>
                    </table>
                  }
                  </div>
                </div>

              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  public redirectProfile(): void {
    const {history: {push}} = this.props;
    push("/profile");
  }
}

Navbar.contextType = FirebaseUserContext;

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

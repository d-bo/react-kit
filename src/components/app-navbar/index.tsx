import "./style.scss";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import DmButton from "../shared/elements/DmButton";
import { Router } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FirebaseUserContext } from "../../contexts/FirebaseUserContext";
import {
  FaBars, FaFastBackward,
  FaPlay, FaFastForward,
} from "react-icons/fa";
import produce from "immer";
import Sidebar from "../shared/widgets/Sidebar";

const mapStateToProps = (state: any) => state.firebaseAuth;

interface INavbarProps {
  history?: any;
  profileImgUrl?: string | null;
}

interface INavbarState {
  loading: boolean;
  loadingExit: boolean;
  sidebar: boolean;
  verifyLinkSent: boolean;
}

class Navbar extends React.PureComponent<INavbarProps, INavbarState> {

  constructor(props: INavbarProps) {
    super(props);
    this.state = {
      loading: false,
      loadingExit: false,
      sidebar: false,
      verifyLinkSent: false,
    };
    this.redirectProfile = this.redirectProfile.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  public toggleSidebar(): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.sidebar = draft.sidebar ? false : true;
      }),
    );
  }

  public hideSidebar(): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.sidebar = false;
      }),
    );
  }

  public render() {
    const {history, profileImgUrl} = this.props;
    const {firebaseUser} = this.context;
    const {loading, sidebar} = this.state;
    return (
      <div className="navbar-body soft-left-bottom-shadow fade-in-fx">
        <div className="container-fluid navbar">
          <div className="row">

            <div id="navbar-sidebar-button" className="fade-in-fx">
              <FaBars style={{cursor: "pointer"}} onClick={this.toggleSidebar} />
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

            <Sidebar history={history} onClick={this.toggleSidebar} sidebar={sidebar} />

            <div className="col-sm-4"></div>

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

                  {firebaseUser.hasOwnProperty("photoURL") &&
                    <>

                    {(firebaseUser.photoURL && profileImgUrl) &&
                      <>
                        <LazyLoadImage
                          src={firebaseUser.photoURL}
                          placeholderSrc="/no-image-slide.png"
                          effect="blur"
                          className="img-navbar" />
                      </>
                    }

                    {(firebaseUser.photoURL && !profileImgUrl) &&
                      <>
                        <LazyLoadImage
                          src={firebaseUser.photoURL}
                          placeholderSrc="/no-image-slide.png"
                          effect="blur"
                          className="img-navbar" />
                      </>
                    }

                    {(!firebaseUser.photoURL && profileImgUrl) &&
                      <>
                        <img className="img-navbar" src={profileImgUrl}
                        alt="" />
                      </>
                    }

                    {(!firebaseUser.photoURL && !profileImgUrl) &&
                      <>
                        <LazyLoadImage
                          src="/no-user.png"
                          placeholderSrc="/no-image-slide.png"
                          effect="blur"
                          className="img-navbar" />
                      </>
                    }
                    </>
                  }
                  </span>
                </div>
              }
              {!firebaseUser &&
                <table style={{width: "100%"}}>
                  <tbody><tr>
                    <td style={{width: "50%"}}></td>
                    <td style={{width: "50%"}}>
                      <DmButton text="SIGN IN" loading={loading}
                        onClick={() => this.props.history.push("/profile")}
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
    );
  }

  private redirectProfile(): void {
    this.props.history.push("/profile");
  }
}

Navbar.contextType = FirebaseUserContext;

export default connect(mapStateToProps)(Navbar);

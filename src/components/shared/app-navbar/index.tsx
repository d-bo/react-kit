import "./style.scss";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import DmButton from "../DmButton";
import { Router } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FirebaseUserContext } from "../../../contexts/FirebaseUserContext";


const mapStateToProps = (state: any) => state.firebaseAuth;

interface INavbarProps {
  history?: any;
  profileImgUrl?: string;
};

interface INavbarState {
  loading: boolean;
  loadingExit: boolean;
  verifyLinkSent: boolean;
};


class Navbar extends React.Component<INavbarProps, INavbarState> {

  constructor(props: INavbarProps) {
    super(props);
    this.state = {
      loading: false,
      loadingExit: false,
      verifyLinkSent: false,
    };
    this.redirectProfile = this.redirectProfile.bind(this);
  }

  private redirectProfile() {
    this.props.history.push("/profile");
  }

  public render() {

    const {history, profileImgUrl} = this.props;
    const firebaseUser = this.context;
    const {loading} = this.state;

    // fix profileImgUrl === undefined
    if (typeof profileImgUrl === "undefined") {
      const profileImgUrl = "";
    }

    return (
      <div className="navbar-body" style={{marginBottom: "14px"}}>
        <div className="container navbar">
          <div className="row">

            <div className="col-sm-4">
              <div>
                <Router history={history}>
                  <Link to="/"><img src="/logo.png" 
                    alt="" className="img-navbar" />
                  </Link>
                </Router>
              </div>
            </div>

            <div className="col-sm-4"></div>

            <div className="col-sm-4 navbar-user">
              {firebaseUser &&
                <div style={{textAlign: "right"}}>
                  <span onClick={this.redirectProfile} style={{cursor: "pointer"}}>
                  {firebaseUser.displayName &&
                    <b>{firebaseUser.displayName}</b>
                  }
                  {(firebaseUser.email && !firebaseUser.displayName) &&
                    <b>{firebaseUser.email}</b>
                  }

                  {firebaseUser.hasOwnProperty('photoURL') &&
                    <>

                    {firebaseUser.photoURL && profileImgUrl === "" &&
                      <>
                        <LazyLoadImage
                          src={firebaseUser.photoURL}
                          placeholderSrc="/no-image-slide.png"
                          effect="blur"
                          className="img-navbar" />
                      </>
                    }

                    {firebaseUser.photoURL && profileImgUrl !== "" &&
                      <>
                        <LazyLoadImage
                          src={profileImgUrl}
                          placeholderSrc="/no-image-slide.png"
                          effect="blur"
                          className="img-navbar" />
                      </>
                    }

                    {!firebaseUser.photoURL && profileImgUrl === "" &&
                      <>
                        <img className="img-navbar" src="/no-user.png"
                        alt="" />
                      </>
                    }

                    {!firebaseUser.photoURL && profileImgUrl !== "" &&
                      <>
                        <LazyLoadImage
                          src={profileImgUrl}
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
                      icon="" theme="border-small" />
                    </td>
                  </tr></tbody>
                </table>
              }
            </div>

          </div>
        </div>
      </div>
    );
  }
}

Navbar.contextType = FirebaseUserContext;

export default connect(mapStateToProps)(Navbar);

import React from "react";
import "./style.scss";
import { FaRegWindowClose } from "react-icons/fa";
import { Router } from "react-router-dom";
import { Link } from "react-router-dom";
import { IPropsGlobal } from "../../Interfaces";

interface ISidebar extends IPropsGlobal {
  sidebarStatus?: boolean;
  onClick?: () => void;
  logOut: () => void;
  firebaseUser: any;
}

const Sidebar = (props: ISidebar) => {
  const {sidebarStatus, history, onClick, firebaseUser, logOut} = props;
  return (
    <>
    <div id="navbar-curtains"
      className={`${sidebarStatus ? "sidebar-opened" : "sidebar-closed"}`}
      onClick={onClick} />
    <div id="navbar-sidebar" onClick={onClick}
      className={`animated slideInDown soft-left-top-shadow ${sidebarStatus ? "sidebar-opened" : "sidebar-closed"}`}>
      <div className="navbar-sidebar-body">
        <nav>
          <Router history={history}>
            <Link to="/">
              <h3>Home</h3>
            </Link>
            <hr/>
            {firebaseUser &&
              <>
                <p></p>
                <Link to="/profile">
                  <h3>Profile</h3>
                </Link>
              </>
            }
            {!firebaseUser &&
              <>
                <p></p>
                <Link to="/auth/signin">
                  <h3>Signin</h3>
                </Link>
              </>
            }
            {!firebaseUser &&
              <>
                <p></p>
                <Link to="/auth/register">
                  <h3>Register</h3>
                </Link>
              </>
            }
            {firebaseUser &&
              <>
                <p></p>
                <h3 onClick={logOut} style={{cursor: "pointer"}}>Exit</h3>
              </>
            }
            <p></p>
          </Router>
        </nav>
      </div>
    </div>
    </>
  );
};

export default Sidebar;

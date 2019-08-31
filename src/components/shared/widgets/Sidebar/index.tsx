import React from "react";
import "./style.scss";
import { FaRegWindowClose } from "react-icons/fa";
import { Router } from "react-router-dom";
import { Link } from "react-router-dom";

const Sidebar = (props: any) => {
  const {sidebar, history, onClick} = props;
  return (
    <div id="navbar-sidebar"
      className={`soft-left-top-shadow ${sidebar ? "sidebar-opened" : "sidebar-closed"}`}>
      <p className="navbar-sidebar-close-btn">
        <FaRegWindowClose style={{cursor: "pointer"}} onClick={onClick} />
      </p>
      <div style={{textAlign: "center", width: "280px"}}>
      <Router history={history}>
        <Link to="/">
          <h3>Home</h3>
        </Link>
        <p></p>
        <Link to="/profile">
          <h3>Profile</h3>
        </Link>
        <p></p>
        <Link to="/auth/signin">
          <h3>Signin</h3>
        </Link>
        <p></p>
        <Link to="/signin">
          <h3>Register</h3>
        </Link>
        <p></p>
      </Router>
      </div>
    </div>
  );
};

export default Sidebar;

import "./style.scss";
import React from "react";

const Footer: React.SFC = () =>
  <footer>
    <div className="footer">
      <div className="container-fluid fade-in-fx">
        <div className="row">
          <div className="col-sm-4">
            <p>Links</p>
            <p>Guide to handbook</p>
            <p>Drafts</p>
          </div>
          <div className="col-sm-4">
            <p>Center</p>
            <p>Middle link</p>
            <p>Drafts</p>
          </div>
          <div className="col-sm-4">
            <p>Whats behind the forest</p>
            <p>Transcriptions</p>
          </div>
        </div>
      </div>
    </div>
  </footer>;

export default Footer;

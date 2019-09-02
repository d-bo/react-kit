import React from "react";
import Footer from "../app-footer";

const NotFound404: React.SFC = () => (
  <>
    <div style={{textAlign: "center"}}
      className="container-fluid fade-in-fx body-page-color">
      <div className="vertical-center">
          <h1>Page not found</h1>
      </div>
    </div>
    <Footer />
  </>
);

export default NotFound404;

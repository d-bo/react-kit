import React from "react";
import "./style.scss";

const ReCaptchav2 = (props: any) => {
  const containerId = "recaptcha-container";
  if (props.hasOwnProperty("setRef")) {
    props.setRef(containerId);
  }
  return (
    <>
      <div className="recaptcha-block text-center">
        <div style={{display: "inline-block"}} id={containerId}></div>
      </div>
    </>
  );
};

export default ReCaptchav2;

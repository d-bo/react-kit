import React from "react";

const ReCaptchav2 = (props: any) => {
  const containerId = "recaptcha-container";
  // TODO: extend other components (withFirebaseAuth)
  if (props.hasOwnProperty("setRef")) {
    props.setRef(containerId);
  }
  return (
    <>
      <p></p>
      <div className="text-center">
        <div style={{display: "inline-block"}} id={containerId}></div>
      </div>
    </>
  );
};

export default ReCaptchav2;

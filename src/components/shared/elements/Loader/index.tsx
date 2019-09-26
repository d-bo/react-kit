// eslint-disable-next-line
import React from "react";

export const LoadingFacebookBlack = (props: any) => {
  return (
    <div style={{textAlign: "center"}} className={`${props.className && props.className}`}>
      <img src="/img/loading-facebook-black.gif" alt="" />
    </div>
  );
};

export const LoadingRollingBlack = (props: any) => {
  return (
    <div style={{textAlign: "center"}} className={`${props.className && props.className}`}>
      <img src="/img/loading-rolling-black.gif" alt="" />
    </div>
  );
};

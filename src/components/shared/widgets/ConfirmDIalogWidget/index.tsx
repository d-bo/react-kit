import React from "react";
import DmButton from "../../../shared/elements/DmButton";
import { MdClear, MdDone } from "react-icons/md";
import "./style.scss";

export const ConfirmDialogWidget = (props: any) => {
  return (
    <div>
      <div className="confirm-dialog-widget__text">
        {props.text}
      </div>
      <div className="profile-flex">
        <div className="profile-flex-child">
          <DmButton
            icon={<MdDone style={{fontSize: "32px"}} />}
            disabled={props.disabled}
            className="dm-button-margin-top button-grey"
            onClick={props.onProceed} />
        </div>
        <div className="profile-flex-child">
          <DmButton
            icon={<MdClear style={{fontSize: "32px"}} />}
            disabled={props.disabled}
            className="dm-button-margin-top button-grey"
            onClick={props.onCancel} />
        </div>
      </div>
    </div>
  );
};

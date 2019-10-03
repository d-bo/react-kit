import React from "react";
import "./style.scss";
import { IPropsGlobal } from "../../Interfaces";

interface IDMButtonProps extends IPropsGlobal {
  disabled?: boolean;
  theme?: string;
  onClick?: any;
  className?: string;
  onKeyPress?: any;
  style?: any;
  text?: undefined | React.ReactElement | string;
  icon?: any;
  loading?: boolean;
}

const DmButton = (props: IDMButtonProps) =>
  <>
    {!props.theme &&
      <div className={`dm-button round-border-5px ${props.disabled ? "button-disabled" : ""}
        ${props.className}`} onClick={props.disabled ? null : props.onClick}
        onKeyPress={props.onKeyPress} style={props.style && props.style}>

      {props.icon &&
        <span className="dm-button__icon">{props.icon}</span>
      }

      {props.text &&
        <span className={props.icon && "dm-button-text__margin"}>
          {props.loading ? <img src="/img/loading-button.gif" alt="" /> : props.text}
        </span>
      }

      </div>
    }
  </>;

export default DmButton;

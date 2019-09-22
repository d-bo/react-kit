import React from "react";
import "./style.scss";
import { IPropsGlobal } from "../../Interfaces";

const Outlined: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #555",
  color: "#333",
  padding: "7px 0",
};

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
    {props.theme === "outlined" &&

      <div className={`dm-button round-border-5px ${props.className}
        ${props.disabled ? "button-disabled" : ""}`}
        onClick={props.disabled ? null : props.onClick} onKeyPress={props.onKeyPress}
        style={{...props.style, ...Outlined}}>

      {props.icon &&
        <span style={props.text ? {marginRight: "7px"} : {}}>{props.icon}</span>
      }

      {props.loading ? <img src="/loading-button.gif" alt="" /> : props.text}

      </div>
    }

    {!props.theme &&
      <div className={`dm-button round-border-5px ${props.className}
        ${props.disabled ? "button-disabled" : ""}`}
        onClick={props.disabled ? null : props.onClick} onKeyPress={props.onKeyPress}
        style={props.style}>

      {props.icon &&
        <span style={props.text ? {marginRight: "7px"} : {}}>{props.icon}</span>
      }

      {props.loading ? <img src="/loading-button.gif" alt="" /> : props.text}

      </div>
    }
  </>;

export default DmButton;

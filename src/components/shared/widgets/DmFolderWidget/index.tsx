import React from "react";
import "./style.scss";

interface IWidgetProps {
  style?: any;
  className?: any;
  icon?: any;
  title?: any;
  titleIcon?: any;
  children?: any;
  desc?: any;
  shadow?: string;
}

const DmFolderWidget = (props: IWidgetProps) =>
  <div id="dmfolder-widget" className={`nice-border shadow-right-bottom
   margin-top-10 ${props.shadow} ${props.className}`} style={props.style}>
    <div className="folder-center">
      {props.title &&
        <div className="folder-right round-border-5px-only-top">
          {props.titleIcon &&
            <span>{props.titleIcon} </span>
          }
          <b>{props.title}</b>
        </div>
      }
    </div>

    <div className="login-body">
      {props.desc &&
        <div style={{fontSize: "10px", textAlign: "left", marginBottom: "10px"}}>{props.desc}</div>
      }
      <div>
        {props.children}
      </div>
    </div>
  </div>;

export default DmFolderWidget;

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
  <div className={`dmfolder-widget nice-border shadow-right-bottom
   margin-top-10 ${props.shadow} ${props.className}`} style={props.style}>
    <div className="dmfolder-widget-folder__text">
      {props.title &&
        <div className="folder-right round-border-5px-only-top">
          {props.titleIcon &&
            <span>{props.titleIcon}&nbsp;</span>
          }
          <b>{props.title}</b>
        </div>
      }
    </div>

    <div className="dmfolder-widget__outline round-border-5px-right">
      {props.desc &&
        <div style={{fontSize: "10px", textAlign: "left", marginBottom: "10px"}}>{props.desc}</div>
      }
      <div className="dmfolder-widget__body">
        {props.children}
      </div>
    </div>
  </div>;

export default DmFolderWidget;

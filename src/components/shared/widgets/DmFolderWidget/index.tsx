import React from 'react';

interface WidgetProps {
  style?: any;
  className?: any;
  icon?: any;
  title?: any;
  children?: any;
  desc?: any;
  shadow?: string;
};


const DmFolderWidget = (props: WidgetProps) => 
  <div className={`nice-border shadow-right-bottom ${props.className} 
    margin-top-10 ${props.shadow}`} style={props.style}>
    <div className="folder-center">
      {props.title &&
        <div className="folder-right round-border-5px-only-top">
          {props.icon &&
            <span>{props.icon}</span>
          }
          <b>{props.title}</b>
        </div>
      }
    </div>

    <div className="login-body round-border-5px-except-right-top">
      {props.desc &&
        <div style={{fontSize: "10px", textAlign: "left", marginBottom: "10px"}}>{props.desc}</div>
      }
      <div>
        {props.children}
      </div>
    </div>
  </div>;

export default DmFolderWidget;

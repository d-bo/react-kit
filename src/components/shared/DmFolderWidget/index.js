import React from 'react';

const DmFolderWidget = props => 
	<div className={`shadow-right-bottom ${props.className}`} style={props.style}>
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

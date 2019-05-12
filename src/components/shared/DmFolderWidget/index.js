import React from 'react';

const DmFolderWidget = props => 
	<div className={`${props.className}`}>
	  <div className="folder-center">
	    <div className="folder-right round-border-5px-only-top">
	    	{props.icon &&
	    		<span>{props.icon}</span>
	    	}
	    	<b>{props.title}</b>
	    </div>
	  </div>

	  <div className="login-body round-border-5px-except-right-top">
	    <div>
				{props.children}
	    </div>
	  </div>
  </div>;

export default DmFolderWidget;

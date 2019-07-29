import React from 'react';

const ProductCardWidget = (props: any) => 
	<div className={`s${props.className}`} style={props.style}>
	  <div>
	  	{props.title &&
		    <div>
		    	{props.icon &&
		    		<span>{props.icon}</span>
		    	}
		    	<b>{props.title}</b>
		    </div>
	  	}
	  </div>

	  <div>
	    {props.desc &&
	    	<div style={{fontSize: "10px", textAlign: "left", marginBottom: "10px"}}>{props.desc}</div>
	    }
	    <div>
				{props.children}
	    </div>
	  </div>
  </div>;

export default ProductCardWidget;

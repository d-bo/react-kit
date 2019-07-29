import './style.scss';
import React from 'react';

const Footer = (props: any) => 
	<>
		<div className="footer">
      <div className="container fade-in-fx">
        <div className="row">
          <div className="col-sm-4">
						Note:  In most cases you should never force a React component to 
						re-render; re-rendering should always be done based on state or 
						props changes.  Nonetheless, I don't judge and there may be a case 
						where you legitimately need to force a React component to re-render 
						so let's have it!
          </div>
          <div className="col-sm-4">
						This blog doesn't aim to be prescriptive, so I wont scold 
						developers for using this brute force method.  Again, there's 
						likely a better, more "React-y" way to render a component properly, 
						but if you are desperate to get a component render on command, 
						there are many ways to do so with React.
          </div>
          <div className="col-sm-4">Column 3</div>
        </div>
      </div>
    </div>
	</>

export default Footer;
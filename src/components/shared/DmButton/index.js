import React from 'react';
import './style.css';

const DmButton = props => 
		<>
			<div className={`dm-button round-border-5px ${props.className}`}  
				onClick={props.onClick} style={props.style}>
				{props.icon &&
					<span style={{marginRight: '7px'}}>{props.icon}</span>
				}
				{props.loading ? <img src="/loading-button.gif" alt="" /> : props.text}
			</div>
		</>;

export default DmButton;

import React from 'react';
import './style.css';

const BorderSmall = {
	padding: "7px 0",
	border: "1px solid #555",
	background: "transparent",
	color: "#333",
};

const DmButton = (props: any) => 
		<>
			{props.theme === "border-small" &&

				<div className={`dm-button round-border-5px ${props.className}`}
					onClick={props.onClick} onKeyPress={props.onKeyPress}
					style={{...props.style, ...BorderSmall}}>

				{props.icon &&
					<span style={props.text ? {marginRight: '7px'} : {}}>{props.icon}</span>
				}

				{props.loading ? <img src="/loading-button.gif" alt="" /> : props.text}
				
				</div>
			}

			{!props.theme &&
				<div className={`dm-button round-border-5px ${props.className}`}
					onClick={props.onClick} onKeyPress={props.onKeyPress} 
					style={props.style}>

				{props.icon &&
					<span style={props.text ? {marginRight: '7px'} : {}}>{props.icon}</span>
				}

				{props.loading ? <img src="/loading-button.gif" alt="" /> : props.text}

				</div>
			}
		</>;

export default DmButton;

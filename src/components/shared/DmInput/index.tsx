import React from 'react';
import { connect } from 'react-redux';
import './style.css';

const mapStateToProps = (state: any) => state;

interface DmInputProps {
	type: any;
	value: any;
	placeholder: any;
	onChange: any;
	className?: any;
	style?: any;
};

interface DmInputState {
	value: any;
};


class DmInput extends React.Component<DmInputProps, DmInputState> {
	constructor(props: DmInputProps) {
		super(props);
		this.state = {
			value: props.value
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e: any) {
		this.setState({
			value: e.target.value
		});
		this.props.onChange(e.target.value);
	}

	render() {
		return (
			<>
				<input type={this.props.type} onChange={this.handleChange}
					className={`dm-input round-border-5px ${this.props.className}`} 
					value={this.props.value || ""} placeholder={this.props.placeholder} 
					style={this.props.style} />
			</>
		);
	}
}

export default connect(mapStateToProps)(DmInput);

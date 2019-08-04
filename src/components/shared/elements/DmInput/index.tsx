import React from 'react';
import { connect } from 'react-redux';
import './style.css';

const mapStateToProps = (state: any) => state;

interface IDmInputProps {
  type: any;
  value: any;
  placeholder?: any;
  onChange?: any;
  className?: any;
  style?: any;
};

interface IDmInputState {
  value: string;
};


class DmInput extends React.Component<IDmInputProps, IDmInputState> {

  constructor(props: IDmInputProps) {
    super(props);
    this.state = {
      value: props.value
    };
    this.handleChange = this.handleChange.bind(this);
  }

  private handleChange(e: any) {
    this.setState({
      value: e.target.value
    });
    this.props.onChange(e.target.value);
  }

  public render() {

    const {value} = this.state;
    const {className, style, placeholder, type} = this.props;
    
    return (
      <>
        <input type={type} onChange={this.handleChange}
          className={`dm-input round-border-5px ${className}`} 
          value={value || ""} placeholder={placeholder} 
          style={style} />
      </>
    );
  }
}

export default connect(mapStateToProps)(DmInput);

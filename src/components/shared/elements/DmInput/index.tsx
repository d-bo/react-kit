import React from "react";
import { connect } from "react-redux";
import "./style.scss";
import produce from "immer";
import { IPropsGlobal } from "../../Interfaces";

const mapStateToProps = (state: any) => state;

interface IDmInputProps extends IPropsGlobal {
  type: any;
  value: any;
  placeholder?: any;
  onChange?: any;
  className?: any;
  style?: any;
}

interface IDmInputState {
  value: string;
}

interface IDmInputProto {
  handleChange(e: any): void;
}

class DmInput
extends React.PureComponent<IDmInputProps, IDmInputState>
implements IDmInputProto {

  constructor(props: IDmInputProps) {
    super(props);
    this.state = {
      value: props.value,
    };
    this.handleChange = this.handleChange.bind(this);
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

  public handleChange(e: any): void {
    this.setState(
      produce(this.state, (draft) => {
        draft.value = e.target.value;
      }),
    );
    this.props.onChange(e.target.value);
  }
}

export default connect(mapStateToProps)(DmInput);

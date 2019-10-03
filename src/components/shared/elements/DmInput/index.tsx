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
  onChange?: null | any;
  className?: any;
  style?: any;
  rightWidget?: any;
  maxlength?: number;
}

interface IDmInputState {
  value: string | null;
}

interface IDmInputProto {
  handleChange(e: any): void;
}

class DmInput
extends React.PureComponent<IDmInputProps, IDmInputState>
implements IDmInputProto {

  // Update state when props change
  public static getDerivedStateFromProps(props: any) {
    return {value: props.value};
  }

  constructor(props: IDmInputProps) {
    super(props);
    this.state = {
      value: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  public render() {
    const {value} = this.state;
    const {className, style, placeholder, type, rightWidget} = this.props;
    return (
      <div className={`dm-input-container round-border-5px ${className}`}>
        <div className="dm-input-flex__item">
          <input maxLength={this.props.maxlength ? this.props.maxlength : 100} type={type}
            onChange={this.handleChange} value={value || ""}
            placeholder={placeholder}
            style={style} className="dm-input round-border-5px-left" />
        </div>
        {typeof rightWidget !== "boolean" &&
          <div className="dm-input-checker round-border-5px-right">{rightWidget}</div>
        }
        {typeof rightWidget === "boolean" &&
          <div className={`dm-input-checker round-border-5px-right
            ${rightWidget ? "dm-input-checker__green" : "dm-input-checker__red"}`}></div>
        }
      </div>
    );
  }

  public handleChange(e: any): void {
    const {onChange} = this.props;
    this.setState(
      produce(this.state, (draft) => {
        draft.value = e.target.value;
      }),
    );
    if (onChange) {
      onChange(e.target.value);
    }

  }
}

export default connect(mapStateToProps)(DmInput);

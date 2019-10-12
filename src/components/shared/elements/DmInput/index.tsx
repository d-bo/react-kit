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
  rightWidget?: any;
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
    const {className, style, placeholder, type, rightWidget} = this.props;
    return (
      <div className={`dm-input-container round-border-5px ${className}`}>
        <input type={type} onChange={this.handleChange}
          value={value || ""} placeholder={placeholder}
          style={style} className="dm-input round-border-5px" />
          {rightWidget === null && typeof rightWidget === "object" &&
            <div className="dm-input-checker round-border-5px-right"></div>
          }
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
    this.setState(
      produce(this.state, (draft) => {
        draft.value = e.target.value;
      }),
    );
    this.props.onChange(e.target.value);
  }
}

export default connect(mapStateToProps)(DmInput);

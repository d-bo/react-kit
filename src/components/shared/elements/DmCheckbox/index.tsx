import React from "react";

class DmCheckbox extends React.Component {

  constructor(props: any) {
    super(props);
  }

  public render() {
    return(
      <>
        <input type="checkbox" className="dm-checkbox" />
      </>
    );
  }
}

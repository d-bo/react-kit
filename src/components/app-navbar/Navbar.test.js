import React from "react";
import {shallow} from "enzyme";
import Navbar from "./index";

describe("Navbar", () => {
  it("Navbar should appear", () => {
    const component = shallow(<Navbar debug />);
    expect(component).toMatchSnapshot();
  });
});

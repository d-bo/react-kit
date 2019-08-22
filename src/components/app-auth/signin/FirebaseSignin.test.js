/* eslint-disable */
import React from "react";
import {shallow} from "enzyme";
import SignIn from "./index";

describe("Reset is rendering", () => {
  it("Signin component is rendering", () => {
    const wrapper = shallow(<SignIn />);
    expect(wrapper).toExist();
  });
});

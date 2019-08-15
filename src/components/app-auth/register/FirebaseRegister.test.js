/* eslint-disable */
import React from "react";
import {shallow} from "enzyme";
import Register from "./index";

describe("Register is rendering", () => {
  it("Register is rendering", () => {
    const wrapper = shallow(<Register />);
    expect(wrapper).toExist();
  });
});

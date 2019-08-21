/* eslint-disable */
import React from "react";
import {shallow} from "enzyme";
import Reset from "./index";

describe("Reset is rendering", () => {
  it("Reset is rendering", () => {
    const wrapper = shallow(<Reset />);
    expect(wrapper).toExist();
  });
});

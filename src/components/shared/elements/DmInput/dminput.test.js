/* eslint-disable */
import React from "react";
import { shallow } from "enzyme";
import DmInput from "./index";

describe("DmInput is rendering", () => {
  it("DmInput is rendering", () => {
    const wrapper = shallow(<DmInput />);
    expect(wrapper).toExist();
  });
});

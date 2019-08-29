/* eslint-disable */
import React from "react";
import {shallow} from "enzyme";
import DmButton from "./index";

describe("Register is rendering", () => {
  it("DmButton is rendering", () => {
    const wrapper = shallow(<DmButton />);
    expect(wrapper).toExist();
  });
});

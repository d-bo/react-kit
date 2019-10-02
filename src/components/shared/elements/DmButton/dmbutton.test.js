/* eslint-disable */
import React from "react";
import { shallow } from "enzyme";
import DmButton from "./index";

describe("DmButton is rendering", () => {
  it("DmButton is rendering", () => {
    const wrapper = shallow(<DmButton icon={"Icon"} text="Unit-test text" />);
    expect(wrapper).toExist();
    expect(wrapper.find(".dm-button")).toHaveLength(1);
    expect(wrapper.find(".dm-button__icon")).toHaveLength(1);
    expect(wrapper.find(".dm-button__text")).toHaveLength(1);
  });
});

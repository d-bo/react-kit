/* eslint-disable */
import React from "react";
import {shallow} from "enzyme";
import {LoadingFacebookBlack, LoadingRollingBlack} from "./index";

describe("Register is rendering", () => {
  it("LoadingFacebookBlack is rendering", () => {
    const wrapper = shallow(<LoadingFacebookBlack />);
    expect(wrapper).toExist();
  });
  it("LoadingRollingBlack is rendering", () => {
    const wrapper = shallow(<LoadingRollingBlack />);
    expect(wrapper).toExist();
  });
});

/* eslint-disable */
import React from "react";
import {shallow} from "enzyme";
import ReCaptchav2 from "./index";

describe("Register is rendering", () => {
  it("ReCaptchav2 is rendering", () => {
    const wrapper = shallow(<ReCaptchav2 />);
    expect(wrapper).toExist();
  });
});

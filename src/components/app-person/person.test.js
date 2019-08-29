/* eslint-disable */
import React from "react";
import {shallow} from "enzyme";
import Person from "./index";

describe("Register is rendering", () => {
  it("Person is rendering", () => {
    const wrapper = shallow(<Person />);
    expect(wrapper).toExist();
  });
});

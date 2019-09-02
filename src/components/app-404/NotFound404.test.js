/* eslint-disable */
import React from "react";
import {shallow} from "enzyme";
import NotFound404 from ".";

describe("NotFound404 is rendering", () => {
  it("Navbar is rendering", () => {
    const wrapper = shallow(<NotFound404 />);
    expect(wrapper.find("h1").text()).toEqual("Page not found");
  });
});

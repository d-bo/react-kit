/* eslint-disable */
import React from "react";
import { shallow } from "enzyme";
import NotFound404 from ".";

describe("NotFound404 is rendering", () => {
  it("NotFound404 is rendering", () => {
    const wrapper = shallow(<NotFound404 />);
    expect(wrapper.find("h1").text()).toEqual("Page not found");
  });
});

/* eslint-disable */
import React from "react";
import {shallow, render} from "enzyme";
import Footer from "./index";

describe("<Footer> component is rendering", () => {
  it("Footer renders", () => {
    const wrapper = render(
        <Footer />
      );
    expect(wrapper.find(".col-sm-4")).toHaveLength(3);
  });
});

/* eslint-disable */
import React from "react";
import { shallow } from "enzyme";
import DmFolderWidget from "./index";

describe("DmFolderWidget is rendering", () => {
  it("DmFolderWidget is rendering", () => {
    const wrapper = shallow(<DmFolderWidget />);
    expect(wrapper).toExist();
    expect(wrapper.find("#dmfolder-widget")).toHaveLength(1);
    expect(wrapper.find(".login-body")).toHaveLength(1);
  });
});

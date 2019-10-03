/* eslint-disable */
import React from "react";
import { shallow } from "enzyme";
import DmFolderWidget from "./index";

describe("DmFolderWidget is rendering", () => {
  it("DmFolderWidget is rendering", () => {
    const wrapper = shallow(<DmFolderWidget title="Some title"/>);
    expect(wrapper).toExist();
    expect(wrapper.find(".dmfolder-widget")).toHaveLength(1);
    expect(wrapper.find(".dmfolder-widget__outline")).toHaveLength(1);
    expect(wrapper.find(".dmfolder-widget__body")).toHaveLength(1);
    expect(wrapper.find(".folder-right")).toHaveLength(1);
  });
});

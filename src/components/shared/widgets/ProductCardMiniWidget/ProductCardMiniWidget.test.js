/* eslint-disable */
import React from "react";
import { shallow } from "enzyme";
import ProductCardMiniWidget from "./index";

describe("ProductCardMiniWidget is rendering", () => {
  it("ProductCardMiniWidget is rendering", () => {
    const wrapper = shallow(<ProductCardMiniWidget />);
    expect(wrapper).toExist();
    expect(wrapper.find("section")).toHaveLength(1);
    expect(wrapper.find(".product-folder-center")).toHaveLength(1);
    expect(wrapper.find("#product-folder-widget")).toHaveLength(1);
    expect(wrapper.find(".flex-buttons-row")).toHaveLength(1);
    expect(wrapper.find(".flex-button-item")).toHaveLength(3);
  });
});

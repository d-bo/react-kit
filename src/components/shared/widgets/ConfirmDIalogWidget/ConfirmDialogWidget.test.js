/* eslint-disable */
import React from "react";
import { shallow } from "enzyme";
import { ConfirmDialogWidget } from "./index";
import DmButton from "../../../shared/elements/DmButton";

describe("ConfirmDialogWidget is rendering", () => {
  it("ConfirmDialogWidget is rendering", () => {
    const wrapper = shallow(<ConfirmDialogWidget />);
    expect(wrapper).toExist();
    expect(wrapper.find(DmButton)).toHaveLength(2);
    expect(wrapper.find(".profile-flex")).toHaveLength(1);
    expect(wrapper.find(".profile-flex-child")).toHaveLength(2);
  });
});

/* eslint-disable */
import React from "react";
import {shallow, render} from "enzyme";
import Sidebar from "./index";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

describe("<Sidebar> component", () => {
  it("Sidebar component renders", () => {
    const wrapper = render(
        <Sidebar history={history} />
      );
    expect(wrapper.find("#navbar-sidebar")).toBeDefined();
  });
});

/* eslint-disable */
import React from "react";
import { render } from "enzyme";
import Sidebar from "./index";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

describe("<Sidebar> component", () => {
  it("Sidebar component renders and have <h3>Home</h3> ...", () => {
    const wrapper = render(
        <Sidebar history={history} />
      );
    expect(wrapper.find("#navbar-sidebar")).toBeDefined();
    expect(wrapper.find("h3")).toHaveLength(3);
    expect(wrapper.find("h3").text()).toEqual("HomeSigninRegister");
  });
});

/* eslint-disable */
import React from "react";
import { mount } from "enzyme";
import Register from "./index";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { FirebaseUserContext } from "../../../contexts/FirebaseUserContext";
import { Provider } from "react-redux";
import store from "../../../redux/stores/store";
import DmFolderWidget from "../../shared/widgets/DmFolderWidget";
import DmInput from "../../shared/elements/DmInput";

const history = createBrowserHistory();

describe("Register is rendering", () => {
  it("Register component with Redux, Context, Router (not authenticated)", () => {
    const wrapper = mount(
      <Provider store={store}>
        <FirebaseUserContext.Provider value={{
          contextSetFirebaseUser: () => null,
          firebaseUser: null,
        }}>
        <Router history={history}><Register /></Router>
        </FirebaseUserContext.Provider>
      </Provider>
      );
    expect(wrapper.find(".row")).toHaveLength(2);
    expect(wrapper.find(DmFolderWidget)).toHaveLength(1);
    expect(wrapper.find(DmInput)).toHaveLength(4);
    expect(wrapper.find(".flex-space-between")).toHaveLength(1);
  });
});

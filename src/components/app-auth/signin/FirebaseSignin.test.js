/* eslint-disable */
import React from "react";
import { mount } from "enzyme";
import Signin from "./index";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { FirebaseUserContext } from "../../../contexts/FirebaseUserContext";
import { Provider } from "react-redux";
import store from "../../../redux/stores/store";
import DmFolderWidget from "../../shared/widgets/DmFolderWidget";

const history = createBrowserHistory();

describe("Signin is rendering", () => {
  it("Signin component with Redux, Context, Router (not authenticated)", () => {
    const wrapper = mount(
      <Provider store={store}>
        <FirebaseUserContext.Provider value={{
          contextSetFirebaseUser: () => null,
          firebaseUser: null,
        }}>
        <Router history={history}><Signin /></Router>
        </FirebaseUserContext.Provider>
      </Provider>
      );
    expect(wrapper.find(".row")).toHaveLength(2);
    expect(wrapper.find(DmFolderWidget)).toHaveLength(1);
  });
});

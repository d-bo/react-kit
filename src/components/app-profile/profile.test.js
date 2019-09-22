/* eslint-disable */
import React from "react";
import { mount } from "enzyme";
import Profile from "./index";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { FirebaseUserContext } from "../../contexts/FirebaseUserContext";
import { Provider } from "react-redux";
import store from "../../redux/stores/store";
import DmFolderWidget from "../shared/widgets/DmFolderWidget";

const history = createBrowserHistory();

describe("<Profile> component", () => {
  it("Profile component with Redux, Context, Router (not authenticated)", () => {
    const wrapper = mount(
      <Provider store={store}>
        <FirebaseUserContext.Provider value={{
          contextSetFirebaseUser: () => null,
          firebaseUser: null,
        }}>
        <Router history={history}><Profile history={history} /></Router>
        </FirebaseUserContext.Provider>
      </Provider>
      );
    expect(wrapper.find(".container-fluid")).toExist();
    expect(wrapper.find(DmFolderWidget)).toHaveLength(3);
  });
});

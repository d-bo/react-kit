/* eslint-disable */
import React from "react";
import {shallow, render} from "enzyme";
import Navbar from "./index";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { FirebaseUserContext } from "../../contexts/FirebaseUserContext";
import { Provider } from "react-redux";
import store from "../../redux/stores/store";

const history = createBrowserHistory();

describe("<Navbar> component", () => {
  it("Navbar component with Redux, Context, Router (not authenticated)", () => {
    const wrapper = render(
      <Provider store={store}>
        <FirebaseUserContext.Provider value={{
          contextSetFirebaseUser: () => null,
          firebaseUser: null,
        }}>
        <Router history={history}><Navbar history={history} /></Router>
        </FirebaseUserContext.Provider>
      </Provider>
      );
    expect(wrapper.find(".container-fluid")).toHaveLength(1);
    expect(wrapper.find("#navbar-sidebar-button")).toHaveLength(1);
  });
});

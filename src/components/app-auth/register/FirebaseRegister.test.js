/* eslint-disable */
import React from "react";
import {shallow, render} from "enzyme";
import Register from "./index";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { FirebaseUserContext } from "../../../contexts/FirebaseUserContext";
import { Provider } from "react-redux";
import store from "../../../redux/stores/store";

const history = createBrowserHistory();

describe("Register is rendering", () => {
  it("Register component with Redux, Context, Router (not authenticated)", () => {
    const wrapper = render(
      <Provider store={store}>
        <FirebaseUserContext.Provider value={{
          contextSetFirebaseUser: () => null,
          firebaseUser: null,
        }}>
        <Router history={history}><Register /></Router>
        </FirebaseUserContext.Provider>
      </Provider>
      );
    expect(wrapper.find(".container-fluid")).toHaveLength(1);
  });
});

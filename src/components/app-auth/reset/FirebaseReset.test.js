/* eslint-disable */
import React from "react";
import {shallow, render} from "enzyme";
import Reset from "./index";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { FirebaseUserContext } from "../../../contexts/FirebaseUserContext";
import { Provider } from "react-redux";
import store from "../../../redux/stores/store";

const history = createBrowserHistory();

describe("Reset is rendering", () => {
  it("Reset component with Redux, Context, Router (not authenticated)", () => {
    const wrapper = render(
      <Provider store={store}>
        <FirebaseUserContext.Provider value={{
          contextSetFirebaseUser: () => null,
          firebaseUser: null,
        }}>
        <Router history={history}><Reset /></Router>
        </FirebaseUserContext.Provider>
      </Provider>
      );
    expect(wrapper.find(".container-fluid")).toHaveLength(1);
  });
});

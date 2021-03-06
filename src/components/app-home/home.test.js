/* eslint-disable */
import React from "react";
import { render } from "enzyme";
import Home from "./index";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { FirebaseUserContext } from "../../contexts/FirebaseUserContext";
import { Provider } from "react-redux";
import store from "../../redux/stores/store";

const history = createBrowserHistory();

describe("Home is rendering", () => {
  it("Home component with Redux, Context, Router (not authenticated)", () => {
    const wrapper = render(
      <Provider store={store}>
        <FirebaseUserContext.Provider value={{
          contextSetFirebaseUser: () => null,
          firebaseUser: null,
        }}>
        <Router history={history}><Home /></Router>
        </FirebaseUserContext.Provider>
      </Provider>
      );
    // Main block + <Footer/>
    expect(wrapper.find(".container-fluid")).toHaveLength(2);
  });
});

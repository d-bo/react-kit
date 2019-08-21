/* eslint-disable */
import firebase from "firebase/app";
import "./index.scss";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import React from "react";
import ReactDOM from "react-dom";
import store from "./redux/stores/store";
import App from "./components/app";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import * as serviceWorker from "./serviceWorker";
import firebase_config from "./config/firebase.config";

serviceWorker.register();

// Init firebase account
firebase.initializeApp(firebase_config);

// Firebase auth email + some widgets i18n
firebase.auth().languageCode = (navigator.languages &&
  navigator.languages.length) ? navigator.languages[0] : navigator.language;

// Router history
const history = createBrowserHistory();

// Render app when user acquired
firebase.auth().onAuthStateChanged((firebaseUser) => {
  // Multi-user local storage support
  if (firebaseUser && firebaseUser.hasOwnProperty("uid")) {
    localStorage.setItem("localAppCurrentUserID", firebaseUser.uid);
  }
  ReactDOM.render(
    <Provider store={store}>
      <App history={history} firebaseUser={firebaseUser} />
    </Provider>
    , document.getElementById("root"));
});

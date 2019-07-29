import * as firebase from "firebase/app";
import "./index.scss";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import React from "react";
import ReactDOM from "react-dom";
import store from "./redux/store";
import App from "./components/app";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import * as serviceWorker from "./serviceWorker";
import firebase_config from "./config/firebase.config";
import { FirebaseUserContext } from "./contexts/FirebaseUserContext";


// Init firebase account
firebase.initializeApp(firebase_config);

// Firebase auth email + some widgets i18n
firebase.auth().languageCode = (navigator.languages && 
  navigator.languages.length) ? navigator.languages[0] : navigator.language;

// Router history
const history = createBrowserHistory();


// Render app when user acquired
firebase.auth().onAuthStateChanged(function(firebaseUser) {
	// Multi-user local storage support
	if (firebaseUser && firebaseUser.hasOwnProperty('uid')) {
		localStorage.setItem('localAppCurrentUserID', firebaseUser.uid);
	}
  ReactDOM.render(
    <FirebaseUserContext.Provider value={firebaseUser}>
      <Provider store={store}>
        <App history={history} />
      </Provider>
    </FirebaseUserContext.Provider>
    , document.getElementById("root"));
  serviceWorker.unregister();
});

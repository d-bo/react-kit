import * as firebase from 'firebase/app';
import './index.scss';
import 'firebase/auth';
import 'firebase/firestore';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './redux/store';
import App from './components/app';
import { Provider } from 'react-redux';
import Profile from './components/app-profile';
import { createBrowserHistory } from 'history';
import * as serviceWorker from './serviceWorker';
import Reset from './components/auth-firebase/reset';
import SignIn from './components/auth-firebase/signin';
import firebase_config from './config/firebase.config';
import { Router, Route, Switch } from 'react-router-dom';
import Register from './components/auth-firebase/register';

// Init firebase account
firebase.initializeApp(firebase_config);

// Firebase auth email + some widgets i18n
firebase.auth().languageCode = (navigator.languages && 
  navigator.languages.length) ? navigator.languages[0] : navigator.language;

var history = createBrowserHistory();

const NotFound404 = (props) => (
  <>
  <h1>Page not found 404</h1>
  </>
);

// Render app when user acquired
firebase.auth().onAuthStateChanged(function(user) {
	ReactDOM.render(
		<Router history={history}>
			<Provider store={store}>
        <Switch>
  				<Route path="/" exact component={App} />
          <Route path="/profile" exact component={Profile} />
          <Route path="/auth/signin" component={SignIn} />
          <Route path="/auth/register" component={Register} />
          <Route path="/auth/reset" component={Reset} />
          <Route component={NotFound404} />
        </Switch>
			</Provider>
		</Router>
		, document.getElementById('root'));
	serviceWorker.unregister();
});
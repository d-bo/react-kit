import { combineReducers } from 'redux';
import { AUTH_FIREBASE, SET_EMAIL } from '../actions';
import { SET_PASSWORD, SET_NAME, LOADING, LOGOUT } from '../actions';
import 'firebase/auth';

var initState = {
	loading: false,   // global state lock ??
	email: '',
	password: '',
	displayName: '',
	city: ''
};

const firebaseAuth = (state = initState, action) => {
	switch(action.type) {
		case AUTH_FIREBASE:
			return {...state, firebase_user: action.firebase_user};
		case SET_EMAIL:
			return {...state, email: action.email};
		case SET_PASSWORD:
			return {...state, password: action.password};
		case SET_NAME:
			return {...state, displayName: action.displayName};
		case LOADING:
			return {...state, loading: action.loading};
		case LOGOUT:
			return {...state, firebase_user: null};
		default:
			return state;
	}
}

const rootReducer = combineReducers({firebaseAuth});

export default rootReducer;

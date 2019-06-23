import { combineReducers } from 'redux';
import { AUTH_FIREBASE, SET_EMAIL, SET_PROFILE_IMG_URL } from '../actions';
import { SET_PASSWORD, SET_NAME, LOADING, LOGOUT } from '../actions';


var initState = {
	loading: false,   // global state lock ??
	email: '',
	password: '',
	displayName: '',
	city: '',
	country: '',
	profileImg: ''
};

// Local state snapshot ?
const localState = localStorage.getItem('localAppState');
if (localState) {
  initState = JSON.parse(localState);
}

// Each time save state to localStorage
const storeState = function(state) {
  localStorage.setItem('localAppState', JSON.stringify(state));
  return state;
}

const firebaseAuth = (state = initState, action) => {
	switch(action.type) {

		case AUTH_FIREBASE:
			return storeState({...state, firebase_user: action.firebase_user});

		case SET_EMAIL:
			return storeState({...state, email: action.email});

		case SET_PASSWORD:
			return storeState({...state, password: action.password});

		case SET_NAME:
			return storeState({...state, displayName: action.displayName});

		case LOADING:
			return storeState({...state, loading: action.loading});

		case LOGOUT:
			return storeState({...state, firebase_user: null});

		case SET_PROFILE_IMG_URL:
			return storeState({...state, profileImg: action.img_url});
			
		default:
			return state;
	}
}

const rootReducer = combineReducers({firebaseAuth});

export default rootReducer;

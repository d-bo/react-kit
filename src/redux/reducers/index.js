import { combineReducers } from 'redux';
import { actionTypes } from '../actions';


var initState = {
	loading: false,   // global state lock ?? mutex like
	email: "",
	password: "",
	displayName: "",
	city: "",
	country: "",
	profileImgUrl: "",
};

// Local state snapshot ?
const getInitState = () => {
	const localAppCurrentUserID = localStorage.getItem('localAppCurrentUserID');

	if (localAppCurrentUserID) {
		const stateName = `localAppState${localAppCurrentUserID}`;
		const localState = localStorage.getItem(stateName);
		console.log(stateName);

		if (localState) {
		  initState = JSON.parse(localState);
		  return initState;
		}
	}

	return null;
}

// Each time save state to localStorage
const storeState = function (state) {
	const localAppCurrentUserID = localStorage.getItem('localAppCurrentUserID');
	if (localAppCurrentUserID) {
		const stateName = `localAppState${localAppCurrentUserID}`;
  	localStorage.setItem(stateName, JSON.stringify(state));
	}
  return state;
}

const firebaseAuth = (state = getInitState(), action) => {
	switch(action.type) {

		case actionTypes.AUTH_FIREBASE:
			return storeState({...state, firebaseUser: action.firebaseUser});

		case actionTypes.SET_EMAIL:
			return storeState({...state, email: action.email});

		case actionTypes.SET_PASSWORD:
			return storeState({...state, password: action.password});

		case actionTypes.SET_NAME:
			return storeState({...state, displayName: action.displayName});

		case actionTypes.LOADING:
			return storeState({...state, loading: action.loading});

		case actionTypes.LOGOUT:
			return storeState({...state, firebaseUser: null});

		case actionTypes.SET_PROFILE_IMG_URL:
			return storeState({...state, profileImgUrl: action.profileImgUrl});

		default:
			return state;
	}
}

const rootReducer = combineReducers({firebaseAuth});

export default rootReducer;

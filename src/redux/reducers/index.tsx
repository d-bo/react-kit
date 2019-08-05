import { combineReducers } from "redux";
import { actionTypes } from "../actions";

interface IInitState {
  loading: boolean;
  email: string;
  password: string;
  displayName: string;
  city: string;
  country: string;
  profileImgUrl: string;
  userData: {};
}

const initState: IInitState = {
  city: "",
  country: "",
  displayName: "",
  email: "",
  loading: false,   // global state lock ?? mutex like
  password: "",
  profileImgUrl: "",
  userData: {},
};

// Local state snapshot ?
const getInitState = () => {
  const localAppCurrentUserID = localStorage.getItem("localAppCurrentUserID");
  if (localAppCurrentUserID) {
    const stateName = `localAppState${localAppCurrentUserID}`;
    const localState = localStorage.getItem(stateName);

    if (localState) {
      return JSON.parse(localState);
    }
  }

  return initState;
};

// State to localStorage wrapper
const storeState = (state: any) => {
  const localAppCurrentUserID = localStorage.getItem("localAppCurrentUserID");
  if (localAppCurrentUserID) {
    const stateName = `localAppState${localAppCurrentUserID}`;
    localStorage.setItem(stateName, JSON.stringify(state));
  }
  return state;
};

const firebaseAuth = (state = getInitState(), action: any) => {
  switch (action.type) {

    case actionTypes.AUTH_FIREBASE:
      return storeState({
        ...state,
        firebaseUser: action.firebaseUser,
      });

    case actionTypes.SET_EMAIL:
      return storeState({
        ...state,
        email: action.email,
      });

    case actionTypes.SET_PASSWORD:
      return storeState({
        ...state,
        password: action.password,
      });

    case actionTypes.SET_NAME:
      return storeState({
        ...state,
        displayName: action.displayName,
      });

    case actionTypes.LOADING:
      return storeState({
        ...state,
        loading: action.loading,
      });

    case actionTypes.LOGOUT:
      return storeState({
        ...state,
        firebaseUser: null,
      });

    case actionTypes.SET_PROFILE_IMG_URL:
      return storeState({
        ...state,
        profileImgUrl: action.profileImgUrl,
      });

    case actionTypes.SET_USER_FIRESTORE_DATA:
      return storeState({
        ...state,
        userData: action.userData,
      });

    default:
      return state;
  }
}

const rootReducer = combineReducers({firebaseAuth});

export default rootReducer;

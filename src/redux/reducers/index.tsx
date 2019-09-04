import { combineReducers } from "redux";
import { actionTypes } from "../actions";
import produce from "immer";

interface IInitState {
  items: object[] | null;
  email: string;
  password: string;
  displayName: string;
  city: string;
  country: string;
  profileImgUrl: string;
  sidebar: boolean;
  userData: {};
}

const initState: IInitState = {
  city: "",
  country: "",
  displayName: "",
  email: "",
  items: null,
  password: "",
  profileImgUrl: "",
  sidebar: false,
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

const firebaseAuth = (state = getInitState(), action: any) =>
  produce(state, (draft: any) => {

    switch (action.type) {

      case actionTypes.AUTH_FIREBASE:
        draft.firebaseUser = action.firebaseUser;
        break;

      case actionTypes.SET_EMAIL:
        draft.email = action.email;
        break;

      case actionTypes.SET_PASSWORD:
        draft.password = action.password;
        break;

      case actionTypes.SET_NAME:
        draft.displayName = action.displayName;
        break;

      case actionTypes.LOADING:
        draft.loading = action.loading;
        break;

      case actionTypes.LOGOUT:
        draft.firebaseUser = null;
        break;

      case actionTypes.SET_PROFILE_IMG_URL:
        draft.profileImgUrl = action.profileImgUrl;
        break;

      case actionTypes.SET_USER_FIRESTORE_DATA:
        draft.userData = action.userData;
        break;

      case actionTypes.RECEIVE_ITEMS:
        draft.items = action.items;
        break;

      case actionTypes.TOGGLE_SIDEBAR:
        draft.sidebar = draft.sidebar ? false : true;
        break;

      case actionTypes.HIDE_SIDEBAR:
        draft.sidebar = false;
        break;
}});

const rootReducer = combineReducers({firebaseAuth});

export default rootReducer;

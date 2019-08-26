import { combineReducers } from "redux";
import { actionTypes } from "../actions";
import produce, { Draft } from "immer";

interface IInitState {
  items: object[] | null;
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
  items: null,
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

  // immerjs immutable state process
  return storeState(produce(state, (draft: any) => {
    switch (action.type) {

      case actionTypes.AUTH_FIREBASE:
        draft.firebaseUser = action.firebaseUser;

      case actionTypes.SET_EMAIL:
        draft.email = action.email;

      case actionTypes.SET_PASSWORD:
        draft.password = action.password;

      case actionTypes.SET_NAME:
        draft.displayName = action.displayName;

      case actionTypes.LOADING:
        draft.loading = action.loading;

      case actionTypes.LOGOUT:
        draft.firebaseUser = null;

      case actionTypes.SET_PROFILE_IMG_URL:
        draft.profileImgUrl = action.profileImgUrl;

      case actionTypes.SET_USER_FIRESTORE_DATA:
        draft.userData = action.userData;

      case actionTypes.RECEIVE_ITEMS:
        draft.items = action.items;
    }
  }));
};

const rootReducer = combineReducers({firebaseAuth});

export default rootReducer;

import { AxiosResponse } from "axios";

export const actionTypes = {
  AUTH_FIREBASE: "AUTH_FIREBASE",
  HIDE_SIDEBAR: "HIDE_SIDEBAR",
  LOADING: "LOADING",
  LOGOUT: "LOGOUT",
  RECEIVE_ITEMS: "RECEIVE_ITEMS",
  SET_EMAIL: "SET_EMAIL",
  SET_NAME: "SET_NAME",
  SET_PASSWORD: "SET_PASSWORD",
  SET_PROFILE_IMG_URL: "SET_PROFILE_IMG_URL",
  SET_USER_FIRESTORE_DATA: "SET_USER_FIRESTORE_DATA",
  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
};

interface IReduxAction {
  type: string;
  userData?: object | null;
  payload?: any;
  profileImgUrl?: string;
  sidebar?: boolean;
  firebaseUser?: firebase.User | null;
  email?: string;
  items?: AxiosResponse | null;
  password?: string;
  loading?: boolean;
  displayName?: string;
}

export const receiveItems = (items: AxiosResponse | null): IReduxAction => ({
  items,
  type: actionTypes.RECEIVE_ITEMS,
});

export const setUserFirestoreData = (userData: object | null): IReduxAction => ({
  type: actionTypes.SET_USER_FIRESTORE_DATA,
  userData,
});

export const setProfileImgUrl = (profileImgUrl: string): IReduxAction => ({
  profileImgUrl,
  type: actionTypes.SET_PROFILE_IMG_URL,
});

export const firebaseAuth = (firebaseUser: firebase.User | null): IReduxAction => ({
  firebaseUser,
  type: actionTypes.AUTH_FIREBASE,
});

export const firebaseSetEmail = (email: string): IReduxAction => ({
  email,
  type: actionTypes.SET_EMAIL,
});

export const firebaseSetPassword = (password: string): IReduxAction => ({
  password,
  type: actionTypes.SET_PASSWORD,
});

export const firebaseLoading = (loading: boolean): IReduxAction => ({
  loading,
  type: actionTypes.LOADING,
});

export const firebaseSetName = (displayName: string): IReduxAction => ({
  displayName,
  type: actionTypes.SET_NAME,
});

export const firebaseLogOut = (): IReduxAction => ({
  firebaseUser: null,
  type: actionTypes.LOGOUT,
});

export const toggleSidebar = (): IReduxAction => ({
  payload: null,
  type: actionTypes.TOGGLE_SIDEBAR,
});

export const hideSidebar = (): IReduxAction => ({
  type: actionTypes.HIDE_SIDEBAR,
});

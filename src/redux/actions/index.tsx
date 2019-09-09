import { AxiosResponse } from "axios";

export const actionTypes = {
  AUTH_FIREBASE: "AUTH_FIREBASE",
  HIDE_SIDEBAR: "HIDE_SIDEBAR",
  LOADING: "LOADING",
  LOGOUT: "LOGOUT",
  RECEIVE_ITEMS: "RECEIVE_ITEMS",
  RECEIVE_NETWORK_STATUS: "RECEIVE_NETWORK_STATUS",
  SET_EMAIL: "SET_EMAIL",
  SET_NAME: "SET_NAME",
  SET_PASSWORD: "SET_PASSWORD",
  SET_PROFILE_IMG_URL: "SET_PROFILE_IMG_URL",
  SET_USER_FIRESTORE_DATA: "SET_USER_FIRESTORE_DATA",
  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
};

export type networkStatusType = "offline" | "online" | null;

interface IReduxAction<S>  {
  type: string;
  userData?: object | null;
  payload?: any;
  profileImgUrl?: string;
  sidebar?: boolean;
  networkStatus?: networkStatusType;
  firebaseUser?: firebase.User | null;
  email?: string;
  items?: AxiosResponse | null;
  password?: S;
  loading?: S;
  displayName?: S;
}

export const receiveItems = (items: AxiosResponse | null) => ({
  items,
  type: actionTypes.RECEIVE_ITEMS,
});

export const setUserFirestoreData = (userData: object | null) => ({
  type: actionTypes.SET_USER_FIRESTORE_DATA,
  userData,
});

export const setProfileImgUrl = (profileImgUrl: string) => ({
  profileImgUrl,
  type: actionTypes.SET_PROFILE_IMG_URL,
});

export const firebaseAuth = (firebaseUser: firebase.User | null) => ({
  firebaseUser,
  type: actionTypes.AUTH_FIREBASE,
});

export const firebaseSetEmail = (email: string) => ({
  email,
  type: actionTypes.SET_EMAIL,
});

export const firebaseSetPassword = (password: IReduxAction<string>) => ({
  password,
  type: actionTypes.SET_PASSWORD,
});

export const firebaseLoading = (loading: IReduxAction<boolean>) => ({
  loading,
  type: actionTypes.LOADING,
});

export const firebaseSetName = (displayName: IReduxAction<string>) => ({
  displayName,
  type: actionTypes.SET_NAME,
});

export const firebaseLogOut = () => ({
  firebaseUser: null,
  type: actionTypes.LOGOUT,
});

export const toggleSidebar = () => ({
  payload: null,
  type: actionTypes.TOGGLE_SIDEBAR,
});

export const hideSidebar = () => ({
  type: actionTypes.HIDE_SIDEBAR,
});

export const receiveNetworkStatus = (networkStatus: networkStatusType) => ({
  networkStatus,
  type: actionTypes.RECEIVE_NETWORK_STATUS,
});

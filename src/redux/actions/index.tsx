export const actionTypes = {
  AUTH_FIREBASE: "AUTH_FIREBASE",
  LOADING: "LOADING",
  LOGOUT: "LOGOUT",
  SET_EMAIL: "SET_EMAIL",
  SET_NAME: "SET_NAME",
  SET_PASSWORD: "SET_PASSWORD",
  SET_PROFILE_IMG_URL: "SET_PROFILE_IMG_URL",
  SET_USER_FIRESTORE_DATA: "SET_USER_FIRESTORE_DATA",
};

interface IReduxAction {
  type: string;
  userData?: object | null;
  profileImgUrl?: string;
  firebaseUser?: firebase.User | null;
  email?: string;
  password?: string;
  loading?: boolean;
  displayName?: string;
}

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

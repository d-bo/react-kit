export const actionTypes = {
	AUTH_FIREBASE: "AUTH_FIREBASE",
	SET_EMAIL: "SET_EMAIL",
	SET_PASSWORD: "SET_PASSWORD",
	SET_NAME: "SET_NAME",
	LOGOUT: "LOGOUT",
	LOADING: "LOADING",
	SET_PROFILE_IMG_URL: "SET_PROFILE_IMG_URL",
	SET_USER_FIRESTORE_DATA: "SET_USER_FIRESTORE_DATA",
};

interface IReduxAction {
	type: string,
	userData?: object | null,
	profileImgUrl?: string,
	firebaseUser?: firebase.User | null,
	email?: string,
	password?: string,
	loading?: boolean,
	displayName?: string,
}

export const setUserFirestoreData = (userData: object | null): IReduxAction => ({
	type: actionTypes.SET_USER_FIRESTORE_DATA,
	userData,
});

export const setProfileImgUrl = (profileImgUrl: string): IReduxAction => ({
	type: actionTypes.SET_PROFILE_IMG_URL,
	profileImgUrl,
});

export const firebaseAuth = (firebaseUser: firebase.User | null): IReduxAction => ({
	type: actionTypes.AUTH_FIREBASE,
	firebaseUser,
});

export const firebaseSetEmail = (email: string): IReduxAction => ({
	type: actionTypes.SET_EMAIL,
	email,
});

export const firebaseSetPassword = (password: string): IReduxAction => ({
	type: actionTypes.SET_PASSWORD,
	password,
});

export const firebaseLoading = (loading: boolean): IReduxAction => ({
	type: actionTypes.LOADING,
	loading,
});

export const firebaseSetName = (displayName: string): IReduxAction => ({
	type: actionTypes.SET_NAME,
	displayName,
});

export const firebaseLogOut = (): IReduxAction => ({
	type: actionTypes.LOGOUT,
	firebaseUser: null,
});

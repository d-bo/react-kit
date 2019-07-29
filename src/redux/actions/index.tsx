export const actionTypes = {
	AUTH_FIREBASE: "AUTH_FIREBASE",
	SET_EMAIL: "SET_EMAIL",
	SET_PASSWORD: "SET_PASSWORD",
	SET_NAME: "SET_NAME",
	LOGOUT: "LOGOUT",
	LOADING: "LOADING",
	SET_PROFILE_IMG_URL: "SET_PROFILE_IMG_URL",
};

export const setProfileImgUrl = (profileImgUrl: string) => ({
	type: actionTypes.SET_PROFILE_IMG_URL,
	profileImgUrl,
});

export const firebaseAuth = (firebaseUser: firebase.User | null) => ({
	type: actionTypes.AUTH_FIREBASE,
	firebaseUser,
});

export const firebaseSetEmail = (email: string) => ({
	type: actionTypes.SET_EMAIL,
	email,
});

export const firebaseSetPassword = (password: string) => ({
	type: actionTypes.SET_PASSWORD,
	password,
});

export const firebaseLoading = (loading: boolean) => ({
	type: actionTypes.LOADING,
	loading,
});

export const firebaseSetName = (displayName: string) => ({
	type: actionTypes.SET_NAME,
	displayName,
});

export const firebaseLogOut = () => ({
	type: actionTypes.LOGOUT,
	firebaseUser: null,
});

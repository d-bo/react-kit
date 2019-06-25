export const actionTypes = {
	AUTH_FIREBASE: "AUTH_FIREBASE",
	SET_EMAIL: "SET_EMAIL",
	SET_PASSWORD: "SET_PASSWORD",
	SET_NAME: "SET_NAME",
	LOGOUT: "LOGOUT",
	LOADING: "LOADING",
	SET_PROFILE_IMG_URL: "SET_PROFILE_IMG_URL",
};

export const setProfileImgUrl = (profileImgUrl) => ({
	type: actionTypes.SET_PROFILE_IMG_URL,
	profileImgUrl,
});

export const firebaseAuth = (firebaseUser) => ({
	type: actionTypes.AUTH_FIREBASE,
	firebaseUser,
});

export const firebaseSetEmail = (email) => ({
	type: actionTypes.SET_EMAIL,
	email,
});

export const firebaseSetPassword = (password) => ({
	type: actionTypes.SET_PASSWORD,
	password,
});

export const firebaseLoading = (loading) => ({
	type: actionTypes.LOADING,
	loading,
});

export const firebaseSetName = (displayName) => ({
	type: actionTypes.SET_NAME,
	displayName,
});

export const firebaseLogOut = (firebaseUser) => ({
	type: actionTypes.LOGOUT,
	firebaseUser: null,
});

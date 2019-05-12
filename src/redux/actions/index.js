export const AUTH_FIREBASE = 'AUTH_FIREBASE';
export const SET_EMAIL = 'SET_EMAIL';
export const SET_PASSWORD = 'SET_PASSWORD';
export const SET_NAME = 'SET_NAME';
export const LOGOUT = 'LOGOUT';
export const LOADING = 'LOADING';
export const SET_PROFILE_IMG_URL = 'SET_PROFILE_IMG_URL';

export const setProfileImgUrl = img_url => ({
	type: SET_PROFILE_IMG_URL,
	img_url
});

export const firebaseAuth = firebase_user => ({
	type: AUTH_FIREBASE,
	firebase_user
});

export const firebaseSetEmail = email => ({
	type: SET_EMAIL,
	email
});

export const firebaseSetPassword = password => ({
	type: SET_PASSWORD,
	password
});

export const firebaseLoading = loading => ({
	type: LOADING,
	loading
});

export const firebaseSetName = displayName => ({
	type: SET_NAME,
	displayName
});

export const firebaseLogOut = firebase_user => ({
	type: LOGOUT,
	firebase_user: null
});
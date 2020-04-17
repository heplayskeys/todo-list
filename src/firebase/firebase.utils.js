import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
	apiKey: 'AIzaSyDDUfP83Z9VOs6fkra1RE1kVuhU_X9oXhQ',
	authDomain: 'csc335-todoapp.firebaseapp.com',
	databaseURL: 'https://csc335-todoapp.firebaseio.com',
	projectId: 'csc335-todoapp',
	storageBucket: 'csc335-todoapp.appspot.com',
	messagingSenderId: '551348834375',
	appId: '1:551348834375:web:6e6935bf1dcdc68675e162'
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
	if (!userAuth) return;

	const userRef = firestore.doc(`users/${userAuth.uid}`);
	const snapShot = await userRef.get();

	if (!snapShot.exists) {
		const { uid, displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			userRef.set({
				displayName,
				email,
				createdAt,
				...additionalData,
				userID: uid.match(/\d/g).join(''),
				todoListIDs: []
			});
		} catch (error) {
			console.log('Error creating user', error.message);
		}
	}

	return userRef;
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = event => {
	event.preventDefault();
	auth.signInWithPopup(provider);
};

export default firebase;

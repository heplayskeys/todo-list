import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyDDUfP83Z9VOs6fkra1RE1kVuhU_X9oXhQ",
  authDomain: "csc335-todoapp.firebaseapp.com",
  databaseURL: "https://csc335-todoapp.firebaseio.com",
  projectId: "csc335-todoapp",
  storageBucket: "csc335-todoapp.appspot.com",
  messagingSenderId: "551348834375",
  appId: "1:551348834375:web:6e6935bf1dcdc68675e162"
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
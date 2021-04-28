import firebase from "firebase";
import "firebase/storage";
import CONFIG from "./firebase-config.json";

// or load from some place, on .env files
const firebaseConfig = CONFIG;
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
export const auth = firebase.auth();
export const storage = firebase.storage();

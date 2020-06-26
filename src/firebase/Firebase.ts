import config from "./firebaseConfig";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import "firebase/storage";
import "firebase/firestore"; // <- needed if using firestore

class Firebase {
  auth: any;
  firestore: any;
  functions: any;
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    this.firestore = firebase.firestore();
    this.functions = firebase.functions();
  }
}

export default Firebase;

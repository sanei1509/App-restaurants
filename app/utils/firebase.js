import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDmm4WR5Y2rVqnD4mJZe1KVgZE9FypvXA8",
  authDomain: "tenedores-8c595.firebaseapp.com",
  databaseURL: "https://tenedores-8c595.firebaseio.com",
  projectId: "tenedores-8c595",
  storageBucket: "tenedores-8c595.appspot.com",
  messagingSenderId: "241651950242",
  appId: "1:241651950242:web:1f3a9cb696ebcfcb92adfb",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);

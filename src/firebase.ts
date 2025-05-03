import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCX7WnGyQnoUJ4Pm64kPj55DditUiVf7Vc",
  authDomain: "note-list-app-f5627.firebaseapp.com",
  projectId: "note-list-app-f5627",
  storageBucket: "note-list-app-f5627.appspot.com",
  messagingSenderId: "305275227699",
  appId: "1:305275227699:web:5d91dc60426b007aa8dd46",
  measurementId: "G-1RLH43QT58",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {});

// collections on the DB, how to get from the db
const dbUsers = collection(db, "users");
const dbNotes = collection(db, "notes");
const dbLists = collection(db, "lists");
const dbListItems = collection(db, "listItems");

export { auth, db, onAuthStateChanged, dbUsers, dbNotes, dbLists, dbListItems };

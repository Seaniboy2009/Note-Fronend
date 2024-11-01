// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

type UserType = {
  id: string;
  email: string;
  userId: string;
  paid: boolean;
  admin?: boolean;
};

type Note = {
  id: string;
  userId: string;
  title: string;
  category: string;
  image: string;
};

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
console.log("Firebase initialized");
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log("User is signed in:", uid);
    // ...
  } else {
    // User is signed out
    console.log("User is signed out");
    // ...
  }
});

// collections on the DB, how to get from the db
const dbUsers = collection(db, "users");
const dbNotes = collection(db, "notes");
const dbLists = collection(db, "lists");
const dbListItems = collection(db, "listItems");

getDocs(dbUsers)
  .then((snapshot) => {
    let users: UserType[] = [];

    snapshot.docs.forEach((doc) => {
      console.log("Get docs", doc.data());
      const email = doc.data().email;
      const userId = doc.data().userId;
      const paid = doc.data().paid;
      const admin = doc.data().admin;

      users.push({
        ...doc.data(),
        id: doc.id,
        email,
        userId,
        paid,
        admin,
      });
    });

    console.log("users:", users);
  })
  .catch((error) => {
    console.log("Error getting documents:", error);
  });

getDocs(dbNotes)
  .then((snapshot) => {
    let notes: Note[] = [];

    snapshot.docs.forEach((doc) => {
      console.log("Get docs", doc.data());
      const userId = doc.data().userId;
      const title = doc.data().email;
      const category = doc.data().userId;
      const image = doc.data().paid;

      notes.push({
        ...doc.data(),
        id: doc.id,
        userId,
        title,
        category,
        image,
      });
    });

    console.log("notes:", notes);
  })
  .catch((error) => {
    console.log("Error getting documents:", error);
  });

// Export Firebase services and functions
export { auth, db, onAuthStateChanged, dbUsers, dbNotes, dbLists, dbListItems };

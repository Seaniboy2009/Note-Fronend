import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { auth, db, onAuthStateChanged } from "../firebase";
import { User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

interface UserContextProps {
  children: ReactNode;
}

type UserContextValue = {
  userData: userData | null;
  setNewUser: Dispatch<SetStateAction<string>>;
};

type userData = {
  user: User | null;
  dateCreated: string;
  admin: boolean;
  sharedCalendars: string[]; // Assume sharedCalendars is always a string array
  advancedUser: boolean; // Add advancedUser field
  isNewUser: boolean;
};

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<userData | null>(null);
  const newUserState = localStorage.getItem("newUserState");
  const [newUser, setNewUser] = useState(newUserState || "false");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser); // Set user when authentication state changes
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  useEffect(() => {
    const getUserDetails = async () => {
      console.log(user);
      if (!user) {
        console.log("No user logged in.");
        setUserData(null); // Clear user data if no user is logged in
        return;
      }

      console.log("Fetching user details for:", user.uid);

      try {
        const dbCol = collection(db, "users");
        const q = query(dbCol, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]; // Assuming one matching document
          const data = doc.data();
          setUserData({
            user,
            dateCreated: data.dateCreated || "",
            admin: data.admin || false,
            sharedCalendars: data.sharedCalendars || [],
            advancedUser: data.advancedUser || false,
            isNewUser: newUser === "true",
          });
          if (!newUserState) {
            setNewUser("true"); // Reset newUser state after fetching
            localStorage.setItem("newUserState", "true");
          }
        } else {
          setUserData({
            user,
            dateCreated: "",
            admin: false,
            sharedCalendars: [],
            advancedUser: false,
            isNewUser: newUser === "true",
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserData(null);
      }
    };

    getUserDetails();
  }, [newUser, newUserState, user]); // Run only when `user` changes

  return (
    <UserContext.Provider value={{ userData, setNewUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, db, onAuthStateChanged } from "../firebase";
import { User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

interface UserContextProps {
  children: ReactNode;
}

type UserContextValue = {
  userData: userData | null;
};

type userData = {
  user: User | null;
  dateCreated: string;
  admin: boolean;
  sharedCalendars: string[];
  advancedUser: boolean;
  isNewUser: boolean;
};

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<userData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getUserDetails = async () => {
      if (!user) {
        setUserData(null);
        localStorage.setItem("newUserState", "false");
        return;
      }

      try {
        const dbCol = collection(db, "users");
        const q = query(dbCol, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();

          // Extend the user object with the name field
          const extendedUser = { ...user, name: data.name || "Unknown" };

          // Check if the logged-in user's state is already stored
          const storedNewUserState = localStorage.getItem(
            `newUserState_${user.uid}`
          );
          const isNewUser = storedNewUserState === "true";

          setUserData({
            user: extendedUser,
            dateCreated: data.dateCreated || "",
            admin: data.admin || false,
            sharedCalendars: data.sharedCalendars || [],
            advancedUser: data.advancedUser || false,
            isNewUser,
          });

          // Persist the newUser state for the current user
          if (!storedNewUserState) {
            localStorage.setItem(`newUserState_${user.uid}`, "true");
          }
        } else {
          setUserData({
            user,
            dateCreated: "",
            admin: false,
            sharedCalendars: [],
            advancedUser: false,
            isNewUser: false,
          });
          localStorage.setItem(`newUserState_${user.uid}`, "false");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserData(null);
      }
    };

    getUserDetails();
  }, [user]);

  return (
    <UserContext.Provider value={{ userData }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

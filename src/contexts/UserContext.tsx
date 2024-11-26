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

type userData = {
  user: User | null;
  dateCreated: string;
  admin: boolean;
  sharedCalendars: string[]; // Assume sharedCalendars is always a string array
};

const UserContext = createContext<userData | null>(null);

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<userData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user when authentication state changes
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  useEffect(() => {
    const getUserDetails = async () => {
      if (!user) {
        setUserData(null); // Clear user data if no user is logged in
        return;
      }

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
          });
          console.log("User details fetched successfully:", data);
        } else {
          console.warn("No user details found in Firestore.");
          setUserData({
            user,
            dateCreated: "",
            admin: false,
            sharedCalendars: [],
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserData(null);
      }
    };

    getUserDetails();
  }, [user]); // Run only when `user` changes

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

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
};

const UserContext = createContext<userData | null>(null);

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  console.log("UserProvider initiated");
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<userData | null>(null);
  const [admin, setAdmin] = useState<boolean>(false);
  const [dateCreated, setDateCreated] = useState<string>("");
  const [usingNewDB, setUsingNewDB] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    const getUserDetails = async () => {
      const dbCol = collection(db, "users");
      if (!user) return;
      console.log("User is:", user.email);
      const q = query(dbCol, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs?.forEach((doc) => {
        setAdmin(doc.data().admin);
        setDateCreated(doc.data().dateCreated);
      });
    };

    getUserDetails();
    console.log("User is:", user);

    setUserData({ user, dateCreated, admin });
    return () => unsubscribe();
  }, [admin, dateCreated, user, usingNewDB, setUsingNewDB]);

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

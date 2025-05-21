import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, db, onAuthStateChanged } from "../firebase";
import { User } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

interface UserContextProps {
  children: ReactNode;
}

type Subscription = {
  plan: string;
  active: boolean;
  startDate: Date;
  endDate: Date;
};

type UserDetails = {
  user: User | null;
  dateCreated: string;
  admin: boolean;
  sharedCalendars: string[];
  advancedUser: boolean;
  subscription: Subscription | null;
  existingSubscription: boolean;
  subscriptionEndingSoon?: boolean;
};

type UserContextValue = {
  userDetails: UserDetails | null;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>;
  refreshUserDetails: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserDetails = async () => {
    if (!user) {
      setUserDetails(null);
      localStorage.removeItem("newUserState");
      return;
    }

    try {
      const dbCol = collection(db, "users");
      const q = query(dbCol, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        const docRef = doc.ref;

        const extendedUser = { ...user, name: data.name || data.email };

        const storedNewUserState = localStorage.getItem(
          `newUserState_${user.uid}`
        );

        let subscription = null;
        let subscriptionEndingSoon = false;
        let existingSubscription = data.existingSubscription || false;

        if (data.subscription && !existingSubscription) {
          existingSubscription = true;
          await updateDoc(docRef, { existingSubscription: true });
        }

        if (data.subscription) {
          const startDate = data.subscription.startDate.toDate();
          const endDate = data.subscription.endDate.toDate();
          const now = new Date();
          const timeDiff = endDate.getTime() - now.getTime();
          const daysRemaining = timeDiff / (1000 * 60 * 60 * 24);
          const paddedNow = new Date(now.getTime() - 5 * 60 * 1000);

          if (endDate < paddedNow && data.subscription.plan !== "free") {
            await updateDoc(docRef, {
              "subscription.active": false,
              "subscription.plan": "free",
            });

            subscription = {
              ...data.subscription,
              active: false,
              plan: "free",
              startDate,
              endDate,
            };
          } else {
            if (daysRemaining <= 1) {
              subscriptionEndingSoon = true;
            }

            subscription = {
              ...data.subscription,
              startDate,
              endDate,
            };
          }
        }

        setUserDetails({
          user: extendedUser,
          dateCreated: data.dateCreated || "",
          admin: data.admin || false,
          sharedCalendars: data.sharedCalendars || [],
          advancedUser: data.advancedUser || false,
          subscription,
          subscriptionEndingSoon,
          existingSubscription,
        });

        if (!storedNewUserState) {
          localStorage.setItem(`newUserState_${user.uid}`, "true");
          localStorage.removeItem("newUserState");
        }
      } else {
        setUserDetails({
          user,
          dateCreated: "",
          admin: false,
          sharedCalendars: [],
          advancedUser: false,
          subscription: null,
          existingSubscription: false,
        });
        localStorage.setItem(`newUserState_${user.uid}`, "false");
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
      setUserDetails(null);
    }
  };

  useEffect(() => {
    refreshUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        userDetails,
        setUserDetails,
        refreshUserDetails,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

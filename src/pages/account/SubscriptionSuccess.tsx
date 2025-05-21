import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Timestamp } from "firebase/firestore";
import { Col, Container, Row } from "react-bootstrap";
import { useUser } from "../../contexts/UserContext";

const SubscriptionSuccess = () => {
  const [updatedSubscription, setUpdatedSubscription] = React.useState(false);
  const { refreshUserDetails } = useUser()!;
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const uid = searchParams.get("uid");
  const months = parseInt(searchParams.get("months") || "0", 10);

  useEffect(() => {
    const updateSubscription = async () => {
      if (!uid || !months || isNaN(months)) {
        console.log("Missing or invalid uid/months", { uid, months });
        return;
      }

      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userId", "==", uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.error("User not found");
          return;
        }

        const doc = querySnapshot.docs[0];
        const docRef = doc.ref;

        const now = new Date();
        const startDate = Timestamp.fromDate(now);
        const endDateRaw = new Date(now);
        endDateRaw.setMonth(endDateRaw.getMonth() + months);
        const endDate = Timestamp.fromDate(endDateRaw);

        console.log("Updating subscription with:", {
          plan: `${months}-month plan`,
          active: true,
          startDate: startDate.toDate(),
          endDate: endDate.toDate(),
        });

        await updateDoc(docRef, {
          "subscription.plan": `${months}-month plan`,
          "subscription.active": true,
          "subscription.startDate": startDate,
          "subscription.endDate": endDate,
          existingSubscription: true,
        });

        // Force server fetch to avoid cached data
        const querySnapshotAfterUpdate = await getDocs(q);

        if (querySnapshotAfterUpdate.empty) {
          console.error("User not found");
          return;
        }

        const docAfterUpdate = querySnapshotAfterUpdate.docs[0];
        const dataAfterUpdate = docAfterUpdate.data();

        console.log("Updated subscription data after update:", {
          plan: dataAfterUpdate.subscription.plan,
          active: dataAfterUpdate.subscription.active,
          startDate: dataAfterUpdate.subscription.startDate.toDate(),
          endDate: dataAfterUpdate.subscription.endDate.toDate(),
        });

        // Make sure to refresh user details in your app state/context here
        await refreshUserDetails();

        setUpdatedSubscription(true);
        setTimeout(
          () => navigate("/account?fromSubscriptionSuccess=true"),
          1000
        );
      } catch (err) {
        console.error("Error updating subscription:", err);
      }
    };

    updateSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, months, navigate]);

  return (
    <Container style={{ padding: "2rem", textAlign: "center" }}>
      <Row>
        <Col>
          {" "}
          <h2>Thanks for subscribing!</h2>
          {!updatedSubscription ? (
            <p>Activating your subscription now...</p>
          ) : (
            <>
              <p>Your subscription is active!</p>
              <p>Redirecting in now...</p>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SubscriptionSuccess;

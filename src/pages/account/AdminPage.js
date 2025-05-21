import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import appStyle from "../../styles/App.module.css";
import { useTheme } from "../../contexts/ThemeSelection";
import { useUser } from "../../contexts/UserContext";
import { dbUsers } from "../../firebase";
import { getDocs, updateDoc } from "firebase/firestore";
import ThemedButton from "../../components/ThemedButton";

const AdminPage = ({ props }) => {
  const { userDetails } = useUser();
  const { activeTheme, theme } = useTheme();
  const admin = userDetails?.admin || false;
  const [users, setUsers] = useState([]);

  const handleAdmin = (user) => {
    console.log("handleAdmin", user);
    getDocs(dbUsers).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().userId === user.userId) {
          updateDoc(doc.ref, { admin: !doc.data().admin });
        }
      });
    });
    try {
    } catch (error) {
      console.error("Error updating admin: ", error);
    }
  };

  const handleAdvancedUser = (user) => {
    getDocs(dbUsers).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().userId === user.userId) {
          updateDoc(doc.ref, { advancedUser: !doc.data().advancedUser });
        }
      });
    });
    try {
    } catch (error) {
      console.error("Error updating advanced user: ", error);
    }
  };

  useEffect(() => {
    if (!admin) {
      return;
    }
    if (admin) {
      getDocs(dbUsers)
        .then((snapshot) => {
          let users = [];

          snapshot.docs.forEach((doc) => {
            const email = doc.data()?.email;
            const userId = doc.data()?.userId;
            const admin = doc.data()?.admin;
            users.push({
              ...doc.data(),
              id: doc.id || "No id",
              email: email || "No email",
              userId: userId || "No userId",
              admin: admin || false,
            });
          });
          setUsers(users);
        })
        .catch((error) => {
          console.log("Error getting documents:", error);
        });
    }
  }, [admin]);

  return (
    <Container
      style={{
        backgroundColor: theme[activeTheme].panelColor,
        border: theme[activeTheme].border,
      }}
      className={appStyle.BackgroundContainer}
    >
      <Row>
        <Col>{admin && <p>Users Admin View</p>}</Col>
      </Row>

      {users.map((user) => (
        <Row
          key={`${user.userId} ${user.email}`}
          style={{ padding: "5px", textAlign: "left" }}
        >
          {" "}
          <Col>
            <strong>
              Email: {user.email} {user.admin ? "A" : null}{" "}
              {user.advancedUser ? "/ U" : null}
            </strong>{" "}
            <ThemedButton onClick={() => handleAdmin(user)}>
              {user.admin ? "Remove admin" : "Make admin"}
            </ThemedButton>
            <ThemedButton onClick={() => handleAdvancedUser(user)}>
              {user.advancedUser
                ? "Remove advanced user"
                : "Make advanced user"}
            </ThemedButton>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default AdminPage;
